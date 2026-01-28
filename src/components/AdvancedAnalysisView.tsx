import { useState, useRef, useEffect, useMemo, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sun, PenTool, RotateCcw, Eraser, MessageSquarePlus, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { drawAnnotations, getHexColor } from '@/utils/modelLoader';
import { toast } from '@/hooks/use-toast';
import FeedbackForm from '@/components/FeedbackForm';
import { useAuth } from '@/hooks/useAuth';

interface Analysis {
  id: string;
  original_filename: string;
  analysis_results: any;
  confidence_threshold: number;
  created_at: string;
  image_url: string;
}

interface AdvancedAnalysisViewProps {
  analysis: Analysis;
  onBack: () => void;
}

const ALL_COLOR_CLASSES = [
  { name: 'SUPERNUMERARY TEETH', color: '#C7F464' },
  { name: 'GROSSLY DECAYED', color: '#FF4444' },
  { name: 'GROSSLY CARIOUS', color: '#FF1111' },
  { name: 'SPACING', color: '#FFD700' },
  { name: 'ROOT RESORPTION', color: '#FF8C42' },
  { name: 'ABRASION', color: '#FFB84D' },
  { name: 'DENTAL CARIES', color: '#FF6B6B' },
  { name: 'BONE LOSS', color: '#9B59B6' },
  { name: 'CYST', color: '#E74C3C' },
  { name: 'IMPACTED TEETH', color: '#00D4FF' },
  { name: 'MISSING TOOTH', color: '#95A5A6' },
  { name: 'CROWNS', color: '#3498DB' },
  { name: 'ROOT CANAL TREATMENT', color: '#E67E22' },
  { name: 'IMPLANTS', color: '#4ECDC4' },
  { name: 'PERIAPICAL PATHOLOGY', color: '#C0392B' },
  { name: 'BONE FRACTURE', color: '#8E44AD' },
  { name: 'TOOTH FRACTURE', color: '#C0392B' },
  { name: 'RCT TOOTH', color: '#FFB84D' },
  { name: 'RESTORATIONS', color: '#FFD700' },
  { name: 'RETAINED DECIDUOUS TOOTH', color: '#BDC3C7' },
  { name: 'ROOT STUMP', color: '#7F8C8D' },
  { name: 'INTERNAL RESORPTION', color: '#E74C3C' },
  { name: 'MANDIBULAR CANAL', color: '#00D1B2' },
];

export default function AdvancedAnalysisView({ analysis, onBack }: AdvancedAnalysisViewProps) {
  const { user } = useAuth();

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState('');
  const [showOriginal] = useState(false);

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [includeDrawingsInReport, setIncludeDrawingsInReport] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const drawing = useRef(false);
  const hasDrawn = useRef(false);

  const detections = analysis.analysis_results?.detections || [];

  const filteredDetections = useMemo(
    () => detections.filter((d: any) => d.confidence >= analysis.confidence_threshold),
    [detections, analysis.confidence_threshold]
  );

  const groupedDetections = useMemo(() => {
    const obj: any = {};
    filteredDetections.forEach((d: any) => {
      const key = d.display_name || d.class_;
      if (!obj[key]) {
        obj[key] = {
          display_name: key,
          count: 1,
          color: getHexColor(d),
          description: d.description || `${key} detected.`,
        };
      } else obj[key].count++;
    });
    return Object.values(obj);
  }, [filteredDetections]);

  useEffect(() => {
    const load = async () => {
      if (analysis.analysis_results?.annotated_image_base64_png) {
        setAnnotatedImageUrl(`data:image/png;base64,${analysis.analysis_results.annotated_image_base64_png}`);
      } else {
        const url = await drawAnnotations(analysis.image_url, filteredDetections);
        setAnnotatedImageUrl(url);
      }
    };
    load();
  }, [analysis, filteredDetections]);

  const setupCanvas = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,0,0,0.9)';
    }
  };

  const startDraw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    drawing.current = true;
    hasDrawn.current = true;
    const rect = canvasRef.current!.getBoundingClientRect();
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const clearDrawings = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    hasDrawn.current = false;
  };

  const resetImageSettings = () => {
    setBrightness(100);
    setContrast(100);
    setZoom(100);
  };

  /** FIXED — proper merging returning Promise<string> */
  const mergeImageAndCanvas = (): Promise<string> => {
    return new Promise((resolve) => {
      const base = new Image();
      base.src = annotatedImageUrl;

      base.onload = () => {
        const merged = document.createElement('canvas');
        merged.width = base.naturalWidth;
        merged.height = base.naturalHeight;
        const ctx = merged.getContext('2d')!;
        ctx.drawImage(base, 0, 0, merged.width, merged.height);

        if (includeDrawingsInReport && hasDrawn.current && canvasRef.current) {
          ctx.drawImage(canvasRef.current, 0, 0, merged.width, merged.height);
        }

        resolve(merged.toDataURL('image/png'));
      };
    });
  };

  /** REPLACED generateReport with full styled report from old version */
  const generateReport = async () => {
    try {
      toast({ title: 'Generating Report', description: 'Creating your report...' });

      const exportImg = includeDrawingsInReport
        ? await mergeImageAndCanvas()
        : annotatedImageUrl;

      const uniqueDetections = groupedDetections;
      const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

      const reportContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Dental Report</title>
<style>
body{font-family:sans-serif;padding:20px;}
h1{font-size:1.8em;margin-bottom:.5em;}
.finding{margin:.5em 0;padding:.5em;border-left:4px solid;}
.legend{margin-top:1em;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:6px;}
.legend-item{display:flex;align-items:center;gap:6px;}
.box{width:16px;height:16px;border-radius:3px;}
</style>
</head>
<body>
<h1>🦷 Oral Health Analyzer Report</h1>
<p><b>Patient:</b> ${user?.user_metadata?.full_name || 'Unknown Patient'}</p>
<p><b>Date:</b> ${formatDate(analysis.created_at)}</p>
<hr/>
<h2>Annotated Image</h2>
<img src="${exportImg}" style="max-width:100%;border:1px solid #ccc;border-radius:6px;"/>
<h2>Findings</h2>
${uniqueDetections.length === 0 ? `<p>No findings detected.</p>` :
  uniqueDetections.map((d: any) => `
<div class="finding" style="border-color:${d.color}">
  <b>${d.display_name}</b> — ${d.count} detected
  <div style="opacity:.7;font-size:.9em;">${d.description}</div>
</div>
`).join('')}
<h2>Color Legend</h2>
<div class="legend">
${uniqueDetections.map((d: any) => `
<div class="legend-item">
<div class="box" style="background:${d.color}"></div>
<span>${d.display_name}</span>
</div>`).join('')}
</div>
<p style="margin-top:2em;opacity:.6;font-size:.9em;">
Generated by Oral Health Analyzer • ${new Date().toLocaleDateString()}
</p>
</body>
</html>
`;

      const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dental-report-${analysis.original_filename.replace(/\.[^/.]+$/, '')}-${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: 'Report Downloaded', description: 'Your report has been created.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to generate report.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2"/>Back</Button>
        <h2 className="font-semibold text-lg">{analysis.original_filename}</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative flex justify-center bg-muted/20 p-4 rounded border select-none">
            <div style={{filter:`brightness(${brightness}%) contrast(${contrast}%)`,transform:`scale(${zoom/100})`,transformOrigin:'center'}}>
              <img ref={imgRef} src={annotatedImageUrl || analysis.image_url} onLoad={setupCanvas} className="max-h-[70vh] pointer-events-none"/>
              {!showOriginal && (
                <canvas ref={canvasRef}
                  className="absolute top-0 left-0"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                />
              )}
            </div>
          </div>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Color Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_COLOR_CLASSES.map(c => (
                <div key={c.name} className="flex items-center gap-2"><div className="w-3 h-3" style={{background:c.color}}/><span className="text-xs">{c.name}</span></div>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Detections</h3>
            {groupedDetections.map((d:any)=>(
              <Card key={d.display_name} className="p-3 bg-muted/10 border space-y-1">
                <div className="flex items-center gap-2"><div className="w-3 h-3" style={{background:d.color}}/><span>{d.display_name}</span></div>
                <span className="text-xs">{d.count} detected</span>
              </Card>
            ))}
          </Card>
        </div>

        <Card className="w-80 p-6 space-y-8 h-fit">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Sun className="h-4 w-4"/>Adjustments</h3>
            <div className="mb-2">Zoom {zoom}%</div>
            <div className="flex gap-2 mb-3">
              <Button size="icon" variant="outline" onClick={()=>setZoom(z=>Math.max(50,z-10))}><ZoomOut/></Button>
              <input type="range" min="50" max="200" value={zoom} onChange={e=>setZoom(+e.target.value)} className="flex-1"/>
              <Button size="icon" variant="outline" onClick={()=>setZoom(z=>Math.min(200,z+10))}><ZoomIn/></Button>
            </div>

            <div className="mb-2">Brightness {brightness}%</div>
            <input type="range" min="50" max="150" value={brightness} onChange={e=>setBrightness(+e.target.value)} className="w-full"/>

            <div className="mt-3 mb-2">Contrast {contrast}%</div>
            <input type="range" min="50" max="150" value={contrast} onChange={e=>setContrast(+e.target.value)} className="w-full"/>

            <Button className="w-full mt-3" variant="outline" onClick={resetImageSettings}><RotateCcw className="h-4 w-4 mr-1"/>Reset</Button>
          </div>

          <Separator/>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><PenTool className="h-4 w-4"/>Annotation</h3>
            <Button className="w-full justify-start" variant={isDrawingMode?'default':'outline'} onClick={()=>setIsDrawingMode(m=>!m)}>
              <PenTool className="h-4 w-4 mr-2"/>{isDrawingMode?'Stop Drawing':'Draw'}
            </Button>
            {hasDrawn.current && (
              <Button className="w-full justify-start text-destructive" variant="outline" onClick={clearDrawings}>
                <Eraser className="h-4 w-4 mr-2"/>Clear Drawings
              </Button>
            )}

            <label className="text-xs flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" checked={includeDrawingsInReport} onChange={e=>setIncludeDrawingsInReport(e.target.checked)}/>
              Include drawings in report
            </label>
          </div>

          <Separator/>

          <div className="space-y-3">
            <Button className="w-full" onClick={generateReport}><Download className="h-4 w-4 mr-2"/>Download Report</Button>
            <Button className="w-full" variant="secondary" onClick={()=>setIsFeedbackOpen(true)}><MessageSquarePlus className="h-4 w-4 mr-2"/>Feedback</Button>
          </div>
        </Card>
      </div>

      <FeedbackForm isOpen={isFeedbackOpen} onClose={()=>setIsFeedbackOpen(false)} analysisId={analysis.id} imageUrl={annotatedImageUrl}/>
    </div>
  );
}
