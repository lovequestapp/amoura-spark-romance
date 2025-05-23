
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { cleanupAuthState } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to /home');
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Attempting login with:', email);
      // Clean up auth state before attempting authentication
      cleanupAuthState();
      
      // Try to sign out globally before signing in (prevents auth issues)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Pre-auth signout failed, continuing:', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login successful, redirecting to home");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate programmatically instead of forcing page reload
      navigate('/home', { replace: true });
    } catch (error: any) {
      console.error("Login error:", error.message);
      
      // More user-friendly error messages
      let errorMessage = error.message;
      
      if (error.message?.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message?.includes('rate limited')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 w-full">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-500"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-amoura-black mb-2">Welcome back</h1>
        <p className="text-gray-500">Sign in to continue your journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="hello@example.com"
            className="w-full p-4 rounded-xl border border-gray-200"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/auth/reset-password" className="text-sm text-amoura-deep-pink">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border border-gray-200"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="py-6 rounded-xl border border-gray-200"
          onClick={() => {
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/home`
              }
            });
          }}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          className="py-6 rounded-xl border border-gray-200"
          onClick={() => {
            supabase.auth.signInWithOAuth({
              provider: 'facebook',
              options: {
                redirectTo: `${window.location.origin}/home`
              }
            });
          }}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              fill="#1877F2"
            />
          </svg>
          Facebook
        </Button>
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-amoura-deep-pink">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
