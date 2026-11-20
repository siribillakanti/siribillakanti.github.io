import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSupabaseActive: boolean;
  signInWithPassword: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID as string | undefined;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    if (!isSupabaseActive || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseActive]);

  // Check if current authenticated user matches configured admin UUID
  const isAdmin = Boolean(
    user && (!ADMIN_USER_ID || user.id === ADMIN_USER_ID)
  );

  const signInWithPassword = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseActive || !supabase) {
      return { success: false, error: 'Supabase is not configured in environment variables.' };
    }

    try {
      if (import.meta.env.DEV && supabaseUrl) {
        try {
          const host = new URL(supabaseUrl).hostname;
          console.log(`[Auth Diagnostic] Attempting signInWithPassword at: https://${host}/auth/v1/token`);
        } catch {
          // ignore parsing error
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('[Auth Diagnostic] Supabase auth returned error:', error.name, error.message);
        }

        // Clarify browser network errors
        if (error.message === 'Failed to fetch') {
          let host = 'Supabase';
          try {
            host = new URL(supabaseUrl).hostname;
          } catch {
            // ignore
          }
          return {
            success: false,
            error: `Network Error (Failed to fetch): The browser could not resolve or reach "${host}". Please verify your VITE_SUPABASE_URL in .env.local against Project Settings -> API in your Supabase dashboard, and restart the dev server.`,
          };
        }

        return { success: false, error: error.message };
      }

      if (ADMIN_USER_ID && data.user.id !== ADMIN_USER_ID) {
        // Sign out immediately if not the designated admin UUID
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access Denied: This account is not authorized as the portfolio administrator.',
        };
      }

      setUser(data.user);
      setSession(data.session);
      return { success: true };
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.warn('[Auth Diagnostic] Unexpected auth exception:', err.name, err.message);
      }
      if (err.message === 'Failed to fetch') {
        let host = 'Supabase';
        try {
          host = new URL(supabaseUrl).hostname;
        } catch {
          // ignore
        }
        return {
          success: false,
          error: `Network Error (Failed to fetch): The browser could not resolve or reach "${host}". Please verify your VITE_SUPABASE_URL in .env.local against Project Settings -> API in your Supabase dashboard, and restart the dev server.`,
        };
      }
      return { success: false, error: err.message || 'An unexpected authentication error occurred.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseActive && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        isSupabaseActive,
        signInWithPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
