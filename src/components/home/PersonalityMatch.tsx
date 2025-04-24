
import React from 'react';
import { motion } from 'framer-motion';

interface PersonalityMatchProps {
  matchPercentage: number;
  traits: Array<{
    name: string;
    score: number;
  }>;
}

const PersonalityMatch: React.FC<PersonalityMatchProps> = ({ 
  matchPercentage = 85,
  traits = [
    { name: "Adventurous", score: 85 },
    { name: "Introverted", score: 45 },
    { name: "Creative", score: 90 },
  ]
}) => {
  return (
    <motion.div 
      className="bg-white p-4 rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Personality Match</h3>
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-amoura-deep-pink">{matchPercentage}%</span>
          </div>
          <svg className="h-12 w-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              strokeWidth="4"
              stroke="#f1f1f1"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              strokeWidth="4"
              stroke="#FF3D6F"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(matchPercentage / 100) * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
            />
          </svg>
        </div>
      </div>
      
      <div className="space-y-3">
        {traits.map((trait) => (
          <div key={trait.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{trait.name}</span>
              <span className="text-gray-500">{trait.score}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amoura-deep-pink rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${trait.score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalityMatch;
