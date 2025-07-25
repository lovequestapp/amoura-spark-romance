
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

  // Function to check admin status
  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase.rpc('is_admin');
      console.log('Admin check result:', { data, error });
      
      if (!error && data !== null) {
        setIsAdmin(!!data);
        console.log('User admin status:', !!data);
      } else {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error in admin status check:', error);
      setIsAdmin(false);
    }
  }, []);

  // Refresh the session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        setTimeout(() => {
          checkAdminStatus(data.session.user.id);
        }, 0);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, [checkAdminStatus]);

  // Handle sign out with proper cleanup
  const signOut = useCallback(async () => {
    try {
      // Update user online status before signing out
      if (user) {
        try {
          await supabase.rpc('update_user_online_status', {
            user_id_param: user.id,
            is_online_param: false
          });
        } catch (error) {
          console.error('Error updating online status:', error);
        }
      }

      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
      
      cleanupAuthState();
      window.location.href = '/';
    }
  }, [toast, user]);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            // Handle admin status check
            if (session?.user && event === 'SIGNED_IN') {
              setTimeout(() => {
                if (!mounted) return;
                checkAdminStatus(session.user.id);
              }, 100);
            } else if (!session && mounted) {
              setIsAdmin(false);
            }
            
            // Always set loading to false after any auth event
            if (mounted) {
              setIsLoading(false);
            }
          }
        );
        
        // THEN get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        console.log('Initial session:', initialSession?.user?.email, error);
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          try {
            await checkAdminStatus(initialSession.user.id);
          } catch (error) {
            console.error('Error checking admin status:', error);
          }
        }
        
        // Set loading to false after initialization
        if (mounted) {
          setIsLoading(false);
        }
        
        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
        
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initialize auth state
    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [checkAdminStatus]);

  console.log('AuthContext state:', { isLoading, user: !!user, session: !!session, isAdmin });

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
