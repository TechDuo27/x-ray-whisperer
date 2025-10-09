import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Detection, DETECTION_COLORS, drawAnnotations } from '@/utils/modelLoader';
import { cacheBlob, getCachedImageUrl, dataUrlToBlob, hashString } from '@/utils/imageCache';
interface ImageAnnotationViewerProps {
  originalImageUrl: string;
  detections: Detection[];
  filename: string;
  annotatedImageBase64?: string; // optional pre-rendered annotated image from backend
  onAnnotated?: (dataUrl: string) => void;
}

export default function ImageAnnotationViewer({ 
  originalImageUrl, 
  detections, 
  filename,
  annotatedImageBase64,
  onAnnotated 
}: ImageAnnotationViewerProps) {
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string>('');
  const [originalCachedUrl, setOriginalCachedUrl] = useState<string>('');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  // Stable stringify to avoid flicker when objects re-create with same content
  const stableStringify = (value: any): string => {
    const seen = new WeakSet();
    const normalize = (val: any): any => {
      if (val && typeof val === 'object') {
        if (seen.has(val)) return undefined;
        seen.add(val);
        if (Array.isArray(val)) return val.map(normalize);
        const keys = Object.keys(val).sort();
        const obj: any = {};
        for (const k of keys) obj[k] = normalize(val[k]);
        return obj;
      }
      return val;
    };
    return JSON.stringify(normalize(value));
  };

  const detectionsHash = useMemo(() => hashString(stableStringify(detections)), [detections]);

  const annoKey = useMemo(() => {
    if (annotatedImageBase64 && annotatedImageBase64.length > 0) {
      const sample = annotatedImageBase64.startsWith('data:')
        ? annotatedImageBase64
        : `data:image/png;base64,${annotatedImageBase64}`;
      return `anno:b64:${hashString(sample.slice(0, 1024))}`;
    }
    return `anno:v3:${hashString(originalImageUrl)}:${detectionsHash}`;
  }, [annotatedImageBase64, originalImageUrl, detectionsHash]);

  const notifiedKeyRef = useRef<string>('');

  // Persistently cache the original image so it doesn't re-download on tab switches
  useEffect(() => {
    let revokeUrl: string | null = null;
    const run = async () => {
      try {
        const key = `orig:${hashString(originalImageUrl)}`;
        const cachedUrl = await getCachedImageUrl(key);
        if (cachedUrl) {
          setOriginalCachedUrl(cachedUrl);
          return;
        }
        const res = await fetch(originalImageUrl, { cache: 'force-cache' });
        const blob = await res.blob();
        await cacheBlob(key, blob);
        const url = URL.createObjectURL(blob);
        revokeUrl = url;
        setOriginalCachedUrl(url);
      } catch {
        setOriginalCachedUrl('');
      }
    };
    if (originalImageUrl) run();
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [originalImageUrl]);

  // Generate or load annotated image with strong persistence and stable keys
  useEffect(() => {
    let revokeUrl: string | null = null;
    let cancelled = false;

    const run = async () => {
      // If nothing to draw and no precomputed image, do nothing
      if (!originalImageUrl || (detections.length === 0 && !annotatedImageBase64)) {
        setLoading(false);
        return;
      }

      // 1) Persistent cache by annoKey
      const cachedUrl = await getCachedImageUrl(annoKey);
      if (!cancelled && cachedUrl) {
        setAnnotatedImageUrl(cachedUrl);
        setLoading(false);
        // Convert blob URL to data URL for report generation
        if (notifiedKeyRef.current !== annoKey && onAnnotated) {
          notifiedKeyRef.current = annoKey;
          try {
            const response = await fetch(cachedUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              if (dataUrl && dataUrl.startsWith('data:')) {
                onAnnotated(dataUrl);
              }
            };
            reader.readAsDataURL(blob);
          } catch (err) {
            console.error('Failed to convert cached URL to data URL:', err);
          }
        }
        return;
      }

      // 2) Prefer precomputed annotated image from backend if available
      if (annotatedImageBase64 && !cancelled) {
        try {
          const dataUrl = annotatedImageBase64.startsWith('data:')
            ? annotatedImageBase64
            : `data:image/png;base64,${annotatedImageBase64}`;
          const blob = dataUrlToBlob(dataUrl);
          await cacheBlob(annoKey, blob);
          const url = URL.createObjectURL(blob);
          revokeUrl = url;
          setAnnotatedImageUrl(url);
          if (notifiedKeyRef.current !== annoKey && onAnnotated) {
            notifiedKeyRef.current = annoKey;
            onAnnotated(dataUrl);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      // 3) Fallback: generate annotations client-side once
      setLoading(true);
      try {
        const annotatedDataUrl = await drawAnnotations(originalImageUrl, detections);
        const blob = dataUrlToBlob(annotatedDataUrl);
        await cacheBlob(annoKey, blob);
        const url = URL.createObjectURL(blob);
        revokeUrl = url;
        setAnnotatedImageUrl(url);
        if (notifiedKeyRef.current !== annoKey && onAnnotated) {
          notifiedKeyRef.current = annoKey;
          onAnnotated(annotatedDataUrl);
        }
      } catch (e) {
        console.error('Failed to generate annotated image:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [annoKey, annotatedImageBase64, originalImageUrl, detections, onAnnotated]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-16 text-center">{zoom}%</span>
        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 400}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleResetZoom}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Split View Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Original X-Ray</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="overflow-auto max-h-96 border rounded-lg cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={originalImageRef}
                src={originalCachedUrl || originalImageUrl}
                alt={`Original ${filename}`}
                className="w-full h-auto transition-transform pointer-events-none"
                style={{ 
                  transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                  transformOrigin: 'center center'
                }}
                draggable={false}
                loading="eager"
                decoding="sync"
              />
            </div>
          </CardContent>
        </Card>

        {/* Annotated Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              AI Analysis ({detections.length} findings)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="overflow-auto max-h-96 border rounded-lg cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Generating annotations...</div>
                </div>
              ) : annotatedImageUrl ? (
                <>
                  <img
                    src={annotatedImageUrl}
                    alt={`Annotated ${filename}`}
                    className="w-full h-auto annotation-canvas transition-transform pointer-events-none"
                    style={{ 
                      transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                    loading="eager"
                    decoding="sync"
                  />
                  {/* Hidden canvas for capture */}
                  <canvas 
                    ref={canvasRef}
                    className="annotation-canvas hidden"
                    width={1000}
                    height={1000}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">No annotations to display</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}