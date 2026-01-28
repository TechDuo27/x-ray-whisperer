import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, PenTool, Eraser } from 'lucide-react';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  analysisId: string;
  imageUrl: string;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

export default function FeedbackForm({ isOpen, onClose, analysisId, imageUrl }: FeedbackFormProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  const [ready, setReady] = useState(false);

  // Load base image
  useEffect(() => {
    if (!isOpen) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      baseImageRef.current = img;
      requestAnimationFrame(() => {
        initializeCanvas();
      });
    };
    img.onerror = () => {
      toast({
        title: "Error",
        description: "Could not load image for feedback.",
        variant: "destructive",
      });
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const img = baseImageRef.current;
    if (!canvas || !img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;
    redraw();
    setReady(true);
  };

  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    let cx, cy;
    if (e.touches) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  };

  const redraw = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const img = baseImageRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img) ctx.drawImage(img, 0, 0);

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ef4444';
    ctx.lineCap = 'round';

    strokesRef.current.forEach(stroke => {
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  };

  const start = (e: any) => {
    if (!ready) return;

    const pos = getPos(e);

    if (mode === 'erase') {
      strokesRef.current = strokesRef.current.filter(
        stroke => !stroke.points.some(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 20)
      );
      redraw();
      return;
    }

    currentStrokeRef.current = { points: [pos] };
  };

  const move = (e: any) => {
    if (!currentStrokeRef.current || mode !== 'draw') return;

    const pos = getPos(e);
    currentStrokeRef.current.points.push(pos);

    redraw();
    const ctx = ctxRef.current!;
    const pts = currentStrokeRef.current.points;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  };

  const end = () => {
    if (currentStrokeRef.current) {
      strokesRef.current.push(currentStrokeRef.current);
      currentStrokeRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      return toast({ title: "Error", description: "Feedback cannot be empty.", variant: "destructive" });
    }

    setIsSubmitting(true);
    let feedbackImageUrl = null;

    const blob = await new Promise<Blob | null>(resolve =>
      canvasRef.current?.toBlob(resolve, 'image/png')
    );

    if (blob) {
      const fileName = `feedback/${analysisId}_${Date.now()}.png`;
      const { error } = await supabase.storage.from('xrays').upload(fileName, blob);
      if (!error) {
        const { data } = supabase.storage.from('xrays').getPublicUrl(fileName);
        feedbackImageUrl = data.publicUrl;
      }
    }

    await supabase.from('analyses')
      .update({
        feedback_text: feedbackText.trim(),
        feedback_image_url: feedbackImageUrl,
        feedback_submitted_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    toast({ title: 'Feedback Submitted', description: 'Thank you!' });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>Draw on the image and describe the feedback.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-3">
          <Button variant={mode === 'draw' ? "default" : "outline"} onClick={() => setMode('draw')}>
            <PenTool className="h-4 w-4 mr-2" /> Draw
          </Button>
          <Button variant={mode === 'erase' ? "default" : "outline"} onClick={() => setMode('erase')}>
            <Eraser className="h-4 w-4 mr-2" /> Erase
          </Button>
        </div>

        <div className="flex-1 overflow-auto border rounded-md bg-muted flex justify-center items-center p-2">
          <canvas
            ref={canvasRef}
            className="touch-none max-w-full"
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
          />
        </div>

        <Textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Describe what should be corrected..."
          className="mt-3 h-24 resize-none"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
