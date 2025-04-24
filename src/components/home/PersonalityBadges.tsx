
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PersonalityBadgesProps {
  intention?: string;
  badges?: string[];
}

const PersonalityBadges: React.FC<PersonalityBadgesProps> = ({ intention, badges = [] }) => {
  const getIntentionColor = (intent: string) => {
    switch (intent) {
      case 'Casual':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Dating':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Relationship':
        return 'bg-sky-100 text-sky-800 hover:bg-sky-100';
      case 'Marriage':
        return 'bg-rose-100 text-rose-800 hover:bg-rose-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {intention && (
        <Badge className={`font-normal ${getIntentionColor(intention)}`} variant="outline">
          {intention}
        </Badge>
      )}
      
      {badges.map((badge, index) => (
        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-normal">
          {badge}
        </Badge>
      ))}
    </div>
  );
};

export default PersonalityBadges;
