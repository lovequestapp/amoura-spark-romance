
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dateIdeas = [
  "Take a cooking class together",
  "Go for a sunrise hike",
  "Try a wine tasting experience",
  "Visit a local art gallery",
  "Go on a kayaking adventure",
  "Attend a live music event",
  "Have a picnic in the park",
  "Visit a museum together",
  "Take a dance class",
  "Go stargazing away from city lights"
];

const DateIdea = () => {
  const [currentIdea, setCurrentIdea] = useState(
    dateIdeas[Math.floor(Math.random() * dateIdeas.length)]
  );
  const [isRotating, setIsRotating] = useState(false);
  
  const getNewIdea = () => {
    setIsRotating(true);
    setTimeout(() => {
      let newIdea = currentIdea;
      while (newIdea === currentIdea) {
        newIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
      }
      setCurrentIdea(newIdea);
      setIsRotating(false);
    }, 500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amoura-deep-pink/90 to-amoura-deep-pink px-4 py-3 rounded-xl mb-6 text-white shadow-md"
    >
      <div className="flex items-center">
        <div className="mr-3 bg-white/20 h-10 w-10 rounded-full flex items-center justify-center">
          <Calendar size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Today's Date Idea</h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIdea}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-white/90 text-sm font-medium"
            >
              {currentIdea}
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.div 
          animate={{ rotate: isRotating ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={getNewIdea}
          >
            <RefreshCw size={16} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DateIdea;
