
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { uploadPhotos, updateProfile, saveInterests, ProfilePrompt } from '@/services/onboarding';

export type OnboardingStepType = 'photos' | 'basicInfo' | 'interests' | 'lifestyle' | 'prompts';

interface OnboardingFormData {
  fullName: string;
  birthDate: string;
  gender: string;
  pronouns: string;
  height: string;
  drinking: string;
  education: string;
  relationshipType: string;
}

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: '',
    birthDate: '',
    gender: '',
    pronouns: '',
    height: '',
    drinking: '',
    education: '',
    relationshipType: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<ProfilePrompt[]>([{ question: '', answer: '' }]);
  
  const totalSteps = 5;
  
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Photos
        if (photos.length < 3) {
          toast({
            title: "Not enough photos",
            description: "Please upload at least 3 photos",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 2: // Basic Info
        if (!formData.fullName) {
          toast({
            title: "Missing information",
            description: "Please enter your first name",
            variant: "destructive",
          });
          return false;
        }
        
        if (!formData.birthDate) {
          toast({
            title: "Missing information",
            description: "Please enter your birth date",
            variant: "destructive",
          });
          return false;
        }
        
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayOccurred = 
          today.getMonth() > birthDate.getMonth() || 
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        const adjustedAge = hasBirthdayOccurred ? age : age - 1;
        
        if (adjustedAge < 18) {
          toast({
            title: "Age restriction",
            description: "You must be at least 18 years old to use this app",
            variant: "destructive",
          });
          return false;
        }
        
        if (!formData.gender) {
          toast({
            title: "Missing information",
            description: "Please select your gender",
            variant: "destructive",
          });
          return false;
        }
        
        return true;
        
      case 3: // Interests
        if (selectedInterests.length < 5) {
          toast({
            title: "Not enough interests",
            description: "Please select at least 5 interests",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 4: // Lifestyle
        // All fields are optional in lifestyle
        return true;
        
      case 5: // Prompts
        if (prompts.length > 0) {
          const hasIncompletePrompt = prompts.some(prompt => 
            (prompt.question && !prompt.answer) || (!prompt.question && prompt.answer)
          );
          
          if (hasIncompletePrompt) {
            toast({
              title: "Incomplete prompts",
              description: "Please complete or remove any half-filled prompts",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const handleNextStep = async (): Promise<boolean> => {
    try {
      if (!validateCurrentStep()) {
        return false;
      }
      
      setIsSubmitting(true);
      
      switch (currentStep) {
        case 1: // Photos
          const uploadedUrls = await uploadPhotos(photos);
          await updateProfile({ 
            photos: uploadedUrls,
            onboarding_step: currentStep + 1 
          });
          break;
          
        case 2: // Basic Info
          await updateProfile({
            birth_date: formData.birthDate,
            gender: formData.gender as any,
            pronouns: formData.pronouns,
            onboarding_step: currentStep + 1
          });
          break;
          
        case 3: // Interests
          await saveInterests(selectedInterests);
          await updateProfile({ onboarding_step: currentStep + 1 });
          break;
          
        case 4: // Lifestyle
          await updateProfile({
            height: parseInt(formData.height),
            drinking: formData.drinking,
            education: formData.education,
            relationship_type: formData.relationshipType,
            onboarding_step: currentStep + 1
          });
          break;
          
        case 5: // Prompts
          // Filter out empty prompts
          const filledPrompts = prompts.filter(prompt => 
            prompt.question && prompt.answer
          );
          
          await updateProfile({
            prompts: filledPrompts,
            onboarding_step: currentStep + 1,
            onboarding_completed: true
          });
          return true;
      }
      
      setCurrentStep(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return {
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
    handlePreviousStep,
  };
};
