
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const iceBreakers = [
  "What's the best book you've read recently?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's your favorite way to spend a Sunday?",
  "What's something you're looking forward to this week?",
  "Coffee or tea? And how do you take it?",
  "What's your go-to karaoke song?"
];

const IceBreaker = () => {
  const [currentIceBreaker, setCurrentIceBreaker] = useState(
    iceBreakers[Math.floor(Math.random() * iceBreakers.length)]
  );
  
  const getNewIceBreaker = () => {
    let newIceBreaker = currentIceBreaker;
    while (newIceBreaker === currentIceBreaker) {
      newIceBreaker = iceBreakers[Math.floor(Math.random() * iceBreakers.length)];
    }
    setCurrentIceBreaker(newIceBreaker);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amoura-soft-pink/30 rounded-xl p-4"
    >
      <div className="flex items-start mb-3">
        <div className="h-8 w-8 rounded-full bg-amoura-deep-pink flex items-center justify-center mr-3 mt-1">
          <MessageCircle size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Ice Breaker</h3>
          <p className="text-gray-700">{currentIceBreaker}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-amoura-deep-pink border-amoura-deep-pink"
          onClick={getNewIceBreaker}
        >
          Try another
        </Button>
        
        <Button
          size="sm"
          className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
        >
          Use this
        </Button>
      </div>
    </motion.div>
  );
};

export default IceBreaker;
