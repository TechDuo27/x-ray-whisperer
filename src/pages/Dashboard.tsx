import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, User, Brain, Calendar, Download } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisView from '@/components/AnalysisView';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import ProfileModal from '@/components/ProfileModal';

interface Analysis {
  id: string;
  original_filename: string;
  analysis_results: any;
  confidence_threshold: number;
  created_at: string;
  image_url: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'upload' | 'analysis'>('upload');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalyses();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analysis history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleAnalysisComplete = (analysisData: any) => {
    setSelectedAnalysis(analysisData);
    setCurrentView('analysis');
    loadAnalyses(); // Refresh the list
  };

  const handleViewAnalysis = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setCurrentView('analysis');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAnalysisCount = (results: any) => {
    if (!results || !results.detections) return 0;
    return results.detections.length;
  };

  return (
    <div className="min-h-screen bg-background">
      <DarkModeToggle />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setCurrentView('upload')}
            >
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Dental AI Analysis</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
              <Button variant="outline" onClick={() => setIsProfileModalOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={currentView === 'upload' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Analyze
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Analysis History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : analyses.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No analyses yet</div>
                  ) : (
                    analyses.slice(0, 5).map((analysis) => (
                      <div
                        key={analysis.id}
                        className="p-3 rounded-md border bg-card hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleViewAnalysis(analysis)}
                      >
                        <div className="font-medium text-sm truncate">
                          {analysis.original_filename}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getAnalysisCount(analysis.analysis_results)} findings
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(analysis.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {currentView === 'upload' && (
              <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
            )}
            
            {currentView === 'analysis' && selectedAnalysis && (
              <AnalysisView 
                analysis={selectedAnalysis}
                onBack={() => setCurrentView('upload')}
              />
            )}
          </div>
        </div>
      </div>
      
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
}