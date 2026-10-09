import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { ApiService } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  register: (fullName: string, email: string, role: UserRole, isAdultVerified: boolean, password?: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
          }
        }
      } else {
        const currentUser = ApiService.getCurrentUser();
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, role: UserRole, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
          if (profile) setUser(profile as UserProfile);
        }
      } else {
        const loggedUser = ApiService.login(email, role);
        setUser(loggedUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, role: UserRole, isAdultVerified: boolean, password?: string) => {
    setIsLoading(true);
    try {
      if (!isAdultVerified) {
        throw new Error('You must be 18 years or older to register on Companion Connect.');
      }

      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role, is_adult_verified: true }
          }
        });
        if (error) throw error;
      } else {
        const newUser = ApiService.register(fullName, email, role, isAdultVerified);
        setUser(newUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    ApiService.setCurrentUser(null);
    setUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    // Demo role switching is restricted to local development mode
    if (!import.meta.env.DEV && isSupabaseConfigured) {
      console.warn('Demo role switching is disabled in production.');
      return;
    }

    if (role === 'customer') {
      login('aravind@example.com', 'customer');
    } else if (role === 'provider') {
      login('ananya@companionconnect.in', 'provider');
    } else if (role === 'admin') {
      login('admin@companionconnect.in', 'admin');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
