
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';

interface ProfileStatsProps {
  matchRate?: number;
  responseRate?: number;
  popularity?: 'rising' | 'very high' | 'high' | 'average';
  verified?: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  matchRate = 65,
  responseRate = 92,
  popularity = 'high',
  verified = true
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-3">Profile Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-amoura-soft-pink/30 rounded-lg">
          <p className="text-sm text-gray-600">Match Rate</p>
          <p className="text-xl font-bold text-amoura-deep-pink">{matchRate}%</p>
        </div>
        
        <div className="text-center p-3 bg-amoura-soft-pink/30 rounded-lg">
          <p className="text-sm text-gray-600">Response Rate</p>
          <p className="text-xl font-bold text-amoura-deep-pink">{responseRate}%</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-600 mr-2">Popularity:</p>
          <Badge variant={popularity === 'rising' ? 'rose' : popularity === 'very high' ? 'premium' : 'default'}>
            {popularity === 'rising' ? 'Rising Star' : popularity.charAt(0).toUpperCase() + popularity.slice(1)}
          </Badge>
        </div>
        
        {verified && (
          <div className="flex items-center">
            <StarIcon size={16} className="text-amoura-gold mr-1" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
