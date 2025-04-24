
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface NoMoreProfilesProps {
  onRefresh: () => void;
}

const NoMoreProfiles: React.FC<NoMoreProfilesProps> = ({ onRefresh }) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="text-center p-6 mx-auto"
      style={{ maxWidth: "400px" }}
    >
      <div className="mb-4">
        <span className="text-6xl">✨</span>
      </div>
      <h3 className="text-2xl font-bold mb-2">You've seen all profiles for now</h3>
      <p className="text-gray-500 mb-6">Check back soon or adjust your preferences to see more people</p>
      
      <div className="space-y-4">
        <Button
          onClick={onRefresh}
          className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white w-full"
        >
          Refresh Profiles
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            toast({
              title: "Premium Feature",
              description: "Upgrade to see more profiles!",
            });
          }}
        >
          <Star size={16} className="text-amoura-gold" />
          <span>Upgrade to See More</span>
          <Badge variant="premium" className="ml-1">Premium</Badge>
        </Button>
      </div>
    </motion.div>
  );
};

export default NoMoreProfiles;
