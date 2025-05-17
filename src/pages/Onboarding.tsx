
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/use-onboarding';

// Step components
import PhotoUploadStep from '@/components/onboarding/PhotoUploadStep';
import BasicInfoStep from '@/components/onboarding/BasicInfoStep';
import InterestsStep from '@/components/onboarding/InterestsStep';
import LifestyleStep from '@/components/onboarding/LifestyleStep';
import PromptsStep from '@/components/onboarding/PromptsStep';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    currentStep,
    totalSteps,
    isSubmitting,
    photos,
    setPhotos,
    formData,
    setFormData,
    selectedInterests,
    setSelectedInterests,
    prompts,
    setPrompts,
    handleNextStep,
    handlePreviousStep
  } = useOnboarding();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);
  
  const onContinue = async () => {
    const success = await handleNextStep();
    if (success && currentStep === totalSteps) {
      navigate('/home');
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotoUploadStep photos={photos} setPhotos={setPhotos} />;
      case 2:
        return <BasicInfoStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <InterestsStep selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} />;
      case 4:
        // Note: LifestyleStep component must accept formData as any or update its prop types
        return <LifestyleStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <PromptsStep prompts={prompts} setPrompts={setPrompts} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4 flex items-center border-b">
        <button 
          onClick={handlePreviousStep}
          className="flex items-center text-gray-500"
          disabled={isSubmitting || currentStep === 1}
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        
        <OnboardingProgress 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          className="mx-auto"
        />
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {renderStep()}
      </div>
      
      <div className="p-6 border-t">
        <Button
          onClick={onContinue}
          className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : currentStep === totalSteps ? "Complete Profile" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
