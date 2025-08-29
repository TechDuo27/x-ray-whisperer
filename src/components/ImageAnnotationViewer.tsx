import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Detection, DETECTION_COLORS, drawAnnotations } from '@/utils/modelLoader';

interface ImageAnnotationViewerProps {
  originalImageUrl: string;
  detections: Detection[];
  filename: string;
  onAnnotated?: (dataUrl: string) => void;
}

export default function ImageAnnotationViewer({ 
  originalImageUrl, 
  detections, 
  filename,
  onAnnotated 
}: ImageAnnotationViewerProps) {
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string>('');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const annotatedImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const generateAnnotatedImage = async () => {
      setLoading(true);
      try {
        // Use the drawAnnotations function from modelLoader.ts
        const annotated = await drawAnnotations(originalImageUrl, detections);
        setAnnotatedImageUrl(annotated);
        
        // Call onAnnotated callback with the data URL
        if (onAnnotated) {
          onAnnotated(annotated);
        }
      } catch (error) {
        console.error('Failed to generate annotated image:', error);
      } finally {
        setLoading(false);
      }
    };

    if (originalImageUrl && detections.length > 0) {
      generateAnnotatedImage();
    }
  }, [originalImageUrl, detections, onAnnotated]);

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
                src={originalImageUrl}
                alt={`Original ${filename}`}
                className="w-full h-auto transition-transform pointer-events-none"
                style={{ 
                  transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                  transformOrigin: 'center center'
                }}
                draggable={false}
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
                    ref={annotatedImageRef}
                    src={annotatedImageUrl}
                    alt={`Annotated ${filename}`}
                    className="w-full h-auto annotation-canvas transition-transform pointer-events-none"
                    style={{ 
                      transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
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