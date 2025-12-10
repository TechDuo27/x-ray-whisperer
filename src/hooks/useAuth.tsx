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
  // DEMO MODE: Force logged-in user for investor demo
  const demoUser = {
    id: 'demo-id',
    email: 'demo@investor.com',
    user_metadata: { 
      full_name: 'User',
      name: 'User'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;

  const [user, setUser] = useState<User | null>(demoUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Set to false - no loading in demo mode

  // DEMO MODE: Disabled Supabase auth listener
  // useEffect(() => {
  //   ... (all the Supabase code is disabled)
  // }, []);

  const signUp = async (email: string, password: string, fullName?: string, metadata?: any) => {
    // DEMO MODE: Mock signup
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // DEMO MODE: Mock signin
    return { error: null };
  };

  const signInWithGoogle = async () => {
    // DEMO MODE: Mock Google signin
    return { error: null };
  };

  const signOut = async () => {
    // DEMO MODE: Do nothing
  };

  return (
    <AuthContext.Provider value={{
      user: demoUser, // Always return demo user
      session,
      loading: false, // Never loading
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
