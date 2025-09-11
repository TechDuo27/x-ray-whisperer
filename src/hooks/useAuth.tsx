import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile when user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              // Check if profile exists first
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

              // Only create profile if it doesn't exist
              if (!existingProfile) {
                // For Google sign-ins, set default user type if not already set
                let userType = session.user.user_metadata?.user_type;
                if (!userType && session.user.app_metadata?.provider === 'google') {
                  userType = 'non-medical-patient'; // Default user type for Google sign-ins
                  
                  // Update user metadata with default user type
                  await supabase.auth.updateUser({
                    data: { user_type: userType }
                  });
                }

                await supabase.from('profiles').insert({
                  user_id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  user_type: userType,
                });
              }
            } catch (error) {
              console.log('Profile creation error:', error);
            }
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, metadata?: any) => {
    // Check if email is already used (must be unique)
    const { data: existingProfiles, count } = await supabase
      .from('profiles')
      .select('email', { count: 'exact' })
      .eq('email', email);

    if (count && count >= 1) {
      return { 
        error: { 
          message: 'This email is already registered',
          status: 400 
        } as AuthError 
      };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...metadata,
        },
      },
    });

    // Handle the specific case where Supabase returns user already registered error
    if (error && error.message.includes('User already registered')) {
      return { 
        error: { 
          message: 'This email is already registered',
          status: 400 
        } as AuthError 
      };
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signOut = async () => {
    // Clear local state immediately
    setUser(null);
    setSession(null);
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Force a page reload to ensure all state is cleared
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};