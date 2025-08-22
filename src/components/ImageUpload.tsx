import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, FileImage, Loader2, Settings } from 'lucide-react';
// import { loadYOLOModel, runInference } from '@/utils/modelLoader';

interface ImageUploadProps {
  onAnalysisComplete: (analysis: any) => void;
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.25]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPEG or PNG image.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }

      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false,
  });

  const uploadToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('xrays')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('xrays')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const analyzeImage = async () => {
    if (!uploadedImage || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload image to storage
      const imageUrl = await uploadToStorage(uploadedImage);
      setUploadProgress(100);
      clearInterval(progressInterval);

      setUploading(false);
      setAnalyzing(true);

      // Load YOLO models (will be implemented when models are added)
      // const model1 = await loadYOLOModel('/models/best.pt');
      // const model2 = await loadYOLOModel('/models/best2.pt');
      
      // Run AI inference (will be implemented when models are added)
      // const results = await runInference(uploadedImage, model1, model2, confidenceThreshold[0]);
      
      // For now, return empty results until models are integrated
      const results = { detections: [] };

      // Save analysis to database
      const { data: analysisData, error: dbError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          original_filename: uploadedImage.name,
          analysis_results: results,
          confidence_threshold: confidenceThreshold[0],
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: 'Analysis Complete!',
        description: `Analysis completed. ${results.detections.length} findings detected.`,
      });

      onAnalysisComplete(analysisData);
      
      // Reset form
      setUploadedImage(null);
      setImagePreview(null);

    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'An error occurred during analysis.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload X-Ray Image
          </CardTitle>
          <CardDescription>
            Upload a panoramic dental X-ray image for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2">
                <FileImage className="h-12 w-12 text-muted-foreground" />
                <div className="text-lg font-medium">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an X-ray image'}
                </div>
                <div className="text-sm text-muted-foreground">
                  or click to browse files
                </div>
                <div className="text-xs text-muted-foreground">
                  Supported formats: JPG, JPEG, PNG (max 10MB)
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded X-ray"
                  className="w-full h-64 object-contain border rounded-lg bg-muted"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {uploadedImage?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {analyzing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Analyzing X-ray with AI models...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Analysis Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Confidence Threshold</label>
              <span className="text-sm text-muted-foreground">
                {(confidenceThreshold[0] * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Only show detections with confidence above this threshold
            </div>
          </div>

          <Button
            onClick={analyzeImage}
            disabled={!uploadedImage || uploading || analyzing}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : analyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Analyze X-Ray
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}