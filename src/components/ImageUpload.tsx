import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { dentalService } from '@/services/api';
import { compressImage } from '@/utils/imageCompression';


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
  const [confidenceThreshold] = useState([0.4]); // Fixed at 40%
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        console.log('Checking backend health...');
        setBackendStatus('checking');
        const healthStatus = await dentalService.getHealthStatus();
        console.log('Backend health status:', healthStatus);
        
        if (healthStatus && healthStatus.status === 'healthy') {
          setBackendStatus('online');
          toast({
            title: 'Analysis Service Connected',
            description: 'Successfully connected to the X-ray analysis service.',
          });
        } else {
          setBackendStatus('offline');
          toast({
            title: 'Analysis Service Unavailable',
            description: 'Could not connect to the X-ray analysis service. Some features may be limited.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendStatus('offline');
        toast({
          title: 'Analysis Service Unavailable',
          description: 'Could not connect to the X-ray analysis service. Some features may be limited.',
          variant: 'destructive',
        });
      }
    };
    
    checkBackendHealth();
  }, []);



  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Enhanced file validation for security
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


      // Additional security checks
      const fileName = file.name.toLowerCase();
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        toast({
          title: 'Invalid file extension',
          description: 'File extension does not match content type.',
          variant: 'destructive',
        });
        return;
      }


      // Check for suspicious file names
      if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
        toast({
          title: 'Invalid file name',
          description: 'File name contains invalid characters.',
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


  // DEMO MODE: Storage upload disabled for investor demo
  const uploadToStorage = async (file: File, alreadyCompressed = false): Promise<string> => {
    // Return a mock URL instead of uploading to Supabase storage
    return 'demo-image-url';
  };


  const analyzeImage = async () => {
    if (!uploadedImage || !user) return;


    setUploading(true);
    setAnalyzing(true);
    setUploadProgress(0);


    try {
      // Compress image for analysis
      const compressedFile = await compressImage(uploadedImage, 1920, 0.85);
      
      // DEMO MODE: Skip storage upload, just analyze
      const analysisPromise = dentalService.analyzeImage(compressedFile);
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 8, 90));
      }, 150);


      // Wait for analysis to complete
      const results = await analysisPromise;
      
      setUploadProgress(95);
      clearInterval(progressInterval);
      
      console.log('Analysis results:', results);
      
      // Verify valid results
      if (!results || !results.detections) {
        console.error('Invalid results format from API:', results);
        throw new Error('Invalid response format from analysis API');
      }
      
      // DEMO MODE: Skip database save, create mock analysis object
            // Create base64 of original image for preview
      const reader = new FileReader();
      const originalImageBase64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });

      const analysisData = {
        id: 'demo-' + Date.now(),
        user_id: user.id,
        image_url: originalImageBase64, // Use base64 instead of fake URL
        original_filename: uploadedImage.name,
        analysis_results: results,
        confidence_threshold: confidenceThreshold[0],
        created_at: new Date().toISOString(),
      };


      setUploadProgress(100);

      onAnalysisComplete(analysisData);
      
      toast({
        title: 'Analysis Complete!',
        description: `Found ${results.detections.length} findings in the X-ray.`,
      });
      
      // Reset form
      setUploadedImage(null);
      setImagePreview(null);


    } catch (error: any) {
      console.error('Analysis error:', error);
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
                <span>Processing image...</span>
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
        <CardContent className="space-y-4 pt-6">
          {backendStatus === 'offline' && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Analysis service unavailable</p>
                <p className="text-sm">The X-ray analysis service is currently offline. Please try again later.</p>
              </div>
            </div>
          )}
          
          <Button
            onClick={analyzeImage}
            disabled={!uploadedImage || uploading || analyzing || backendStatus === 'offline' || backendStatus === 'checking'}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : analyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : backendStatus === 'checking' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting to service...
              </>
            ) : backendStatus === 'offline' ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Service Unavailable
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
