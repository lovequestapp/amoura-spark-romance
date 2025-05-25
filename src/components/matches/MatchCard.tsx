
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/hooks/useMatches';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
    >
      <div className="relative mr-4">
        <img 
          src={match.photo} 
          alt={match.name}
          className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className={`absolute bottom-0 right-0 h-3 w-3 ${match.online ? 'bg-green-500' : 'bg-gray-300'} rounded-full border-2 border-white`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{match.name}</h3>
            {match.unread_count && match.unread_count > 0 && (
              <Badge className="bg-amoura-deep-pink text-white text-xs h-5 min-w-5 rounded-full flex items-center justify-center">
                {match.unread_count}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">{match.match_time}</span>
        </div>
        
        {match.last_message ? (
          <p className="text-sm text-gray-600 truncate">{match.last_message}</p>
        ) : (
          <p className="text-sm text-amoura-deep-pink font-medium">New match! Say hello</p>
        )}
      </div>
    </motion.div>
  );
};

export default MatchCard;
