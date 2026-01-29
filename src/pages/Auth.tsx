import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { privacyPolicy } from './privacyPolicy';

export default function Auth() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [userType, setUserType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('signin');
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{ email: string; fullName: string } | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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

    if (!privacyAccepted) {
      toast({
        title: 'Privacy Policy Required',
        description: 'Please accept the privacy policy to create an account.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName, { user_type: userType, privacy_policy_accepted: true });
    
    if (error) {
      const isEmailExists = error.message.toLowerCase().includes('user already registered') || 
                           error.message.toLowerCase().includes('email already exists') ||
                           error.message.toLowerCase().includes('already registered');
      
      toast({
        title: 'Sign Up Failed',
        description: isEmailExists 
          ? 'This email address is already registered. Please use a different email or try signing in instead.'
          : error.message,
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      setGoogleLoading(false);
    }
  };

  const handleUserTypeSubmission = async () => {
    if (!userType || !user) {
      toast({
        title: 'User Type Required',
        description: 'Please select your user type to continue.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { user_type: userType }
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update user type. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome!',
          description: 'Your account has been set up successfully.',
        });
        setShowUserTypeSelection(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">🦷 Oral Health Analyzer</CardTitle>
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
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </Button>
              </div>
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
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  />
                  <Label htmlFor="privacy" className="text-sm font-normal">
                    I accept the{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => setShowPrivacyPolicy(true)}
                    >
                      Privacy Policy
                    </button>
                  </Label>
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
              
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Last updated: {privacyPolicy.lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyPolicy.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <Button className="w-full mt-4" onClick={() => setShowPrivacyPolicy(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}