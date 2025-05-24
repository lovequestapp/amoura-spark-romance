
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

// Create React Context to track loading state
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('No user found in ProtectedRoute, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('User authenticated in ProtectedRoute, rendering children');
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    console.log('User not admin in AdminRoute, redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  console.log('User is admin in AdminRoute, rendering children');
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <div className="w-full max-w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/reset-password" element={<PasswordReset />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
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
