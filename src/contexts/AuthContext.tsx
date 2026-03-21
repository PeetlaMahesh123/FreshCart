import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string, role?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  makeAdmin: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    if (!supabase) {
      console.error('❌ Supabase not available for profile fetch');
      setSupabaseError('Database connection error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.message.includes('Invalid API key') || error.status === 401) {
          setSupabaseError('Invalid API key - please check your Supabase configuration');
          console.error('❌ 401/Invalid API Key Error:', error.message);
        } else if (error.message.includes('does not exist')) {
          setSupabaseError('Database tables not created');
          console.error('❌ Database tables missing:', error.message);
        } else {
          console.error('Error fetching profile:', error);
        }
        throw error;
      }
      setProfile(data);
      setSupabaseError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't set loading to false here, let the main useEffect handle it
    }
  };

  useEffect(() => {
    // Enhanced auth initialization with error handling
    const initializeAuth = async () => {
      if (!supabase) {
        console.error('❌ Supabase client not available');
        setSupabaseError('Supabase not configured - please check your environment variables');
        setLoading(false);
        return;
      }

      try {
        // Test connection first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (sessionError.message.includes('Invalid API key') || sessionError.status === 401) {
            setSupabaseError('Invalid API key - please check your Supabase configuration');
            console.error('❌ 401/Invalid API Key Error in auth:', sessionError.message);
          } else {
            setSupabaseError('Authentication error: ' + sessionError.message);
            console.error('❌ Auth session error:', sessionError.message);
          }
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        setSupabaseError(null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setSupabaseError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with error handling
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event);
          
          if (event === 'TOKEN_REFRESHED' && session) {
            console.log('✅ Token refreshed successfully');
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            setSession(null);
            setSupabaseError(null);
          } else if (session) {
            setUser(session.user);
            setSession(session);
            await fetchProfile(session.user.id);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string, role?: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: role || 'user'
          }
        }
      });

      if (error) {
        if (error.message.includes('Invalid API key') || error.status === 401) {
          setSupabaseError('Invalid API key - please check your Supabase configuration');
        }
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid API key') || error.status === 401) {
          setSupabaseError('Invalid API key - please check your Supabase configuration');
        } else if (error.message.includes('Invalid login credentials')) {
          return { error: new Error('Invalid email or password') };
        }
        return { error };
      }

      setSupabaseError(null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setSupabaseError(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabase || !user) {
      return { error: new Error('Not authenticated or Supabase not available') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        if (error.message.includes('Invalid API key') || error.status === 401) {
          setSupabaseError('Invalid API key - please check your Supabase configuration');
        }
        return { error };
      }

      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const makeAdmin = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') };
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError) {
        if (userError.message.includes('Invalid API key') || userError.status === 401) {
          setSupabaseError('Invalid API key - admin functions require service role key');
        }
        return { error: userError };
      }

      if (!userData.user) {
        return { error: new Error('User not found') };
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.user.id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    makeAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {supabaseError && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          maxWidth: '400px',
          zIndex: 9999,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Configuration Error</div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>{supabaseError}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Please check your environment variables and restart the application.
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
