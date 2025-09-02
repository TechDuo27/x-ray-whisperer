import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Upload, FileText, Shield, Zap, Monitor, Hand, CheckCircle, BarChart3, Lock, Clock, Calendar } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import swarajImage from '@/assets/swaraj.png';
import anuskaImage from '@/assets/anushka.png';
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
      <header className="relative">
        <DarkModeToggle />
      </header>
      
      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Brain className="h-16 w-16 text-primary mr-4" />
                <h1 className="text-5xl font-bold text-primary">Dental AI - Advanced X-Ray Analysis Platform</h1>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                <strong>AI-Powered Dental X-Ray Analysis</strong> - Detect 20+ Dental Conditions Instantly
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                <strong>Revolutionary artificial intelligence technology</strong> for comprehensive dental radiograph analysis. 
                Our advanced YOLO models detect dental conditions with <em>clinical-grade precision</em> and generate detailed professional reports. 
                Transform your dental practice with cutting-edge AI diagnostic tools designed for modern dentistry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/auth" title="Start your free dental AI analysis today">Get Started - Try Free Analysis</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#about" title="Learn about our dental AI team and technology">Meet Our Expert Team</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Roadmap */}
        <section id="features" className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <article className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Our <strong>Dental AI Analysis</strong> Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our <strong>5-step AI workflow</strong> ensures accurate dental condition detection. 
                From <em>secure upload</em> to <em>detailed reports</em> - experience the future of dental diagnostics.
                Each checkpoint represents years of AI research and clinical validation.
              </p>
            </article>

          {/* Roadmap Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Checkpoints */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              
              {/* Checkpoint 1: Secure & Private */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-background">
                    <Lock className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 font-bold text-sm">1</div>
                  </div>
                  {/* Connection Line to Next */}
                  <div className="hidden md:block absolute top-8 left-16 w-32 lg:w-40 xl:w-48 h-0.5 bg-gradient-to-r from-emerald-500 to-primary"></div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg group-hover:shadow-xl transition-all duration-300 max-w-xs">
                  <h3 className="font-semibold text-lg mb-3 text-center text-emerald-900 dark:text-emerald-100">
                    <strong>Secure & Private</strong> Dental Data Protection
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Bank-level user authentication and data security</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-teal-600" />
                      <span className="text-sm">End-to-end encrypted storage for patient privacy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint 2: Easy Upload */}
              <div className="flex flex-col items-center group">
                  <div className="relative mb-6">
                  {/* Checkpoint Node */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-background">
                    <Monitor className="h-8 w-8 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                  </div>
                  {/* Connection Line to Next */}
                  <div className="hidden md:block absolute top-8 left-16 w-32 lg:w-40 xl:w-48 h-0.5 bg-gradient-to-r from-primary to-blue-500"></div>
                </div>
                
                {/* Feature Card */}
                <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl p-6 border border-border/50 shadow-lg group-hover:shadow-xl transition-all duration-300 max-w-xs">
                  <h3 className="font-semibold text-lg mb-3 text-center">
                    <strong>Easy X-Ray Upload</strong> - Simple File Management
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Hand className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-sm">Intuitive drag & drop interface for quick uploads</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automatic DICOM and JPG file format validation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint 3: AI Detection */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-background">
                    <Brain className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 font-bold text-sm">3</div>
                  </div>
                  {/* Connection Line to Next */}
                  <div className="hidden md:block absolute top-8 left-16 w-32 lg:w-40 xl:w-48 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/30 shadow-lg group-hover:shadow-xl transition-all duration-300 max-w-xs">
                  <h3 className="font-semibold text-lg mb-3 text-center text-blue-900 dark:text-blue-100">
                    <strong>Advanced AI Detection</strong> - Clinical Grade Accuracy
                  </h3>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      <Zap className="h-4 w-4" />
                      <strong>AI detects 20 dental conditions</strong> with 95%+ accuracy
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-500/10 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full text-center border border-red-200/50">
                      <strong>Dental Caries</strong>
                    </div>
                    <div className="bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded-full text-center border border-orange-200/50">
                      <strong>Bone Loss</strong>
                    </div>
                    <div className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full text-center border border-purple-200/50">
                      <strong>Implants</strong>
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-1 rounded-full text-center border border-yellow-200/50">
                      <strong>Root Fractures</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint 4: Detailed Reports */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-background">
                    <FileText className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-purple-500 rounded-full flex items-center justify-center text-purple-500 font-bold text-sm">4</div>
                  </div>
                  {/* Connection Line to Next */}
                  <div className="hidden md:block absolute top-8 left-16 w-32 lg:w-40 xl:w-48 h-0.5 bg-gradient-to-r from-purple-500 to-orange-500"></div>
                </div>
                
                <div className="bg-gradient-to-br from-background to-muted/10 rounded-xl p-6 border border-border/50 shadow-lg group-hover:shadow-xl transition-all duration-300 max-w-xs">
                  <h3 className="font-semibold text-lg mb-3 text-center">Detailed Reports</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-gradient-to-r from-red-200/50 to-yellow-200/50 dark:from-red-900/30 dark:to-yellow-900/30 rounded border flex-shrink-0 relative">
                        <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full"></div>
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">Annotated images</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Confidence scores</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">Color-coded findings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Print-ready format</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint 5: Analysis History */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-background">
                    <Clock className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-orange-500 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">5</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl p-6 border border-border/50 shadow-lg group-hover:shadow-xl transition-all duration-300 max-w-xs">
                  <h3 className="font-semibold text-lg mb-3 text-center">Analysis History</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">See your last 5 analyses</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-border/30 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group-hover:scale-105" style={{ transitionDelay: `${i * 100}ms` }}>
                        <div className="w-6 h-4 bg-gradient-to-br from-muted to-muted/50 rounded border flex-shrink-0 relative">
                          <div className="absolute inset-0.5 bg-gradient-to-r from-orange-200/30 to-red-200/30 dark:from-orange-900/30 dark:to-red-900/30 rounded"></div>
                          <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Dec {28 - i}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-foreground">{Math.floor(Math.random() * 4) + 2} findings</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <span className="text-xs text-muted-foreground">+ 2 more analyses</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <article className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Our <strong>Dental AI Expert Team</strong></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the <strong>AI and data experts</strong> behind our dental analysis platform, bringing together 
              <em>cutting-edge technology</em> and deep domain expertise in artificial intelligence, machine learning, 
              and dental healthcare innovation.
            </p>
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Thirumala */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={thirumalaImage} 
                  alt="Thirumala Peddireddy - CEO and Data Management Expert with 20+ years experience in ERP solutions and data governance for dental AI platform" 
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">Thirumala Peddireddy</h3>
              <p className="text-sm text-primary font-medium mb-3">CEO</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Brings over 20 years of extensive experience in data management, specializing in data migration, master data governance, and ERP solutions. Has led global teams and collaborated with top-tier consulting firms like Accenture, Capgemini, and Wipro to deliver seamless data integrations and transformative data strategies that fuel business growth and operational excellence.
              </p>
              <a 
                href="https://www.linkedin.com/in/thiru1976/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Swaraj */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={swarajImage} 
                  alt="Swaraj Khan - CTO and AI Expert specializing in computer vision and machine learning for dental x-ray analysis technology" 
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">Swaraj Khan</h3>
              <p className="text-sm text-primary font-medium mb-3">CTO</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Brings strong expertise in artificial intelligence, with a proven track record demonstrated by multiple research publications. Skilled in designing and implementing robust end-to-end machine learning pipelines, with deep experience in computer vision and predictive model development for solving complex challenges effectively.
              </p>
              <a 
                href="https://www.linkedin.com/in/swaraj-khan/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Anushka */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={anuskaImage} 
                  alt="Anushka Saxena - Data Science Architect specializing in machine learning pattern recognition and statistical analysis for dental AI insights" 
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">Anushka Saxena</h3>
              <p className="text-sm text-primary font-medium mb-3">Architect</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Possesses a strong foundation in data science and machine learning, with a passion for transforming raw data into actionable insights. Skilled in pattern recognition, statistical analysis, and machine learning model development, with a particular focus on bridging complex data with clear, impactful decision-making.
              </p>
              <a 
                href="https://www.linkedin.com/in/anushka-saxena04/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                LinkedIn Profile →
              </a>
            </div>

            {/* Placeholder Team Member */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={placeholderImage} 
                  alt="Future team member placeholder - expanding dental AI expertise team for enhanced platform capabilities" 
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20 opacity-60"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                We're expanding our team with another expert to bring even more value to our platform. Stay tuned for updates!
              </p>
              <span className="text-muted-foreground text-sm">
                More info coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <strong>Ready to Transform Your Dental Practice?</strong>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of <strong>dental professionals worldwide</strong> who trust our 
            <em>AI-powered analysis platform</em> for accurate and efficient dental radiograph interpretation. 
            Start detecting dental conditions with clinical-grade precision today.
          </p>
          <Button size="lg" asChild>
            <a href="/auth" title="Begin your free dental AI analysis trial">Start Your Free Analysis Trial</a>
          </Button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            <strong>&copy; 2024 Dental AI Analysis Platform.</strong> All rights reserved. | 
            <a href="/auth" className="text-primary hover:underline ml-2" title="Access dental AI dashboard">Login</a> | 
            <a href="#about" className="text-primary hover:underline ml-2" title="Learn about our team">About</a> | 
            <a href="#features" className="text-primary hover:underline ml-2" title="Explore AI features">Features</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
