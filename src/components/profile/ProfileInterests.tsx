
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ProfileInterestsProps {
  interests: string[];
  editable?: boolean;
  onAddInterest?: () => void;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ 
  interests, 
  editable = false,
  onAddInterest 
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Interests</h3>
      
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {interests.map((interest, index) => (
          <motion.div key={interest} variants={item}>
            <Badge 
              variant="secondary"
              className="py-1.5 text-sm bg-amoura-soft-pink text-amoura-deep-pink hover:bg-amoura-soft-pink/80"
            >
              {interest}
            </Badge>
          </motion.div>
        ))}
        
        {editable && (
          <motion.button
            variants={item}
            onClick={onAddInterest}
            className="flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Plus size={14} />
            Add
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileInterests;
