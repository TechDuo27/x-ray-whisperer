import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Upload, FileText, BarChart3, Shield, Clock, Target, Users, History, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import swarajImage from "@/assets/swaraj.png";
import anushkaImage from "@/assets/anushka.png";
import thirumalaImage from "@/assets/thirumala.png";
import teamPlaceholderImage from "@/assets/team-placeholder.png";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DarkModeToggle />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 rotate-45 bg-secondary/10"></div>
          <div className="absolute bottom-40 left-1/3 w-16 h-16 rounded-full bg-primary/15"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading">
              Dental AI Analysis
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-heading mb-4">
              AI-Powered Dental X-Ray Disease Detection
            </h2>
            <p className="text-xl text-body-text max-w-3xl mx-auto">
              Detect 20+ dental diseases in seconds—secure, accurate, and effortless X-ray analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4">
                <Link to="/dashboard">
                  Upload Your OPG X-Ray — Get Instant Results
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-body-text">
              <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xs text-white">✓</span>
              </div>
              <span className="text-sm">Your images are safe & private</span>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="mb-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center justify-center gap-8">
              <div className="relative">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-sm mt-2 text-body-text">X-ray Upload</p>
              </div>
              <div className="w-6 h-6 text-primary animate-pulse">→</div>
              <div className="relative">
                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <Brain className="w-8 h-8 text-secondary-foreground" />
                </div>
                <p className="text-sm mt-2 text-body-text">AI Detection</p>
              </div>
              <div className="w-6 h-6 text-primary animate-pulse">→</div>
              <div className="relative">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-sm mt-2 text-body-text">Professional Report</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              Why Choose Dental AI Analysis?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">🔒 Secure & Private</h3>
                <div className="space-y-2 text-body-text">
                  <p>Encrypted storage</p>
                  <p>Data protected with industry standards</p>
                  <p>Privacy-focused workflow</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">⬆️ Easy Upload</h3>
                <div className="space-y-2 text-body-text">
                  <p>Simple drag & drop interface</p>
                  <p>Instant validation</p>
                  <p>Lightning-fast processing</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">🧠 Accurate AI</h3>
                <div className="space-y-2 text-body-text">
                  <p>Detects 20+ conditions</p>
                  <p>90%+ accuracy rate</p>
                  <p>Real-time analysis</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">📊 Detailed Reports</h3>
                <div className="space-y-2 text-body-text">
                  <p>Annotated images</p>
                  <p>Confidence scores</p>
                  <p>Print-ready format</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">📂 Analysis History</h3>
                <div className="space-y-2 text-body-text">
                  <p>Organized results</p>
                  <p>Easy downloads</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-4">Benefits</h3>
                <div className="space-y-2 text-body-text text-sm">
                  <p>Unlimited detections per upload—no extra costs</p>
                  <p>Secure and private, with best-in-class data protection</p>
                  <p>Download detailed reports with one click</p>
                  <p>Instant results—no waiting, no hassle</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              How Dental AI Analysis Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-4">Step 1: Upload your OPG X-ray</h3>
              <p className="text-body-text">
                Simply drag and drop your OPG X-ray image or click to browse and select your file
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-4">Step 2: AI instantly scans for 20+ diseases</h3>
              <p className="text-body-text">
                Our advanced AI scans your X-ray in seconds, detecting 20+ dental conditions with 90%+ accuracy
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-4">Step 3: Review your detailed, downloadable report</h3>
              <p className="text-body-text">
                Receive a detailed report in 5 seconds with annotated findings and confidence scores
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link to="/dashboard">
                Try It Now — Free Unlimited Detections
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
              About Dental AI Analysis
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-body-text leading-relaxed mb-6">
                Dental AI Analysis is dedicated to making advanced dental diagnostics accessible to everyone. Our proprietary AI platform scans OPG X-rays for over 20 diseases, providing instant, reliable insights for patients and dental professionals alike.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-heading mb-2">Built by experts in dental AI and global healthcare</h3>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-heading mb-2">Prioritizing user security and accuracy</h3>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-heading mb-2">Trusted by clinics, researchers, and patients worldwide</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Card className="bg-white p-6 text-center shadow-lg border-0">
              <img 
                src={swarajImage} 
                alt="Swaraj - CEO" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-heading mb-2">Swaraj</h3>
              <p className="text-body-text text-sm mb-2">CEO</p>
              <p className="text-body-text text-sm">Leading our vision to transform dental diagnostics worldwide</p>
            </Card>
            
            <Card className="bg-white p-6 text-center shadow-lg border-0">
              <img 
                src={teamPlaceholderImage} 
                alt="Team Member" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-heading mb-2">Joining soon</h3>
              <p className="text-body-text text-sm mb-2">AI Research</p>
            </Card>
            
            <Card className="bg-white p-6 text-center shadow-lg border-0">
              <img 
                src={teamPlaceholderImage} 
                alt="Team Member" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-heading mb-2">Joining soon</h3>
              <p className="text-body-text text-sm mb-2">Dental Technology</p>
            </Card>
            
            <Card className="bg-white p-6 text-center shadow-lg border-0">
              <img 
                src={teamPlaceholderImage} 
                alt="Team Member" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-heading mb-2">Joining soon</h3>
              <p className="text-body-text text-sm mb-2">Healthcare Innovation</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Precise Dental AI?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of dental professionals and patients already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/dashboard">
                Start Your Free Analysis Now
              </Link>
            </Button>
          </div>
          <p className="text-white/80 text-sm">
            End-to-end encrypted • Instant results
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;