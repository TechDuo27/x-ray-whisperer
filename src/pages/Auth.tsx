import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('signin');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account.',
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: 'User Type Required',
        description: 'Please select whether you are a medical or non-medical user.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    // Add user type to metadata
    const { error } = await signUp(email, password, fullName, { user_type: userType });
    
    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Check Your Email!',
        description: 'We sent you a verification link. Please check your email to complete registration, then return to sign in.',
        duration: 6000,
      });
      // Switch to login tab after successful signup
      setTimeout(() => {
        setActiveTab('signin');
      }, 1000);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">🦷 Dental AI</CardTitle>
          <CardDescription>
            AI-powered dental X-ray analysis platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                {/* User Type Selection */}
                <div className="space-y-2 mb-4">
                  <Label>Select User Type</Label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Medical</h4>
                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors ${
                            userType === 'medical-student' ? 'border-primary bg-accent' : 'border-input'
                          }`}
                          onClick={() => setUserType('medical-student')}
                        >
                          <span className="text-sm">Student</span>
                        </div>
                        <div
                          className={`p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors ${
                            userType === 'medical-doctor' ? 'border-primary bg-accent' : 'border-input'
                          }`}
                          onClick={() => setUserType('medical-doctor')}
                        >
                          <span className="text-sm">Doctor</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Non-Medical</h4>
                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors ${
                            userType === 'non-medical-patient' ? 'border-primary bg-accent' : 'border-input'
                          }`}
                          onClick={() => setUserType('non-medical-patient')}
                        >
                          <span className="text-sm">Patient</span>
                        </div>
                        <div
                          className={`p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors ${
                            userType === 'non-medical-tester' ? 'border-primary bg-accent' : 'border-input'
                          }`}
                          onClick={() => setUserType('non-medical-tester')}
                        >
                          <span className="text-sm">Tester</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}