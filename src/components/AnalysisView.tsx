import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, FileText, Palette } from 'lucide-react';
import ImageAnnotationViewer from '@/components/ImageAnnotationViewer';
import { getHexColor, DETECTION_COLORS } from '@/utils/modelLoader';

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

// Disease descriptions
const DISEASE_DESCRIPTIONS: Record<string, string> = {
  'SUPERNUMERARY TEETH': 'Supernumerary teeth are teeth that develop in addition to the normal number of teeth. They may occur in the primary or permanent dentition, can be single or multiple, unilateral or bilateral and may appear in any region of the dental arch.',
  'GROSSLY DECAYED': 'Grossly decayed tooth is a tooth in which dental caries has progressed extensively, leading to the destruction of a large portion of the tooth structure, often involving both enamel and dentin and in many cases extending close to or into the pulp.',
  'SPACING': 'Spacing is a type of malocclusion characterised by the presence of spaces or gaps between two or more teeth in the arch, due to descrepency between tooth size & jaw size, missing teeth or abnormal dental development.',
  'ROOT RESORPTION': 'Root resorption is a process in which hard tissues of a root like cementum and dentin are broken down & absorbed by the body, usually due to the activity of odontoclasts.',
  'ABRASION': 'Abrasion is the Pathological wearing away of the tooth structure caused by mechanical forces from external objects or factors other than tooth * to * tooth contact. It commonly results from habits such as aggressive tooth brushing, use of hard bristled brushing, or biting on hard objects leading to loss of enamel, usually at the cervical region of the teeth.',
  'DENTAL CARIES': 'Dental caries is defined as a Microbial disease of the calcified tissues of the teeth, which is characterized by the Demineralization of the inorganic portion & destruction of the organic substance of the tooth.',
  'BONE LOSS': 'Bone loss of the tooth is the Pathological reduction in the height & density of the alveolar bone that supports the teeth, leading to loosening, mobility or eventual tooth loss if untreated.',
  'CYST': 'A pathological cavity having fluid, semi fluid, or gaseous contents, which is not created by the accumulation of pus, and is usually lined by epithelium.',
  'IMPACTED TEETH': 'Impacted teeth are teeth that fail to erupt into the proper functional position in the arch within the expected time, due to obstruction by overlying gum tissue, bone, or adjacent teeth.',
  'MISSING TOOTH': 'A missing tooth refers to the absence of one or more teeth in the arch, which may occur due to congenital reasons, pathological causes (like dental caries, periodontal disease, trauma) or extraction. Missing teeth can affect oral function (chewing, speech), aesthetics (like smile & facial profile) & the overall health of the stomatognathic system by leading to drifting, tilting, supra eruption, malocclusion & bone resorption in the edentulous area.',
  'RESTORATION': 'Dental restorations are procedures that restore the function, integrity, and morphology of missing tooth structure resulting from caries or external trauma, or to improve the aesthetics of the tooth.',
  'CROWNS': 'Dental crowns are tooth-shaped caps placed over a tooth to restore its shape, size, strength, and improve its appearance. They fully encase the visible portion of a tooth at and above the gum line.',
  'ROOT CANAL TREATMENT': 'Root canal treatment is a dental procedure used to treat infection at the center of a tooth (the root canal system). The treatment involves removing the infected pulp, cleaning and disinfecting the root canal system, and then filling and sealing it.',
  'IMPLANTS': 'Dental implants are surgical components that interface with the bone of the jaw or skull to support a dental prosthesis such as a crown, bridge, denture, or facial prosthesis or to act as an orthodontic anchor.'
};

