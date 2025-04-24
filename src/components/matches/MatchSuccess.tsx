
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileImage from '@/components/profile/ProfileImage';
import { useNavigate } from 'react-router-dom';

interface MatchSuccessProps {
  match: {
    id: number;
    name: string;
    photo: string;
  };
  onClose: () => void;
}

const MatchSuccess: React.FC<MatchSuccessProps> = ({ match, onClose }) => {
  const navigate = useNavigate();
  
  const handleMessage = () => {
    navigate(`/messages/${match.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X size={18} />
        </button>
        
        <div className="absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-amoura-deep-pink/20 to-transparent" />
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-6xl mb-2">❤️</div>
          <h2 className="text-2xl font-bold mb-6">It's a Match!</h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <ProfileImage 
                src="/assets/user-1.jpg" 
                alt="Your profile" 
                size="lg" 
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amoura-deep-pink flex items-center justify-center shadow-md"
              >
                <Heart size={16} className="text-white" />
              </motion.div>
            </div>
            
            <div className="relative">
              <ProfileImage 
                src={match.photo} 
                alt={match.name} 
                size="lg" 
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amoura-deep-pink flex items-center justify-center shadow-md"
              >
                <Heart size={16} className="text-white" />
              </motion.div>
            </div>
          </div>
          
          <p className="mb-6 text-gray-600">
            You and {match.name} have liked each other. Start a conversation now!
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleMessage}
              className="w-full rounded-full"
            >
              <MessageCircle size={18} className="mr-2" />
              Send a Message
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full rounded-full"
            >
              Keep Swiping
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MatchSuccess;
