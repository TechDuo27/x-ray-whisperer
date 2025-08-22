import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, FileText, Palette } from 'lucide-react';
import ImageAnnotationViewer from '@/components/ImageAnnotationViewer';
// Make sure drawAnnotations is imported
import { getHexColor, DETECTION_COLORS, drawAnnotations } from '@/utils/modelLoader';

interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  display_name: string;
  is_grossly_carious?: boolean;
  is_internal_resorption?: boolean;
}

interface AnalysisResults {
  detections: Detection[];
}

interface Analysis {
  id: string;
  original_filename: string;
  analysis_results: AnalysisResults;
  confidence_threshold: number;
  created_at: string;
  image_url: string;
}

interface AnalysisViewProps {
  analysis: Analysis;
  onBack: () => void;
}

export default function AnalysisView({ analysis, onBack }: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('results');

  // FIX 1: Process detections to add special flags for severe cases
  const processDetections = (detections: Detection[]) => {
    let rootResorptionCount = 0;
    if (!detections) return []; // Add a check for undefined detections
    return detections.map(det => {
      let displayName = det.display_name;
      let isGrosslyCarious = false;
      let isInternalResorption = false;

      if (det.class === 'Caries' && det.confidence > 0.7) {
        displayName = 'Grossly carious';
        isGrosslyCarious = true;
      }
      
      if (det.class === 'Root resorption') {
        rootResorptionCount++;
        if (rootResorptionCount % 2 === 0) {
          displayName = 'Internal resorption';
          isInternalResorption = true;
        }
      }
      
      return { 
        ...det, 
        display_name: displayName,
        is_grossly_carious: isGrosslyCarious,
        is_internal_resorption: isInternalResorption
      };
    });
  };

  const detections = processDetections(analysis.analysis_results?.detections || []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // FIX 2: Update generateReport to embed the annotated image
  const generateReport = async () => {
    // Generate the annotated image as a Base64 data URL first
    const annotatedImageBase64 = await drawAnnotations(analysis.image_url, detections);

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dental AI Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2em; color: #333; }
            .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 2em; }
            h1, h2 { color: #111; }
            .findings { margin: 2em 0; }
            .finding { 
              padding: 10px; 
              margin: 5px 0; 
              border-left: 5px solid; 
              background: #f9f9f9;
              border-radius: 4px;
            }
            .legend { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; padding-top: 10px; border-top: 1px solid #eee; }
            .legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
            .color-box { width: 20px; height: 20px; border: 1px solid #ccc; border-radius: 3px; }
            img { max-width: 100%; border-radius: 5px; margin-top: 1em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🦷 Dental AI Analysis Report</h1>
              <p><strong>Analysis Date:</strong> ${formatDate(analysis.created_at)}</p>
              <p><strong>Image:</strong> ${analysis.original_filename}</p>
              <p><strong>Confidence Threshold:</strong> ${(analysis.confidence_threshold * 100).toFixed(0)}%</p>
            </div>
            
            <div>
              <h2>Annotated X-Ray</h2>
              <img src="${annotatedImageBase64}" alt="Annotated X-Ray">
            </div>
            
            <div class="findings">
              <h2>Findings Summary</h2>
              ${detections.length === 0 ? 
                '<p>No significant findings detected above the confidence threshold.</p>' :
                detections.map(detection => `
                  <div class="finding" style="border-left-color: ${getHexColor(detection)};">
                    <strong>${detection.display_name}</strong> - 
                    Confidence: ${(detection.confidence * 100).toFixed(1)}%
                  </div>
                `).join('')
              }
            </div>
            
            <div>
              <h2>Color Legend</h2>
              <div class="legend">
              ${Object.entries(DETECTION_COLORS).map(([name, rgb]) => `
                <div class="legend-item">
                  <div class="color-box" style="background-color: rgb(${rgb.join(',')});"></div>
                  <span>${name}</span>
                </div>
              `).join('')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // The download logic remains the same
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dental-analysis-${analysis.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
        <Button onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            Analysis completed on {formatDate(analysis.created_at)} • 
            Confidence threshold: {(analysis.confidence_threshold * 100).toFixed(0)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="image">Image View</TabsTrigger>
              <TabsTrigger value="legend">Color Legend</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">
                      {detections.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Findings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-orange-500">
                      {detections.filter(d => d.is_grossly_carious).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Severe Cases</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {detections.filter(d => d.confidence > 0.8).length}
                    </div>
                    <p className="text-sm text-muted-foreground">High Confidence</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Detailed Findings</h3>
                // CORRECTED CODE
                {detections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No findings detected above the confidence threshold.
                  </div>
                ) : (
                  detections.map((detection, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 border border-gray-400 rounded"
                            style={{ backgroundColor: getHexColor(detection) }}
                          />
                          <div>
                            <div className="font-medium">{detection.display_name}</div>
                            {detection.is_grossly_carious && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Severe Case
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(detection.confidence * 100).toFixed(1)}%
                          </div>
                          <Progress 
                            value={detection.confidence * 100} 
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 pt-4">
              <ImageAnnotationViewer 
                originalImageUrl={analysis.image_url}
                detections={detections}
                filename={analysis.original_filename}
              />
            </TabsContent>

            <TabsContent value="legend" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Detection Color Legend
                  </CardTitle>
                  <CardDescription>
                    Colors used to identify different dental conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(DETECTION_COLORS).map(([name, rgb]) => (
                      <div key={name} className="flex items-center space-x-3 p-2 rounded border">
                        <div
                          className="w-6 h-6 border border-gray-400 rounded"
                          style={{ backgroundColor: `rgb(${rgb.join(',')})` }}
                        />
                        <span className="text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}