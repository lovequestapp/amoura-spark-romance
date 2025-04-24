
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';

interface StandoutProfile {
  id: number;
  name: string;
  age: number;
  photo: string;
  prompt: {
    question: string;
    answer: string;
  };
}

interface StandoutCardProps {
  profile: StandoutProfile;
}

const StandoutCard: React.FC<StandoutCardProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      <div className="relative">
        <img 
          src={profile.photo} 
          alt={profile.name}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white text-xl font-bold">
            {profile.name}, {profile.age}
          </h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-medium text-amoura-deep-pink mb-1">{profile.prompt.question}</h4>
          <p className="text-gray-700">{profile.prompt.answer}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-soft-pink hover:text-amoura-deep-pink hover:border-amoura-deep-pink"
          >
            <MessageCircle size={18} className="mr-2" />
            Comment
          </Button>
          <Button
            className="flex-1 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
          >
            <Heart size={18} className="mr-2" />
            Like
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StandoutCard;
