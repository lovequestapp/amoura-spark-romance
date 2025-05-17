
import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { ProfilePrompt, validatePrompt } from '@/services/profile';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useError } from '@/contexts/ErrorContext';

interface PromptsStepProps {
  prompts: ProfilePrompt[];
  setPrompts: React.Dispatch<React.SetStateAction<ProfilePrompt[]>>;
}

const PromptsStep: React.FC<PromptsStepProps> = ({ prompts, setPrompts }) => {
  const { handleError } = useError();
  const [errors, setErrors] = useState<Record<number, string>>({});
  
  const handlePromptChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = {
      ...updatedPrompts[index],
      [field]: value
    };
    
    // Clear error when user makes changes
    if (errors[index]) {
      const newErrors = {...errors};
      delete newErrors[index];
      setErrors(newErrors);
    }
    
    setPrompts(updatedPrompts);
  };

  const validatePromptField = (index: number) => {
    const prompt = prompts[index];
    const error = validatePrompt(prompt);
    
    if (error) {
      setErrors(prev => ({ ...prev, [index]: error }));
      return false;
    } else {
      const newErrors = {...errors};
      delete newErrors[index];
      setErrors(newErrors);
      return true;
    }
  };

  const addPrompt = () => {
    // Validate existing prompts before adding new one
    let hasErrors = false;
    
    prompts.forEach((_, index) => {
      if (!validatePromptField(index)) {
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      return;
    }
    
    if (prompts.length < 3) {
      try {
        setPrompts([...prompts, { question: '', answer: '' }]);
      } catch (error) {
        handleError(error, "Failed to add new prompt");
      }
    }
  };
  
  const getCharacterCount = (text: string) => {
    return text ? text.length : 0;
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add some prompts</h2>
      <p className="text-gray-500 mb-8">Answer prompts to showcase your personality</p>
      
      <div className="space-y-6 mb-6">
        {prompts.map((prompt, index) => (
          <div key={index} className={`bg-amoura-soft-pink/30 rounded-xl p-4 ${index === 0 ? '' : ''}`}>
            {errors[index] && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors[index]}</AlertDescription>
              </Alert>
            )}
            
            <Select
              value={prompt.question}
              onValueChange={(value) => handlePromptChange(index, 'question', value)}
              onOpenChange={() => validatePromptField(index)}
            >
              <SelectTrigger className="w-full mb-3 bg-white border-0 shadow-sm">
                <SelectValue placeholder="Choose a prompt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Two truths and a lie...">Two truths and a lie...</SelectItem>
                <SelectItem value="My simple pleasures...">My simple pleasures...</SelectItem>
                <SelectItem value="I'm looking for...">I'm looking for...</SelectItem>
                <SelectItem value="We'll get along if...">We'll get along if...</SelectItem>
                <SelectItem value="A perfect date would be...">A perfect date would be...</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea 
              placeholder="Your answer..."
              value={prompt.answer}
              onChange={(e) => handlePromptChange(index, 'answer', e.target.value)}
              onBlur={() => validatePromptField(index)}
              className="w-full min-h-[100px] bg-white border-0 shadow-sm"
              maxLength={300}
            />
            
            <div className="flex justify-end mt-2">
              <span className={`text-xs ${
                getCharacterCount(prompt.answer) > 250 ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {getCharacterCount(prompt.answer)}/300
              </span>
            </div>
          </div>
        ))}
        
        {prompts.length < 3 && (
          <div 
            className="bg-gray-100 rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={addPrompt}
          >
            <div className="flex justify-center items-center h-24">
              <button type="button" className="text-amoura-deep-pink flex items-center">
                <Plus size={20} className="mr-1" />
                Add another prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsStep;
