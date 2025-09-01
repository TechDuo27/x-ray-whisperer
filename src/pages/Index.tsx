import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Upload, FileText, Shield, Zap } from 'lucide-react';
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
              Our platform uses state-of-the-art YOLO models to detect and analyze 
              various dental conditions with high accuracy and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Easy Upload</CardTitle>
                <CardDescription>
                  Drag and drop panoramic X-ray images with support for JPEG and PNG formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drag & drop interface</li>
                  <li>• File format validation</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI Detection</CardTitle>
                <CardDescription>
                  Dual YOLO model system detecting 18+ dental conditions with confidence scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Caries detection</li>
                  <li>• Bone loss analysis</li>
                  <li>• Implant identification</li>
                  <li>• Fracture detection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Detailed Reports</CardTitle>
                <CardDescription>
                  Comprehensive HTML reports with annotated images and professional formatting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Annotated images</li>
                  <li>• Confidence scores</li>
                  <li>• Color-coded findings</li>
                  <li>• Print-ready format</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  End-to-end encryption with user authentication and secure data storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User authentication</li>
                  <li>• Encrypted storage</li>
                  <li>• HIPAA compliant</li>
                  <li>• Access controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-time Analysis</CardTitle>
                <CardDescription>
                  Fast processing with adjustable confidence thresholds and instant results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instant processing</li>
                  <li>• Adjustable thresholds</li>
                  <li>• Real-time preview</li>
                  <li>• Quick export</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>
                  Track and review previous analyses with searchable history and comparisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Analysis archive</li>
                  <li>• Search functionality</li>
                  <li>• Comparison tools</li>
                  <li>• Export options</li>
                </ul>
              </CardContent>
            </Card>
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
