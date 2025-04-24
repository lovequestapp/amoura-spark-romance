
import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  currentStep, 
  totalSteps,
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index}
          className={`h-1 rounded-full transition-all ${
            index + 1 === currentStep 
              ? "w-8 bg-amoura-deep-pink" 
              : index + 1 < currentStep 
                ? "w-4 bg-amoura-deep-pink" 
                : "w-4 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default OnboardingProgress;
