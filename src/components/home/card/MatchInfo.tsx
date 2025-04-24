
import React from 'react';
import { Info } from 'lucide-react';

interface MatchInfoProps {
  personalityMatch?: number;
  onClick: () => void;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ personalityMatch, onClick }) => {
  if (!personalityMatch) return null;

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-amoura-deep-pink mb-3 cursor-pointer"
    >
      <Info size={14} />
      <span>{personalityMatch}% match with your personality</span>
    </div>
  );
};

export default MatchInfo;
