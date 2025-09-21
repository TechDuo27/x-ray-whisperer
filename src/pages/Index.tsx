import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Upload, 
  FileText, 
  Shield, 
  Lock, 
  Clock, 
  BarChart3, 
  ArrowRight,
  Star,
  Users,
  Target,
  Award
} from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import thirumalaImage from '@/assets/thirumala.png';
import bashaImage from '@/assets/basha.png';
import placeholderImage from '@/assets/team-placeholder.png';
import demoVideo from '@/assets/demo.mp4';

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
      <section className="relative bg-gradient-to-br from-background via-navy/80 to-teal/50 overflow-hidden">
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-green/10 animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 rotate-45 bg-mint/10"></div>
          <div className="absolute bottom-40 left-1/3 w-16 h-16 rounded-full bg-teal/15"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-heading mb-4">
                Oral Health Analyzer
              </h1>
              <p className="text-lg text-green mb-6">
                AI-Powered Diagnostic Analyzer
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green hover:bg-green/90 text-navy px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                <Link to="/auth">Upload your X-ray here</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">Why Choose Oral Health Analyzer?</h2>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-navy/20 to-teal/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green/20 rounded-2xl flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">🔒 Secure & Private</h3>
                  <p className="text-body-text leading-relaxed">Encrypted storage with industry-standard data protection and privacy-focused workflow</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-teal/20 to-mint/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-mint/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-mint/20 rounded-2xl flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">⬆️ Easy Upload</h3>
                  <p className="text-body-text leading-relaxed">Simple drag & drop interface with instant validation and lightning-fast processing</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green/20 to-teal/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-teal/20 rounded-2xl flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">🧠 Accurate AI</h3>
                  <p className="text-body-text leading-relaxed">Detects 20+ conditions with 90%+ accuracy rate and real-time analysis</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-mint/20 to-navy/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-navy/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-navy/20 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">📊 Detailed Reports</h3>
                  <p className="text-body-text leading-relaxed">Annotated images with confidence scores in print-ready format</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-navy/20 to-green/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green/20 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">📂 Analysis History</h3>
                  <p className="text-body-text leading-relaxed">Organized results with easy downloads and comprehensive tracking</p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-teal/20 to-navy/20 rounded-3xl p-8 border border-green/30 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-teal/20 rounded-2xl flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">⚡ Instant Results</h3>
                  <p className="text-body-text leading-relaxed">No waiting, no hassle - get comprehensive results in seconds</p>
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
            <h2 className="text-4xl font-bold text-heading mb-6">How Oral Health Analyzer Works</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl">
                  <Upload className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Upload X-Ray</h3>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-green animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl">
                  <Brain className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2 text-center">Analyze with AI technology</h3>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-green animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl">
                  <FileText className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Download Report</h3>
            </div>
          </div>
        </div>
      </section>

      {/* How it Looks Section - Video Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-4">See Dental AI in Action</h2>
            <p className="text-xl text-body-text">See how it works in seconds</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Video container with professional border */}
            <div className="relative mx-auto" style={{ width: '80%' }}>
              <div className="border-4 border-teal rounded-2xl overflow-hidden shadow-2xl">
                <video 
                  className="w-full h-auto"
                  controls
                  poster=""
                >
                  <source src={demoVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Tagline below video */}
            <div className="text-center mt-8">
              <p className="text-2xl font-semibold text-heading">
                Step 1 – Upload &nbsp;&nbsp;•&nbsp;&nbsp; Step 2 – Analyze &nbsp;&nbsp;•&nbsp;&nbsp; Step 3 – Download Report
              </p>
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
                <div className="text-5xl font-bold text-primary mb-2">90%+</div>
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
                <div className="text-5xl font-bold text-primary mb-2">5s</div>
                <p className="text-lg font-semibold text-heading">Report Generation Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Experts Section */}
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
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="text-center mb-6">
                <img 
                  src={thirumalaImage} 
                  alt="Thirumala Peddireddy - CEO" 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-green/50 mb-4"
                />
                <h3 className="text-2xl font-bold text-heading mb-1">Thirumala Peddireddy</h3>
                <p className="text-lg text-green font-semibold">CEO & Founder</p>
              </div>
              <p className="text-body-text leading-relaxed mb-6">
                20+ years transforming healthcare data systems. Former consultant at Accenture, Capgemini, and Wipro, 
                specializing in AI-driven solutions and enterprise data architecture that revolutionizes patient care.
              </p>
              <a 
                href="https://www.linkedin.com/in/thiru1976/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green hover:text-green/80 font-semibold transition-colors"
              >
                LinkedIn Profile <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Dr. Mahaboob Basha */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="text-center mb-6">
                <img 
                  src={bashaImage} 
                  alt="Dr. Mahaboob Basha" 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-green/50 mb-4"
                />
                <h3 className="text-2xl font-bold text-heading mb-1">Dr. Mahaboob Basha</h3>
                <p className="text-lg text-green font-semibold">Domain expert and senior Advisor</p>
              </div>
              <p className="text-body-text leading-relaxed mb-6">
                24+ years advancing dental care and orthodontics. Owner of 5 successful dental branches and a state-of-the-art dental lab, now leading Dentray Aligners to revolutionize South India's orthodontic market through innovative, affordable clear aligner solutions and strong B2B partnerships.
              </p>
              <a 
                href="https://www.linkedin.com/in/dr-mahaboob-basha-13234943/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green hover:text-green/80 font-semibold transition-colors"
              >
                LinkedIn Profile <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;