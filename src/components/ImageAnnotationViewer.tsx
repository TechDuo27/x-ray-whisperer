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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-16 text-center">{zoom}%</span>
        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
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
            <div className="overflow-auto max-h-96 border rounded-lg">
              <img
                src={originalImageUrl}
                alt={`Original ${filename}`}
                className="w-full h-auto transition-transform"
                style={{ transform: `scale(${zoom / 100})` }}
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
            <div className="overflow-auto max-h-96 border rounded-lg">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Generating annotations...</div>
                </div>
              ) : annotatedImageUrl ? (
                <>
                  <img
                    src={annotatedImageUrl}
                    alt={`Annotated ${filename}`}
                    className="w-full h-auto annotation-canvas transition-transform"
                    style={{ transform: `scale(${zoom / 100})` }}
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