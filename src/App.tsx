
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import { Toaster } from './components/ui/toaster';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import Community from './pages/Community';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import AuthPage from './pages/auth/AuthPage';
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
                  <Route path="/home" element={<Home />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<ProfileDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/reset-password" element={<PasswordReset />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
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
