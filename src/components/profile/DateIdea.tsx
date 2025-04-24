
import React from 'react';
import { motion } from 'framer-motion';

const dateIdeas = [
  "Take a cooking class together",
  "Go for a sunrise hike",
  "Try a wine tasting experience",
  "Visit a local art gallery",
  "Go on a kayaking adventure",
  "Attend a live music event"
];

const DateIdea = () => {
  const randomIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amoura-deep-pink/90 to-amoura-deep-pink px-4 py-3 rounded-xl mb-4 text-white"
    >
      <div className="flex items-center">
        <div className="mr-3">
          <span className="text-2xl">✦</span>
        </div>
        <div>
          <h3 className="font-medium text-sm">Today's Date Idea</h3>
          <p className="text-white/90 text-sm">{randomIdea}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DateIdea;
