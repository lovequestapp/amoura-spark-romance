
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import AuthGuard from "./components/auth/AuthGuard";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Community from "./pages/Community";
import MessagePurchase from "./pages/MessagePurchase";
import AddOns from "./pages/AddOns";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminContent from "./pages/admin/Content";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

// Settings sub-pages
import ContactSettings from "./pages/settings/ContactSettings";

// Auth pages
import PasswordReset from "./pages/auth/PasswordReset";

// Help pages
import Help from "./pages/help/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/help" element={<Help />} />

                {/* Protected routes */}
                <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
                <Route path="/explore" element={<AuthGuard><Explore /></AuthGuard>} />
                <Route path="/matches" element={<AuthGuard><Matches /></AuthGuard>} />
                <Route path="/messages" element={<AuthGuard><Messages /></AuthGuard>} />
                <Route path="/message-purchase" element={<AuthGuard><MessagePurchase /></AuthGuard>} />
                <Route path="/cart" element={<AuthGuard><Cart /></AuthGuard>} />
                <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
                <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                <Route path="/profile/:id" element={<AuthGuard><ProfileDetail /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                <Route path="/settings/contact" element={<AuthGuard><ContactSettings /></AuthGuard>} />
                <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
                <Route path="/community" element={<AuthGuard><Community /></AuthGuard>} />

                {/* Admin routes */}
                <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
                <Route path="/admin/users" element={<AuthGuard><AdminUsers /></AuthGuard>} />
                <Route path="/admin/content" element={<AuthGuard><AdminContent /></AuthGuard>} />
                <Route path="/admin/analytics" element={<AuthGuard><AdminAnalytics /></AuthGuard>} />
                <Route path="/admin/settings" element={<AuthGuard><AdminSettings /></AuthGuard>} />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorProvider>
  </QueryClientProvider>
);

export default App;
