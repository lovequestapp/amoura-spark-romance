
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Compass } from 'lucide-react';

interface ProfileStatsProps {
  profileViews?: number;
  superLikes?: number;
  adventurePoints?: number;
  popularity?: 'rising' | 'very high' | 'high' | 'average';
  verified?: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  profileViews = 124,
  superLikes = 18,
  adventurePoints = 850,
  popularity = 'high',
  verified = true
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-medium text-gray-800 mb-3">Profile Stats</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-amoura-soft-pink/30 rounded-lg">
          <div className="flex justify-center mb-1">
            <Eye className="text-amoura-deep-pink" size={20} />
          </div>
          <p className="text-sm text-gray-600">Profile Views</p>
          <p className="text-xl font-bold text-amoura-deep-pink">{profileViews}</p>
        </div>
        
        <div className="text-center p-3 bg-amoura-soft-pink/30 rounded-lg">
          <div className="flex justify-center mb-1">
            <Heart className="text-amoura-deep-pink" size={20} />
          </div>
          <p className="text-sm text-gray-600">Super Likes</p>
          <p className="text-xl font-bold text-amoura-deep-pink">{superLikes}</p>
        </div>

        <div className="text-center p-3 bg-amoura-soft-pink/30 rounded-lg">
          <div className="flex justify-center mb-1">
            <Compass className="text-amoura-deep-pink" size={20} />
          </div>
          <p className="text-sm text-gray-600">Adventure Points</p>
          <p className="text-xl font-bold text-amoura-deep-pink">{adventurePoints}</p>
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

