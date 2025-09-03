import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Upload, FileText, Shield, Zap, Monitor, Hand, CheckCircle, BarChart3, Lock, Clock, Calendar } from 'lucide-react';
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
      <section className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-16 w-16 text-primary mr-4" />
              <h1 className="text-5xl font-bold text-primary">Dental AI</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6">
              AI-Powered Dental X-Ray Analysis Platform
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced artificial intelligence technology for comprehensive dental radiograph analysis. 
              Detect dental conditions with precision and generate detailed professional reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/auth">Get Started</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#about">About Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Roadmap */}
      <section id="features" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Unlock Breakthrough Dental Insights Effortlessly</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Step into a streamlined AI-powered journey—from secure uploads to precise detection and easy-to-understand reports. Every feature is crafted to deliver fast, reliable, and actionable results that empower both clinicians and patients.
            </p>
          </div>

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
                  <h3 className="font-semibold text-lg mb-3 text-center text-emerald-900 dark:text-emerald-100">Secure & Private</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">User authentication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-teal-600" />
                      <span className="text-sm">Encrypted storage</span>
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
                  <h3 className="font-semibold text-lg mb-3 text-center">Easy Upload</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Hand className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-sm">Drag & drop interface</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">File format validation</span>
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
                  <h3 className="font-semibold text-lg mb-3 text-center text-blue-900 dark:text-blue-100">AI Detection</h3>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      <Zap className="h-4 w-4" />
                      AI detects 20 conditions
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-500/10 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full text-center border border-red-200/50">Caries</div>
                    <div className="bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded-full text-center border border-orange-200/50">Bone loss</div>
                    <div className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full text-center border border-purple-200/50">Implants</div>
                    <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-1 rounded-full text-center border border-yellow-200/50">Fractures</div>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts behind our AI-powered dental analysis platform, bringing together cutting-edge technology and deep domain expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Thirumala */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={thirumalaImage} 
                  alt="Thirumala Peddireddy" 
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


            {/* Placeholder Team Member */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={placeholderImage} 
                  alt="Team Member Coming Soon" 
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join dental professionals worldwide who trust our AI-powered analysis platform 
            for accurate and efficient dental radiograph interpretation.
          </p>
          <Button size="lg" asChild>
            <a href="/auth">Start Your Analysis</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Dental AI Analysis Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
