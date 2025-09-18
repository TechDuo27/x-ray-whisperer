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
                Dental AI Analysis
              </h1>
              <h2 className="text-4xl font-semibold text-green mb-6">
                AI-Powered Dental X-Ray Disease Detection
              </h2>
              <p className="text-2xl text-mint font-medium mb-4">
                Your second opinion, in seconds.
              </p>
              <p className="text-xl text-body-text">
                Detect 20+ dental diseases in seconds—secure, accurate, and effortless X-ray analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green hover:bg-green/90 text-navy px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                <Link to="/auth">Upload Your OPG X-Ray — Get Instant Results</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Radial Diagram */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">Why Choose Dental AI Analysis?</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Radial diagram container */}
            <div className="relative w-full h-96 md:h-[500px]">
              {/* Central hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-green shadow-lg">
                  <span className="text-sm font-bold text-primary-foreground text-center">Features</span>
                </div>
              </div>

              {/* Feature nodes positioned in a circle */}
              {/* Secure & Private - top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-card rounded-full border-2 border-teal flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <Lock className="w-6 h-6 text-green" />
                </div>
                <div className="text-center mt-2 max-w-32">
                  <h4 className="text-sm font-semibold text-heading">🔒 Secure & Private</h4>
                  <div className="text-xs text-body-text mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Encrypted storage</p>
                    <p>Data protected with industry standards</p>
                    <p>Privacy-focused workflow</p>
                  </div>
                </div>
                {/* Line to center */}
                <div className="absolute top-8 left-8 w-0.5 h-28 bg-green/50 transform rotate-0"></div>
              </div>

              {/* Easy Upload - top right */}
              <div className="absolute top-8 right-8">
                <div className="w-16 h-16 bg-card rounded-full border-2 border-teal flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <Upload className="w-6 h-6 text-green" />
                </div>
                <div className="text-center mt-2 max-w-32">
                  <h4 className="text-sm font-semibold text-heading">⬆️ Easy Upload</h4>
                  <div className="text-xs text-body-text mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Simple drag & drop interface</p>
                    <p>Instant validation</p>
                    <p>Lightning-fast processing</p>
                  </div>
                </div>
                {/* Line to center */}
                <div className="absolute top-8 left-0 w-28 h-0.5 bg-green/50 transform rotate-45"></div>
              </div>

              {/* Accurate AI - bottom right */}
              <div className="absolute bottom-8 right-8">
                <div className="w-16 h-16 bg-card rounded-full border-2 border-teal flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <Brain className="w-6 h-6 text-green" />
                </div>
                <div className="text-center mt-2 max-w-32">
                  <h4 className="text-sm font-semibold text-heading">🧠 Accurate AI</h4>
                  <div className="text-xs text-body-text mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Detects 20+ conditions</p>
                    <p>90%+ accuracy rate</p>
                    <p>Real-time analysis</p>
                  </div>
                </div>
                {/* Line to center */}
                <div className="absolute top-0 left-0 w-28 h-0.5 bg-green/50 transform -rotate-45"></div>
              </div>

              {/* Detailed Reports - bottom left */}
              <div className="absolute bottom-8 left-8">
                <div className="w-16 h-16 bg-card rounded-full border-2 border-teal flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <FileText className="w-6 h-6 text-green" />
                </div>
                <div className="text-center mt-2 max-w-32">
                  <h4 className="text-sm font-semibold text-heading">📊 Detailed Reports</h4>
                  <div className="text-xs text-body-text mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Annotated images</p>
                    <p>Confidence scores</p>
                    <p>Print-ready format</p>
                  </div>
                </div>
                {/* Line to center */}
                <div className="absolute top-0 right-0 w-28 h-0.5 bg-green/50 transform rotate-45"></div>
              </div>

              {/* Analysis History - left */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                <div className="w-16 h-16 bg-card rounded-full border-2 border-teal flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <BarChart3 className="w-6 h-6 text-green" />
                </div>
                <div className="text-center mt-2 max-w-32">
                  <h4 className="text-sm font-semibold text-heading">📂 Analysis History</h4>
                  <div className="text-xs text-body-text mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Organized results</p>
                    <p>Easy downloads</p>
                  </div>
                </div>
                {/* Line to center */}
                <div className="absolute top-8 right-0 w-28 h-0.5 bg-green/50"></div>
              </div>
            </div>

            {/* Additional features list */}
            <div className="mt-16 text-center">
              <ul className="text-lg text-body-text space-y-2 max-w-2xl mx-auto">
                <li>• Unlimited detections per upload—no extra costs</li>
                <li>• Over 90% accuracy, powered by cutting-edge machine intelligence</li>
                <li>• Secure and private, with best-in-class data protection</li>
                <li>• Download detailed reports with one click</li>
                <li>• Instant results—no waiting, no hassle</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">How Dental AI Analysis Works</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto mb-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Upload your OPG X-ray</h3>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-green animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">AI instantly scans for 20+ diseases</h3>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block">
              <svg className="w-16 h-8 text-green animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-12 h-12 text-navy" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center text-mint font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Review your detailed, downloadable report</h3>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button size="lg" className="bg-green hover:bg-green/90 text-navy px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
              <Link to="/auth">Try It Now — Free Unlimited Detections</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Looks Section - Video Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">How it Looks</h2>
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

      {/* About Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-6">About Dental AI Analysis</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-body-text leading-relaxed mb-8">
                Dental AI Analysis is dedicated to making advanced dental diagnostics accessible to everyone. 
                Our proprietary AI platform scans OPG X-rays for over 20 diseases, providing instant, reliable 
                insights for patients and dental professionals alike.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-heading mb-3">Built by Experts</h3>
                  <p className="text-body-text">Built by experts in dental AI and global healthcare</p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-heading mb-3">Security First</h3>
                  <p className="text-body-text">Prioritizing user security and accuracy—even without HIPAA compliance</p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-heading mb-3">Globally Trusted</h3>
                  <p className="text-body-text">Trusted by clinics, researchers, and patients worldwide</p>
                </div>
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
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all hover:-translate-y-1">
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

            {/* Coming Soon */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-green/20 to-teal/20 border-4 border-green/50 mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-green/70" />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-1">Expanding Our Team</h3>
                <p className="text-lg text-teal font-semibold">Coming Soon</p>
              </div>
              <p className="text-body-text leading-relaxed mb-6">
                Joining soon
              </p>
              <div className="inline-flex items-center gap-2 text-body-text font-medium">
                Stay tuned for updates <Star className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;