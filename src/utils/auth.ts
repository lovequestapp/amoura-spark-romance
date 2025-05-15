
/**
 * Auth utilities to ensure proper session management and prevent auth limbo states
 */

/**
 * Cleans up all Supabase auth-related keys from storage
 * This helps prevent auth limbo states when logging in/out
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Signs out the user completely, clearing all auth state
 * @returns Promise that resolves when sign-out is complete
 */
export const signOutCompletely = async () => {
  try {
    // First clean up local storage
    cleanupAuthState();
    
    // Then attempt global sign out through Supabase
    const { error } = await import('@/integrations/supabase/client').then(
      ({ supabase }) => supabase.auth.signOut({ scope: 'global' })
    );
    
    if (error) console.error('Sign out error:', error);
    
    // Return to auth page and force reload to clear any in-memory state
    window.location.href = '/auth';
  } catch (err) {
    console.error('Error during sign out:', err);
    // Still try to redirect even if there's an error
    window.location.href = '/auth';
  }
};

/**
 * Gets the user display name from profile or email
 */
export const getUserDisplayName = (user: any, profile?: any) => {
  if (!user) return 'User';
  
  if (profile?.full_name) return profile.full_name;
  if (profile?.username) return profile.username;
  
  const email = user.email;
  if (email) return email.split('@')[0];
  
  return 'User';
};
