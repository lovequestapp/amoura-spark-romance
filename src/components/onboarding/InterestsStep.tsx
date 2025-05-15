
import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchInterests } from '@/services/onboarding';

interface InterestsStepProps {
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
}

type Interest = {
  id: string;
  name: string;
  category: string;
};

const InterestsStep: React.FC<InterestsStepProps> = ({ selectedInterests, setSelectedInterests }) => {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInterests = async () => {
      try {
        setIsLoading(true);
        const interests = await fetchInterests();
        if (interests) setAvailableInterests(interests);
      } catch (error) {
        console.error('Error fetching interests:', error);
        toast({
          title: "Error",
          description: "Failed to load interests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInterests();
  }, []);

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(prev => prev.filter(id => id !== interestId));
    } else {
      if (selectedInterests.length >= 10) {
        toast({
          title: "Maximum Interests",
          description: "You can select up to 10 interests",
          variant: "default",
        });
        return;
      }
      setSelectedInterests(prev => [...prev, interestId]);
    }
  };

  // Group interests by category
  const interestsByCategory = availableInterests.reduce((acc: Record<string, Interest[]>, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your interests</h2>
      <p className="text-gray-500 mb-2">Select at least 5 interests to help us find your best matches</p>
      <p className="text-gray-500 mb-8">
        <span className="font-semibold">{selectedInterests.length}</span> of 10 selected
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-amoura-deep-pink/30 border-t-amoura-deep-pink rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {Object.entries(interestsByCategory).map(([category, interests]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <div 
                      key={interest.id} 
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amoura-soft-pink border-amoura-deep-pink text-amoura-deep-pink" 
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {interest.name}
                      {isSelected && <X size={14} className="inline ml-2" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InterestsStep;
