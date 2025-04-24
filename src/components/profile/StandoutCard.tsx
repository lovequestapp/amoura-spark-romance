
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

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
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(true);
    toast({
      title: "Profile Liked!",
      description: `You liked ${profile.name}'s profile. We'll let them know!`,
    });
  };

  const handleComment = () => {
    toast({
      title: "Comment Feature",
      description: "Coming soon! You'll be able to comment on prompts.",
    });
  };

  const handleSendRose = () => {
    toast({
      title: "Rose Sent!",
      description: `You sent ${profile.name} a rose. This shows you're really interested!`,
    });
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img 
          src={`https://source.unsplash.com${profile.photo}`}
          alt={profile.name}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute top-3 right-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendRose}
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Star size={18} className="text-amoura-gold" />
          </motion.button>
        </div>
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
            onClick={handleComment}
          >
            <MessageCircle size={18} className="mr-2" />
            Comment
          </Button>
          <motion.div 
            className="flex-1"
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`w-full rounded-full ${liked 
                ? 'bg-amoura-soft-pink text-amoura-deep-pink border border-amoura-deep-pink' 
                : 'bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white'}`}
              onClick={handleLike}
              disabled={liked}
            >
              <Heart 
                size={18} 
                className={`mr-2 ${liked ? 'fill-amoura-deep-pink' : ''}`} 
              />
              {liked ? 'Liked' : 'Like'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StandoutCard;
