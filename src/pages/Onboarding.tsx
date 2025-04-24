
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PhotoUploader from '@/components/profile/PhotoUploader';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { updateProfile, uploadPhotos, ProfilePrompt, fetchInterests, saveInterests } from '@/services/onboarding';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowLeft, Plus, X } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [photos, setPhotos] = useState<{ file: File; url: string; }[]>([]);
  const [formData, setFormData] = useState({
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
  const [availableInterests, setAvailableInterests] = useState<any[]>([]);

  // Fetch interests when component mounts
  useEffect(() => {
    const getInterests = async () => {
      try {
        const interests = await fetchInterests();
        if (interests) setAvailableInterests(interests);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };
    
    getInterests();
  }, []);

  const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPhotos(prev => [...prev, { file, url }]);
  }, []);

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      switch (step) {
        case 1: // Photos
          if (photos.length < 3) {
            toast({
              title: "Not enough photos",
              description: "Please upload at least 3 photos",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          const uploadedUrls = await uploadPhotos(photos);
          await updateProfile({ 
            photos: uploadedUrls,
            onboarding_step: step + 1 
          });
          setStep(prev => prev + 1);
          break;

        case 2: // Basic Info
          await updateProfile({
            birth_date: formData.birthDate,
            gender: formData.gender as any,
            pronouns: formData.pronouns,
            onboarding_step: step + 1
          });
          break;

        case 3: // Interests
          if (selectedInterests.length < 5) {
            toast({
              title: "Not enough interests",
              description: "Please select at least 5 interests",
              variant: "destructive",
            });
            return;
          }
          await saveInterests(selectedInterests);
          await updateProfile({ onboarding_step: step + 1 });
          break;

        case 4: // Lifestyle
          await updateProfile({
            height: parseInt(formData.height),
            drinking: formData.drinking,
            education: formData.education,
            relationship_type: formData.relationshipType,
            onboarding_step: step + 1
          });
          break;

        case 5: // Prompts
          await updateProfile({
            prompts: prompts,
            onboarding_step: step + 1,
            onboarding_completed: true
          });
          navigate('/home');
          return;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add your photos</h2>
            <p className="text-gray-500 mb-8">Upload at least 3 photos to help others get to know you better</p>
            
            <PhotoUploader 
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={6}
            />
            
            <p className="text-xs text-gray-500 mt-4">
              Photos should clearly show your face and reflect your personality. Group photos are fine, but make sure we can identify you.
            </p>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
            
            <div className="space-y-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  id="name"
                  placeholder="Your first name"
                  className="w-full p-4 rounded-xl border border-gray-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                  Birthday
                </label>
                <Input
                  id="birthday"
                  type="date"
                  className="w-full p-4 rounded-xl border border-gray-200"
                  required
                />
                <p className="text-xs text-gray-500">You must be at least 18 years old</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="woman">Woman</SelectItem>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
                  Pronouns
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="Select pronouns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="she/her">She/Her</SelectItem>
                    <SelectItem value="he/him">He/Him</SelectItem>
                    <SelectItem value="they/them">They/Them</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your interests</h2>
            <p className="text-gray-500 mb-8">Select at least 5 interests to help us find your best matches</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                "Travel", "Cooking", "Reading", "Fitness", "Art", "Music", 
                "Photography", "Dancing", "Hiking", "Movies", "Gaming", "Yoga",
                "Writing", "Cycling", "Swimming", "Wine", "Coffee", "Foodie",
                "Tech", "Fashion", "Volunteering", "Pets", "Meditation", "Sports"
              ].map((interest, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition-all ${
                    index < 5 
                      ? "bg-amoura-soft-pink border-amoura-deep-pink text-amoura-deep-pink" 
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {interest}
                  {index < 5 && <X size={14} className="inline ml-2" />}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle questions</h2>
            <p className="text-gray-500 mb-8">Help potential matches get to know you better</p>
            
            <div className="space-y-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Relationship type
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="longterm">Long-term relationship</SelectItem>
                    <SelectItem value="shortterm">Short-term relationship</SelectItem>
                    <SelectItem value="casual">Casual dating</SelectItem>
                    <SelectItem value="friends">New friends</SelectItem>
                    <SelectItem value="stillFiguring">Still figuring it out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="Your highest level of education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="associate">Associate degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's degree</SelectItem>
                    <SelectItem value="master">Master's degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Drinking
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="How often do you drink?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="socially">Socially</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Height
                </label>
                <Select>
                  <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
                    <SelectValue placeholder="Your height" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 36 }).map((_, i) => {
                      const feet = Math.floor((i + 48) / 12);
                      const inches = (i + 48) % 12;
                      return (
                        <SelectItem key={i} value={`${i + 48}`}>
                          {feet}'{inches}"
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add some prompts</h2>
            <p className="text-gray-500 mb-8">Answer prompts to showcase your personality</p>
            
            <div className="space-y-6 mb-6">
              <div className="bg-amoura-soft-pink/30 rounded-xl p-4">
                <Select>
                  <SelectTrigger className="w-full mb-3 bg-white border-0 shadow-sm">
                    <SelectValue placeholder="Choose a prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prompt1">Two truths and a lie...</SelectItem>
                    <SelectItem value="prompt2">My simple pleasures...</SelectItem>
                    <SelectItem value="prompt3">I'm looking for...</SelectItem>
                    <SelectItem value="prompt4">We'll get along if...</SelectItem>
                    <SelectItem value="prompt5">A perfect date would be...</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Your answer..."
                  className="w-full min-h-[100px] bg-white border-0 shadow-sm"
                />
              </div>
              
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex justify-center items-center h-24">
                  <button className="text-amoura-deep-pink flex items-center">
                    <Plus size={20} className="mr-1" />
                    Add another prompt
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex justify-center items-center h-24">
                  <button className="text-gray-500 flex items-center">
                    <Plus size={20} className="mr-1" />
                    Add another prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4 flex items-center border-b">
        <button 
          onClick={() => setStep(prev => prev > 1 ? prev - 1 : 1)}
          className="flex items-center text-gray-500"
          disabled={isLoading}
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        
        <OnboardingProgress 
          currentStep={step} 
          totalSteps={totalSteps} 
          className="mx-auto"
        />
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {renderStep()}
      </div>
      
      <div className="p-6 border-t">
        <Button
          onClick={handleNextStep}
          className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : step === totalSteps ? "Complete Profile" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
