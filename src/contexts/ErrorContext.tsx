
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

// Define the Error context type
export interface ErrorContextType {
  handleError: (error: unknown, customMessage?: string) => void;
  isRecovering: boolean;
  recoverFromError: () => void;
  clearErrorState: () => void;
}

// Create context with default values
const ErrorContext = createContext<ErrorContextType>({
  handleError: () => {},
  isRecovering: false,
  recoverFromError: () => {},
  clearErrorState: () => {}
});

export const useError = () => useContext(ErrorContext);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const queryClient = useQueryClient();

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Application error:', error);
    
    // Format different error types
    let errorMessage = customMessage || "An unexpected error occurred";
    
    if (error instanceof Error) {
      errorMessage = customMessage || error.message;
      
      // Check for network errors
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('Network request failed')) {
        errorMessage = "Network connection issue. Please check your internet connection and try again.";
      }
      
      // Check for authentication errors
      if (error.message.includes('authentication') || 
          error.message.includes('auth') || 
          error.message.includes('401') ||
          error.message.includes('403')) {
        errorMessage = "Authentication issue. Please try logging in again.";
      }
    } else if (typeof error === 'string') {
      errorMessage = customMessage || error;
    }
    
    // Show toast notification
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
  }, []);

  const recoverFromError = useCallback(() => {
    setIsRecovering(true);
    
    // Invalidate queries to trigger refetch
    queryClient.invalidateQueries();
    
    // Set a timeout to reset the recovering state
    setTimeout(() => {
      setIsRecovering(false);
    }, 1000);
  }, [queryClient]);

  const clearErrorState = useCallback(() => {
    setIsRecovering(false);
  }, []);

  const value = {
    handleError,
    isRecovering,
    recoverFromError,
    clearErrorState
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
