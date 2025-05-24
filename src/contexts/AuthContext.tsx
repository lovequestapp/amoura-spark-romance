
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Refresh the session - useful for when user's role changes
  const refreshSession = useCallback(async () => {
    try {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        setTimeout(async () => {
          try {
            const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
            if (!adminError && adminData !== null) {
              setIsAdmin(!!adminData);
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, []);

  // Handle sign out with proper cleanup
  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      
      // Navigate to home instead of forcing a reload
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
      
      // Try to clean up anyway
      cleanupAuthState();
      window.location.href = '/';
    }
  }, [toast]);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Get initial session immediately
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Initial session check:', initialSession ? 'Session found' : 'No session');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          try {
            const { data, error: adminError } = await supabase.rpc('is_admin');
            if (!adminError && data !== null) {
              setIsAdmin(!!data);
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };
    
    // Initialize auth state
    initializeAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session exists:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle admin status check
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            try {
              const { data, error } = await supabase.rpc('is_admin');
              if (!error && data !== null) {
                setIsAdmin(!!data);
              }
            } catch (error) {
              console.error('Error checking admin status:', error);
            }
          }, 100);
        } else if (!session) {
          setIsAdmin(false);
        }
        
        // Only set loading to false after initial auth check
        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signOut, refreshSession }}>
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
