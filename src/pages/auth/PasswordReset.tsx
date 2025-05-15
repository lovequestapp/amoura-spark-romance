
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from "lucide-react";
import { cleanupAuthState } from '@/utils/auth';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if we have a reset token from the URL
  const token = searchParams.get('token');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/password-reset`,
      });
      
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
      
      // Clean up auth state and redirect to login
      cleanupAuthState();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <button 
        onClick={() => navigate('/auth')}
        className="mb-6 flex items-center text-gray-500"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to login
      </button>
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-amoura-black mb-2">
          {token ? "Set new password" : "Reset password"}
        </h1>
        <p className="text-gray-500">
          {token 
            ? "Enter your new password below" 
            : "We'll send you an email with a reset link"
          }
        </p>
      </div>
      
      {token ? (
        <form onSubmit={handleSetNewPassword} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Update Password"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-6">
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
          
          <Button
            type="submit"
            className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
