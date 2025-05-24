
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import { Toaster } from './components/ui/toaster';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Community from './pages/Community';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import PasswordReset from './pages/auth/PasswordReset';
import Help from './pages/help/Help';
import Matches from './pages/Matches';
import Settings from './pages/Settings';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Dashboard from './pages/admin/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import { ErrorProvider } from './contexts/ErrorContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  console.log('ProtectedRoute - isLoading:', isLoading, 'user:', !!user);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public route component that redirects authenticated users
const PublicRoute = ({ children, redirectTo = "/home" }: { children: React.ReactNode; redirectTo?: string }) => {
  const { user, isLoading } = useAuth();
  
  console.log('PublicRoute - isLoading:', isLoading, 'user:', !!user);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If user is authenticated, redirect to the specified route
  if (user) {
    console.log('User authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <div className="w-full max-w-full min-h-screen bg-white">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/reset-password" element={
                    <PublicRoute>
                      <PasswordReset />
                    </PublicRoute>
                  } />
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/signup" element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } />
                  
                  {/* Protected routes */}
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/matches" element={
                    <ProtectedRoute>
                      <Matches />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:id" element={
                    <ProtectedRoute>
                      <ProfileDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } />
                  
                  {/* Public routes */}
                  <Route path="/help" element={<Help />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
