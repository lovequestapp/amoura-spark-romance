
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is loaded
    if (!isLoading) {
      console.log('AuthGuard check:', { user, requireAdmin, isAdmin });
      if (!user) {
        // No user - redirect to auth page
        console.log('No user, redirecting to /auth');
        navigate('/auth', { replace: true });
      } else if (requireAdmin && !isAdmin) {
        // User is not an admin but trying to access admin page
        console.log('Not admin, redirecting to /');
        navigate('/', { replace: true });
      } else {
        // User is authenticated and authorized, do nothing
        console.log('User authenticated and authorized');
      }
    }
  }, [user, isAdmin, isLoading, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
      </div>
    );
  }

  // If not logged in or not admin when required, render nothing while redirecting
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Render children only when authenticated and authorized
  return <>{children}</>;
};

export default AuthGuard;
