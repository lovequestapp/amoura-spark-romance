
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { ProfilePrompt } from '@/services/onboarding';

interface PromptsStepProps {
  prompts: ProfilePrompt[];
  setPrompts: React.Dispatch<React.SetStateAction<ProfilePrompt[]>>;
}

const PromptsStep: React.FC<PromptsStepProps> = ({ prompts, setPrompts }) => {
  const handlePromptChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = {
      ...updatedPrompts[index],
      [field]: value
    };
    setPrompts(updatedPrompts);
  };

  const addPrompt = () => {
    if (prompts.length < 3) {
      setPrompts([...prompts, { question: '', answer: '' }]);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add some prompts</h2>
      <p className="text-gray-500 mb-8">Answer prompts to showcase your personality</p>
      
      <div className="space-y-6 mb-6">
        {prompts.map((prompt, index) => (
          <div key={index} className={`bg-amoura-soft-pink/30 rounded-xl p-4 ${index === 0 ? '' : ''}`}>
            <Select
              value={prompt.question}
              onValueChange={(value) => handlePromptChange(index, 'question', value)}
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
              className="w-full min-h-[100px] bg-white border-0 shadow-sm"
            />
          </div>
        ))}
        
        {prompts.length < 3 && (
          <div 
            className="bg-gray-100 rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={addPrompt}
          >
            <div className="flex justify-center items-center h-24">
              <button className="text-amoura-deep-pink flex items-center">
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