export default function AnalysisView({ analysis, onBack }: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('results');
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);

  const detections = analysis.analysis_results?.detections || [];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDescription = (detection: Detection): string => {
    // First try exact match
    if (detection.display_name && DISEASE_DESCRIPTIONS[detection.display_name.toUpperCase()]) {
      return DISEASE_DESCRIPTIONS[detection.display_name.toUpperCase()];
    }
    
    // If not found, try case-insensitive matching
    const normalizedName = detection.display_name.toLowerCase().trim();
    
    // Check for partial matches
    if (normalizedName.includes('missing') || normalizedName.includes('teeth')) {
      return DISEASE_DESCRIPTIONS['MISSING TOOTH'];
    }
    
    if (normalizedName.includes('restoration')) {
      return DISEASE_DESCRIPTIONS['RESTORATION'];
    }
    
    if (normalizedName.includes('crown')) {
      return DISEASE_DESCRIPTIONS['CROWNS'];
    }
    
    if (normalizedName.includes('implant')) {
      return DISEASE_DESCRIPTIONS['IMPLANTS'];
    }
    
    if (normalizedName.includes('canal') || normalizedName.includes('rct')) {
      return DISEASE_DESCRIPTIONS['ROOT CANAL TREATMENT'];
    }
    
    // If still no match found
    return 'No description available.';
  };

  // Group detections by display_name to avoid repetitive descriptions
  const groupedDetections = detections.reduce((acc, detection) => {
    const name = detection.display_name;
    if (!acc[name]) {
      acc[name] = {
        display_name: name,
        count: 1,
        description: getDescription(detection),
        highest_confidence: detection.confidence,
        is_grossly_carious: detection.is_grossly_carious,
        color: getHexColor(detection),
        detections: [detection]
      };
    } else {
      acc[name].count += 1;
      acc[name].highest_confidence = Math.max(acc[name].highest_confidence, detection.confidence);
      acc[name].detections.push(detection);
      if (detection.is_grossly_carious) acc[name].is_grossly_carious = true;
    }
    return acc;
  }, {} as Record<string, any>);

  // Convert to array for rendering
  const uniqueDetections = Object.values(groupedDetections);

  // Function to handle getting the annotated image for the report
  const handleGetAnnotatedImage = (dataUrl: string) => {
    setAnnotatedImageUrl(dataUrl);
    console.log("Annotated image URL set:", dataUrl.substring(0, 50) + "...");
  };

  const generateReport = () => {
    if (!annotatedImageUrl) {
      // If the annotated image isn't available yet, switch to the image tab
      setActiveTab('image');
      // Add a small delay to allow the image to render
      setTimeout(() => {
        const canvas = document.querySelector('.annotation-canvas') as HTMLCanvasElement;
        if (canvas) {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            setAnnotatedImageUrl(dataUrl);
            setTimeout(() => generateReportWithImage(dataUrl), 100);
          } catch (error) {
            console.error("Error capturing canvas:", error);
            // Fallback to original image if canvas capture fails
            generateReportWithImage(analysis.image_url);
          }
        } else {
          // Fallback to original image if canvas not found
          generateReportWithImage(analysis.image_url);
        }
      }, 500);
    } else {
      generateReportWithImage(annotatedImageUrl);
    }
  };

  const generateReportWithImage = (imageUrl: string) => {
    // Create HTML report content
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dental AI Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2em; }
            .header { text-align: center; margin-bottom: 2em; }
            .image-container { text-align: center; margin: 2em 0; }
            .image-container img { max-width: 100%; max-height: 500px; border: 1px solid #ddd; }
            .findings { margin: 2em 0; }
            .finding { 
              padding: 10px; 
              margin: 5px 0; 
              border-left: 5px solid; 
              background: #f9f9f9;
            }
            .description {
              font-size: 0.9em;
              margin-top: 5px;
              color: #555;
            }
            .legend { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 10px; 
              margin: 20px 0; 
            }
            .legend-item { 
              display: flex; 
              align-items: center; 
              gap: 5px; 
            }
            .color-box { 
              width: 20px; 
              height: 20px; 
              border: 1px solid #000; 
            }
            .summary { 
              display: flex; 
              justify-content: space-around; 
              margin: 2em 0; 
              text-align: center; 
            }
            .summary-item {
              padding: 1em;
              border-radius: 5px;
              background-color: #f5f5f5;
              min-width: 120px;
            }
            .summary-number {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .count-badge {
              display: inline-block;
              padding: 2px 6px;
              background-color: #e2e8f0;
              border-radius: 9999px;
              font-size: 0.75rem;
              margin-left: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🦷 Dental AI Analysis Report</h1>
            <p>Analysis Date: ${formatDate(analysis.created_at)}</p>
            <p>Image: ${analysis.original_filename}</p>
            <p>Confidence Threshold: ${(analysis.confidence_threshold * 100).toFixed(0)}%</p>
          </div>
          
          <div class="image-container">
            <h2>Analyzed Image with Annotations</h2>
            <img src="${imageUrl}" alt="Annotated Dental X-Ray" />
          </div>

          <div class="summary">
            <div class="summary-item">
              <div class="summary-number">${detections.length}</div>
              <p>Total Findings</p>
            </div>
            <div class="summary-item">
              <div class="summary-number">${detections.filter(d => d.is_grossly_carious).length}</div>
              <p>Severe Cases</p>
            </div>
            <div class="summary-item">
              <div class="summary-number">${detections.filter(d => d.confidence > 0.8).length}</div>
              <p>High Confidence</p>
            </div>
          </div>
          
          <div class="findings">
            <h2>Findings Summary</h2>
            ${uniqueDetections.length === 0 ? 
              '<p>No significant findings detected above the confidence threshold.</p>' :
              uniqueDetections.map(detection => `
                <div class="finding" style="border-left-color: ${detection.color};">
                  <strong>${detection.display_name}</strong>
                  ${detection.count > 1 ? `<span class="count-badge">${detection.count}×</span>` : ''}
                  <span style="float: right">Confidence: ${(detection.highest_confidence * 100).toFixed(1)}%</span>
                  <div class="description">${detection.description}</div>
                </div>
              `).join('')
            }
          </div>
          
          <div class="legend">
            <h2>Color Legend</h2>
            ${Object.entries(DETECTION_COLORS).map(([name, rgb]) => `
              <div class="legend-item">
                <div class="color-box" style="background-color: rgb(${rgb.join(',')});"></div>
                <span>${name}</span>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Create and download the file
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

            <TabsContent value="results" className="space-y-4">
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
                {uniqueDetections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No findings detected above the confidence threshold.
                  </div>
                ) : (
                  uniqueDetections.map((detection, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-4 h-4 border border-gray-400 rounded mt-1"
                            style={{ backgroundColor: detection.color }}
                          />
                          <div>
                            <div className="font-medium flex items-center">
                              {detection.display_name}
                              {detection.count > 1 && (
                                <Badge variant="secondary" className="ml-2">
                                  {detection.count}×
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {detection.description}
                            </p>
                            {detection.is_grossly_carious && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Severe Case
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium">
                            {(detection.highest_confidence * 100).toFixed(1)}%
                          </div>
                          <Progress 
                            value={detection.highest_confidence * 100} 
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <ImageAnnotationViewer 
                originalImageUrl={analysis.image_url}
                detections={detections}
                filename={analysis.original_filename}
                onAnnotated={handleGetAnnotatedImage}
              />
            </TabsContent>

            <TabsContent value="legend" className="space-y-4">
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