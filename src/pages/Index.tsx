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

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced AI Analysis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our streamlined AI-powered workflow designed for dental professionals
            </p>
          </div>

          {/* Sequential Panels Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            
            {/* 1. Easy Upload Panel */}
            <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-all duration-300 group">
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-20 h-16 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Monitor className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="absolute -top-2 -right-2 bg-primary/10 rounded-full p-1">
                    <Hand className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm">Easy Upload</h3>
                <div className="space-y-2">
                  <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Drag & drop interface</div>
                  <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">File format validation</div>
                  <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">Progress tracking</div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/20 to-primary animate-pulse w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 2. AI Detection Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group">
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-20 h-16 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center border-2 border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-12 h-10 bg-muted/50 rounded border border-blue-300/50 dark:border-blue-700/50 relative">
                    <div className="absolute inset-1 bg-gradient-to-r from-blue-200/50 to-green-200/50 dark:from-blue-800/50 dark:to-green-800/50 rounded"></div>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse delay-700"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">20+</div>
                </div>
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">AI Detection</h3>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80">AI detects 20+ dental conditions</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/50">Caries</div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full border border-green-200/50 dark:border-green-800/50">Bone loss</div>
                  <div className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-200/50 dark:border-purple-800/50">Implants</div>
                </div>
              </div>
            </div>

            {/* 3. Detailed Reports Panel */}
            <div className="bg-gradient-to-br from-background to-muted/10 rounded-2xl p-6 border border-border/50 hover:border-muted-foreground/20 transition-all duration-300 group shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-foreground" />
                  <h3 className="font-semibold text-sm">Detailed Reports</h3>
                </div>
                <div className="relative bg-muted/30 rounded-lg p-3 border">
                  <div className="flex gap-3">
                    <div className="w-12 h-8 bg-gradient-to-br from-muted to-muted/50 rounded border flex-shrink-0 relative">
                      <div className="absolute inset-1 bg-gradient-to-r from-red-200/30 to-yellow-200/30 dark:from-red-900/30 dark:to-yellow-900/30 rounded"></div>
                      <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full"></div>
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="bg-accent/50 text-accent-foreground text-xs px-2 py-1 rounded">Annotated images</div>
                      <div className="bg-accent/50 text-accent-foreground text-xs px-2 py-1 rounded">Confidence scores</div>
                      <div className="bg-accent/50 text-accent-foreground text-xs px-2 py-1 rounded">Color-coded findings</div>
                      <div className="bg-accent/50 text-accent-foreground text-xs px-2 py-1 rounded">Print-ready format</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Secure & Private Panel */}
            <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10"></div>
              <div className="relative text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center border-2 border-blue-200/50 dark:border-blue-800/50 group-hover:scale-110 transition-transform">
                  <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-500"></div>
                </div>
                <h3 className="font-semibold text-sm">Secure & Private</h3>
                <div className="space-y-2">
                  <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full border border-blue-200/50 dark:border-blue-800/50">User authentication</div>
                  <div className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-3 py-1.5 rounded-full border border-purple-200/50 dark:border-purple-800/50">Encrypted storage</div>
                </div>
              </div>
            </div>

            {/* 5. Analysis History Panel */}
            <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl p-6 border border-border/50 hover:border-accent/30 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-foreground" />
                  <h3 className="font-semibold text-sm">Analysis History</h3>
                </div>
                <p className="text-xs text-muted-foreground">See your last 5 analyses</p>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group-hover:scale-105" style={{ transitionDelay: `${i * 50}ms` }}>
                      <div className="w-8 h-6 bg-gradient-to-br from-muted to-muted/50 rounded border flex-shrink-0 relative">
                        <div className="absolute inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded"></div>
                        <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-primary rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Dec {25 - i}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-foreground">{Math.floor(Math.random() * 5) + 2} findings</span>
                        </div>
                      </div>
                    </div>
                  ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

            {/* Swaraj */}
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={swarajImage} 
                  alt="Swaraj Khan" 
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
                  alt="Anushka Saxena" 
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
