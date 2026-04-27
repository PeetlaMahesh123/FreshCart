import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      setUser(data.session?.user || null);

      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Fetch profile
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    setProfile(data || null);
  };

  // 🔹 SIGN UP
  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  // 🔹 SIGN IN
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // 🔹 SIGN OUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // 🔥 ✅ FIX 1: updateProfile
  const updateProfile = async (updates: any) => {
    if (!user) return { error: "No user" };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error(error);
      return { error };
    }

    setProfile({ ...profile, ...updates });
    return { success: true };
  };

  // 🔥 ✅ FIX 2: makeAdmin
  const makeAdmin = async (email: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email);

    if (error) {
      console.error(error);
      return { error };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,   // ✅ NOW EXISTS
        makeAdmin        // ✅ NOW EXISTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook
export function useAuth() {
  return useContext(AuthContext);
}