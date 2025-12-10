import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, User, Brain, Calendar, Download, Users } from 'lucide-react';
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
  // DEMO MODE: Bypass authentication - use fake demo user
  const { user } = useAuth();
  const demoUser = { 
    email: 'demo@investor.com', 
    user_metadata: { full_name: 'User' },
    id: 'demo-id'
  };
  
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false); // Set to false - no loading needed for demo
  const [currentView, setCurrentView] = useState<'upload' | 'analysis'>('upload');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({ admin: false });

  // DEMO MODE: Disabled useEffect - no database operations needed
  // useEffect(() => {
  //   if (user) {
  //     loadAnalyses();
  //     loadUserProfile();
  //   }
  // }, [user]);

  // DEMO MODE: Auth check disabled for investor demo
  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  // DEMO MODE: Mock function - returns empty array
  const loadAnalyses = async () => {
    try {
      // Database disabled for demo - return empty history
      setAnalyses([]);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    } finally {
      setLoading(false);
    }
  };

  // DEMO MODE: Mock function - returns basic profile
  const loadUserProfile = async () => {
    try {
      // Database disabled for demo
      setUserProfile({ admin: false });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleAnalysisComplete = (analysisData: any) => {
    setSelectedAnalysis(analysisData);
    setCurrentView('analysis');
    // DEMO MODE: Don't refresh from database
    // loadAnalyses();
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
            <Link 
              to="/"
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Oral Health Analyzer</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {/* DEMO MODE: Use demoUser instead of user */}
                Welcome, {demoUser.user_metadata?.full_name || demoUser.email}
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
                  {userProfile?.admin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/admin/feedback">
                        <Users className="h-4 w-4 mr-2" />
                        View Feedback Page
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Analysis History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Latest 5 Analyses
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
                key={selectedAnalysis.id}
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
