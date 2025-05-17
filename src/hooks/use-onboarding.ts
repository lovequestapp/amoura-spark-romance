import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { ProfilePrompt, updateProfilePhotos } from '@/services/profile';
import { toast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  education: string;
  relationshipType: string;
  bio: string;
  height?: number;
  religion?: string;
  drinking?: string;
  smoking?: string;
  exercise?: string;
  [key: string]: any;
}

const initialFormData: FormData = {
  name: '',
  age: 18,
  gender: '',
  location: '',
  occupation: '',
  education: '',
  relationshipType: '',
  bio: '',
};

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<ProfilePrompt[]>([
    { question: '', answer: '' }
  ]);
  
  const { user } = useAuth();
  const { handleError } = useError();

  // Load existing onboarding data if available
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_data, photos')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching onboarding data:', error);
          return;
        }
        
        if (data && data.onboarding_data) {
          const onboardingData = data.onboarding_data;
          
          // Restore previously saved data
          if (onboardingData.formData) {
            setFormData(onboardingData.formData);
          }
          
          if (onboardingData.selectedInterests) {
            setSelectedInterests(onboardingData.selectedInterests);
          }
          
          if (onboardingData.prompts) {
            setPrompts(onboardingData.prompts);
          }
        }
        
        if (data && data.photos && data.photos.length > 0) {
          // Create placeholder File objects for existing photos
          const restoredPhotos = data.photos.map((url: string) => ({
            file: new File([''], 'restored-photo.jpg', { type: 'image/jpeg' }),
            url
          }));
          
          setPhotos(restoredPhotos);
        }
      } catch (err) {
        console.error('Error restoring onboarding data:', err);
      }
    };
    
    loadOnboardingData();
  }, [user]);
  
  // Validation functions
  const validateStep = useCallback((step: number): { isValid: boolean; message?: string } => {
    switch(step) {
      case 1: // Photos
        if (photos.length < 1) {
          return { isValid: false, message: "Please upload at least one photo to continue." };
        }
        return { isValid: true };
        
      case 2: // Basic Info
        if (!formData.name.trim()) {
          return { isValid: false, message: "Name is required." };
        }
        if (!formData.age || formData.age < 18) {
          return { isValid: false, message: "You must be at least 18 years old." };
        }
        if (!formData.gender) {
          return { isValid: false, message: "Please select your gender." };
        }
        if (!formData.location.trim()) {
          return { isValid: false, message: "Location is required." };
        }
        return { isValid: true };
        
      case 3: // Interests
        if (selectedInterests.length < 3) {
          return { isValid: false, message: "Please select at least 3 interests." };
        }
        return { isValid: true };
        
      case 4: // Lifestyle
        // Lifestyle is optional
        return { isValid: true };
        
      case 5: // Prompts
        if (prompts.length < 1) {
          return { isValid: false, message: "Please add at least one prompt." };
        }
        
        const emptyPrompt = prompts.find(p => !p.question || !p.answer.trim());
        if (emptyPrompt) {
          return { isValid: false, message: "Please complete all prompts." };
        }
        
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  }, [photos, formData, selectedInterests, prompts]);
  
  const saveOnboardingProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      const onboardingData = {
        formData,
        selectedInterests,
        prompts
      };
      
      await supabase
        .from('profiles')
        .update({ 
          onboarding_data: onboardingData,
          last_onboarding_step: currentStep
        })
        .eq('id', user.id);
    } catch (err) {
      console.error('Error saving onboarding progress:', err);
      // Don't block the user flow for save progress errors
    }
  }, [user, formData, selectedInterests, prompts, currentStep]);

  const handleNextStep = useCallback(async () => {
    // Validate current step
    const validation = validateStep(currentStep);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }
    
    // Save progress to database before moving to next step
    await saveOnboardingProgress();
    
    // If on last step, submit the form
    if (currentStep === totalSteps) {
      return await handleFinalSubmit();
    }
    
    // Otherwise, move to the next step
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    return true;
  }, [currentStep, totalSteps, validateStep, saveOnboardingProgress]);
  
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleFinalSubmit = useCallback(async () => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      // Extract urls from photos objects
      const photoUrls = photos.map(photo => photo.url);
      
      // Update the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          age: formData.age,
          gender: formData.gender,
          location: formData.location,
          occupation: formData.occupation,
          education: formData.education,
          relationship_type: formData.relationshipType,
          bio: formData.bio,
          height: formData.height,
          religion: formData.religion,
          drinking: formData.drinking,
          smoking: formData.smoking,
          exercise: formData.exercise,
          interests: selectedInterests,
          prompts: prompts,
          photos: photoUrls,
          onboarding_completed: true,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update photos separately to ensure they're properly saved
      const photoResult = await updateProfilePhotos(photoUrls);
      if (!photoResult.success) {
        console.warn('Warning: Photos may not have updated correctly');
      }
      
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully!"
      });
      
      return true;
    } catch (error) {
      handleError(error, "Failed to save your profile. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, formData, photos, selectedInterests, prompts, handleError]);

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
    validateStep
  };
};
