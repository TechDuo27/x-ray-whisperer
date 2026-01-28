import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, User, Brain, Users } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import AdvancedAnalysisView from '@/components/AdvancedAnalysisView';
import ProfileModal from '@/components/ProfileModal';
import { privacyPolicy } from './privacyPolicy';

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
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ——————————————————————————
  // Initial Data Load
  // ——————————————————————————
  useEffect(() => {
    if (!user) return;
    Promise.all([loadAnalyses(), loadProfile()]).finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return <Navigate to="/auth" replace />;

  // ——————————————————————————
  // Fetch Analyses
  // ——————————————————————————
  const loadAnalyses = async () => {
    const { data, error } = await supabase
      .from('analyses')
      .select('id, original_filename, analysis_results, confidence_threshold, created_at, image_url')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) setAnalyses(data);
  };

  // ——————————————————————————
  // Fetch Profile + Privacy Sync
  // ——————————————————————————
  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // profile missing → prompt privacy
    if (!data) {
      setShowPrivacyModal(true);
      return;
    }

    setProfile(data);

    // metadata override for first signup
    const acceptedFromMetadata = user.user_metadata?.privacy_policy_accepted;
    if (acceptedFromMetadata && !data.privacy_policy_accepted) {
      await supabase
        .from('profiles')
        .update({ privacy_policy_accepted: true })
        .eq('user_id', user.id);

      setProfile({ ...data, privacy_policy_accepted: true });
      return;
    }

    if (!data.privacy_policy_accepted) {
      setShowPrivacyModal(true);
    }
  };

  // ——————————————————————————
  // Accept Privacy Policy
  // ——————————————————————————
  const handleAcceptPrivacy = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ privacy_policy_accepted: true })
      .eq('user_id', user.id);

    if (!error) {
      setShowPrivacyModal(false);
      setProfile((prev: any) => ({ ...prev, privacy_policy_accepted: true }));
      toast({ title: "Success", description: "Privacy policy accepted." });
    }
  };

  // ——————————————————————————
  // UI Helpers
  // ——————————————————————————
  const formatDate = (d: string) =>
    new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const countFindings = (r: any) => r?.detections?.length ?? 0;

  // ——————————————————————————
  // Render
  // ——————————————————————————
  return (
    <div className="min-h-screen bg-background">

      {/* Top Bar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Oral Health Analyzer</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || user.email}
            </span>
            <Button variant="outline" onClick={() => setShowProfileModal(true)}>
              <User className="h-4 w-4 mr-2" /> Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {selectedAnalysis ? (
          <AdvancedAnalysisView
            analysis={selectedAnalysis}
            onBack={() => setSelectedAnalysis(null)}
          />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <Card>
                <CardHeader><CardTitle>Navigation</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={!selectedAnalysis ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload & Analyze
                  </Button>
                  {profile?.admin && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/admin/feedback">
                        <Users className="h-4 w-4 mr-2" /> View Feedback Page
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Analyses */}
              <Card>
                <CardHeader><CardTitle><FileText className="h-5 w-5 mr-2 inline" /> Latest 5 Analyses</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : analyses.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No analyses yet</div>
                  ) : (
                    analyses.map(a => (
                      <div
                        key={a.id}
                        className="p-3 rounded-md border bg-card hover:bg-accent cursor-pointer"
                        onClick={() => setSelectedAnalysis(a)}
                      >
                        <div className="font-medium text-sm truncate">{a.original_filename}</div>
                        <div className="flex justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {countFindings(a.analysis_results)} findings
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main */}
            <div className="col-span-12 lg:col-span-9">
              <ImageUpload onAnalysisComplete={(a) => {
                setSelectedAnalysis(a);
                loadAnalyses();
              }} />
            </div>
          </div>
        )}
      </div>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle>Privacy Policy Update</CardTitle>
              <CardDescription>Please accept to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md text-sm max-h-60 overflow-y-auto">
                {privacyPolicy.content.map((p: string, i: number) => <p key={i}>{p}</p>)}
              </div>
              <Button className="w-full" onClick={handleAcceptPrivacy}>
                I Accept the Privacy Policy
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
