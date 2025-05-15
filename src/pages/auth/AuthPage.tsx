
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from "lucide-react";
import { cleanupAuthState } from '@/utils/auth';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Clean up auth state when the component mounts
  // This prevents auth limbo states
  useEffect(() => {
    // Try to clean up any potential stale auth state
    cleanupAuthState();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Clean up auth state before attempting authentication
      cleanupAuthState();
      
      // Try to sign out globally before signing in (prevents auth issues)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Pre-auth signout failed, continuing:', err);
      }
      
      console.log("Attempting authentication:", isSignUp ? "signup" : "login");
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        console.log("Logging in with:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        console.log("Login successful");
        
        // Force page reload for a clean state with the new session
        window.location.href = '/home';
        return; // Prevent further execution
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      
      // More user-friendly error messages
      let errorMessage = error.message;
      
      if (error.message.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message.includes('rate limited')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-gray-500"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-amoura-black mb-2">
          {isSignUp ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-gray-500">
          {isSignUp ? "Start your journey today" : "Sign in to continue"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200"
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            {!isSignUp && (
              <Link to="/auth/password-reset" className="text-sm text-amoura-deep-pink">
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200"
            required
            minLength={6}
          />
          {isSignUp && (
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : (isSignUp ? "Create account" : "Log in")}
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="font-medium text-amoura-deep-pink"
        >
          {isSignUp ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
