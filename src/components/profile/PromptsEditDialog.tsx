
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { fetchPrompts, updateProfilePrompts, type ProfilePrompt } from '@/services/profile';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PromptsEditDialogProps {
  open: boolean;
  onClose: () => void;
  currentPrompts: ProfilePrompt[];
  onPromptsUpdated: (newPrompts: ProfilePrompt[]) => void;
}

const PromptsEditDialog = ({ 
  open, 
  onClose, 
  currentPrompts, 
  onPromptsUpdated 
}: PromptsEditDialogProps) => {
  const [prompts, setPrompts] = useState<ProfilePrompt[]>(currentPrompts);
  const [availablePrompts, setAvailablePrompts] = useState<Array<{ id: string; question: string; category: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const loadPrompts = async () => {
      const data = await fetchPrompts();
      setAvailablePrompts(data);
    };
    loadPrompts();
  }, []);

  const handleAddPrompt = () => {
    const prompt = availablePrompts.find(p => p.question === selectedPrompt);
    if (prompt && prompts.length < 3) {
      setPrompts([...prompts, { question: prompt.question, answer: "" }]);
      setSelectedPrompt("");
    }
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleUpdateAnswer = (index: number, answer: string) => {
    const newPrompts = [...prompts];
    newPrompts[index].answer = answer;
    setPrompts(newPrompts);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfilePrompts(prompts);
    setIsLoading(false);

    if (success) {
      onPromptsUpdated(prompts);
      onClose();
      toast({
        title: "Prompts updated",
        description: "Your prompts have been successfully updated.",
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your prompts. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Prompts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {prompts.length < 3 && (
            <div className="flex gap-2">
              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a prompt" />
                </SelectTrigger>
                <SelectContent>
                  {availablePrompts
                    .filter(prompt => !prompts.some(p => p.question === prompt.question))
                    .map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.question}>
                        {prompt.question}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddPrompt} disabled={!selectedPrompt}>
                Add
              </Button>
            </div>
          )}
          
          {prompts.map((prompt, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{prompt.question}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePrompt(index)}
                >
                  Remove
                </Button>
              </div>
              <Textarea
                value={prompt.answer}
                onChange={(e) => handleUpdateAnswer(index, e.target.value)}
                placeholder="Your answer..."
                className="mt-2"
              />
            </div>
          ))}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptsEditDialog;
