
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Import all page components
import Index from "@/pages/Index";
import AuthPage from "@/pages/auth/AuthPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import Community from "@/pages/Community";
import Matches from "@/pages/Matches";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ProfileDetail from "@/pages/ProfileDetail";
import DetailedProfileView from "@/components/profile/DetailedProfileView";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";

//New imports
import ContactSettings from "@/pages/settings/ContactSettings";
import Help from "@/pages/help/Help";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/messages/:id" element={<Messages />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile/:id" element={<ProfileDetail />} />
                    <Route path="*" element={<NotFound />} />
                    
                    {/* New routes */}
                    <Route path="/settings/contact" element={<ContactSettings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/privacy-policy" element={<Help />} />
                    <Route path="/terms" element={<Help />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      {/* Additional admin routes will be added here */}
                    </Route>
                  </Routes>
                </AnimatePresence>
              </TooltipProvider>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
