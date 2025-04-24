
import React from 'react';
import { CheckCircle, Star, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  name: string;
  age: number;
  distance: string;
  verified?: boolean;
  premium?: boolean;
  featured?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
  distance,
  verified,
  premium,
  featured
}) => {
  return (
    <div className="flex justify-between items-baseline mb-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold flex items-center">
          {name}, {age}
          {verified && (
            <CheckCircle className="h-4 w-4 ml-1 text-blue-500 fill-white" />
          )}
        </h2>
        {premium && (
          <Badge variant="premium" className="h-5">Premium</Badge>
        )}
        {featured && (
          <Badge className="bg-gradient-to-r from-amoura-gold to-amber-400 text-black h-5 flex items-center">
            <Star className="h-3 w-3 mr-1 fill-black" /> Featured
          </Badge>
        )}
      </div>
      <span className="text-sm text-gray-500">{distance}</span>
    </div>
  );
};

export default ProfileHeader;
