import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Upload, 
  FileText, 
  Shield, 
  Zap, 
  Lock, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  ArrowRight,
  Star,
  Users,
  Target,
  Award
} from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import thirumalaImage from '@/assets/thirumala.png';
import placeholderImage from '@/assets/team-placeholder.png';

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
      <section className="relative bg-gradient-to-br from-background via-mint-green/20 to-soft-blue/30 overflow-hidden">
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 rotate-45 bg-secondary/10"></div>
          <div className="absolute bottom-40 left-1/3 w-16 h-16 rounded-full bg-primary/15"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-heading mb-4">
                AI-Powered Dental Precision
              </h1>
              <p className="text-2xl text-body-text font-medium">
                Upload. Analyze. Diagnose with confidence.
              </p>
            </div>
            
            {/* Animated visual element placeholder */}
            <div className="mb-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-center justify-center gap-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
                    <Upload className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-sm mt-2 text-body-text">X-ray Upload</p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                <div className="relative">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <Brain className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <p className="text-sm mt-2 text-body-text">AI Detection</p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                <div className="relative">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                    <FileText className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-sm mt-2 text-body-text">Professional Report</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                <a href="/auth">Start Free Analysis</a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 px-8 py-4 text-lg" asChild>
                <a href="#about">About Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">Advanced AI Detection Platform</h2>
            <p className="text-xl text-body-text max-w-3xl mx-auto leading-relaxed">
              Experience the future of dental analysis with our cutting-edge AI technology that delivers precise, fast, and reliable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Feature 1: Secure & Private */}
            <div className="group cursor-pointer">
              <div className="bg-mint-green rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-primary/10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading text-center mb-4">Secure & Private</h3>
                <div className="text-sm text-body-text space-y-2 text-center">
                  <p>🔒 End-to-end encryption</p>
                  <p>🛡️ HIPAA compliant</p>
                  <p>🔐 Zero data retention</p>
                </div>
              </div>
            </div>

            {/* Feature 2: Easy Upload */}
            <div className="group cursor-pointer">
              <div className="bg-soft-blue rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-primary/10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading text-center mb-4">Easy Upload</h3>
                <div className="text-sm text-body-text space-y-2 text-center">
                  <p>📤 Drag & drop interface</p>
                  <p>✅ Instant validation</p>
                  <p>⚡ Lightning fast</p>
                </div>
              </div>
            </div>

            {/* Feature 3: Accurate AI */}
            <div className="group cursor-pointer">
              <div className="bg-warm-yellow rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-primary/10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading text-center mb-4">Accurate AI</h3>
                <div className="text-sm text-body-text space-y-2 text-center">
                  <p>🧠 20+ conditions detected</p>
                  <p>🎯 99% accuracy rate</p>
                  <p>⚡ Real-time analysis</p>
                </div>
              </div>
            </div>

            {/* Feature 4: Detailed Reports */}
            <div className="group cursor-pointer">
              <div className="bg-light-coral rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-primary/10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading text-center mb-4">Detailed Reports</h3>
                <div className="text-sm text-body-text space-y-2 text-center">
                  <p>📊 Annotated images</p>
                  <p>📈 Confidence scores</p>
                  <p>🖨️ Print-ready format</p>
                </div>
              </div>
            </div>

            {/* Feature 5: Analysis History */}
            <div className="group cursor-pointer">
              <div className="bg-lavender rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-primary/10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-heading text-center mb-4">Analysis History</h3>
                <div className="text-sm text-body-text space-y-2 text-center">
                  <p>📊 Track progress</p>
                  <p>🗂️ Organized results</p>
                  <p>📥 Easy downloads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">How It Works</h2>
            <p className="text-xl text-body-text max-w-2xl mx-auto">
              Three simple steps to get professional dental analysis powered by AI
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Upload X-Ray</h3>
              <p className="text-body-text">Securely upload your dental radiograph</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-secondary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">AI Detects 20+ Conditions</h3>
              <p className="text-body-text">Advanced AI analyzes and identifies issues</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-secondary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Receive Annotated Report</h3>
              <p className="text-body-text">Get professional, detailed analysis report</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Stat 1 */}
            <div className="text-center relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-background rounded-2xl p-8 pt-12 shadow-lg border border-primary/10">
                <div className="text-5xl font-bold text-primary mb-2">20+</div>
                <p className="text-lg font-semibold text-heading">Conditions Detected</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-background rounded-2xl p-8 pt-12 shadow-lg border border-primary/10">
                <div className="text-5xl font-bold text-primary mb-2">99%</div>
                <p className="text-lg font-semibold text-heading">Detection Accuracy</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-background rounded-2xl p-8 pt-12 shadow-lg border border-primary/10">
                <div className="text-5xl font-bold text-primary mb-2">&lt;2</div>
                <p className="text-lg font-semibold text-heading">Minutes Report Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="about" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">Meet Our Expert Team</h2>
            <p className="text-xl text-body-text max-w-3xl mx-auto leading-relaxed">
              Pioneering the future of dental AI with deep expertise in technology and healthcare innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Thirumala */}
            <div className="bg-background rounded-2xl p-8 shadow-lg border border-primary/10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-center mb-6">
                <img 
                  src={thirumalaImage} 
                  alt="Thirumala Peddireddy - CEO" 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20 mb-4"
                />
                <h3 className="text-2xl font-bold text-heading mb-1">Thirumala Peddireddy</h3>
                <p className="text-lg text-primary font-semibold">CEO & Founder</p>
              </div>
              <p className="text-body-text leading-relaxed mb-6">
                20+ years transforming healthcare data systems. Former consultant at Accenture, Capgemini, and Wipro, 
                specializing in AI-driven solutions and enterprise data architecture that revolutionizes patient care.
              </p>
              <a 
                href="https://www.linkedin.com/in/thiru1976/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                LinkedIn Profile <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Coming Soon */}
            <div className="bg-background rounded-2xl p-8 shadow-lg border border-primary/10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-4 border-primary/20 mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary/50" />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-1">Expanding Our Team</h3>
                <p className="text-lg text-secondary font-semibold">Coming Soon</p>
              </div>
              <p className="text-body-text leading-relaxed mb-6">
                We're actively seeking exceptional talents in AI research, dental technology, and healthcare innovation 
                to join our mission of transforming dental diagnostics worldwide.
              </p>
              <div className="inline-flex items-center gap-2 text-body-text font-medium">
                Stay tuned for updates <Star className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary via-secondary/95 to-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Precise Dental AI?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join dental professionals worldwide who trust our platform for accurate, efficient dental radiograph analysis. 
            Start your journey with AI-powered precision today.
          </p>
          <Button 
            size="lg" 
            className="bg-background text-heading hover:bg-background/90 px-12 py-4 text-xl font-semibold shadow-2xl hover:shadow-xl transition-all hover:scale-105"
            asChild
          >
            <a href="/auth">Start Your Analysis Now</a>
          </Button>
          <p className="text-sm mt-6 opacity-75">
            HIPAA compliant • End-to-end encrypted • Instant results
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;