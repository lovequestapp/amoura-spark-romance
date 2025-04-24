
import React from 'react';
import { MessageCircle, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CardActionsProps {
  profileName: string;
  onLike: () => void;
  onPass: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({ profileName, onLike, onPass }) => {
  const { toast } = useToast();

  const handleMessage = () => {
    toast({
      title: "Message Feature",
      description: "You can message after matching with this profile.",
    });
  };

  return (
    <div className="flex justify-between">
      <Button
        onClick={onPass}
        variant="outline"
        size="sm"
        className="rounded-full"
      >
        <X size={16} className="mr-1" />
        Pass
      </Button>
      
      <Button
        onClick={handleMessage}
        size="sm"
        className="rounded-full bg-transparent border border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-soft-pink"
      >
        <MessageCircle size={16} className="mr-1" />
        Message
      </Button>
      
      <Button
        onClick={onLike}
        size="sm"
        className="rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
      >
        <Heart size={16} className="mr-1" />
        Like
      </Button>
    </div>
  );
};

export default CardActions;
