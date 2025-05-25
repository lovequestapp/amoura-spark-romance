
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, MapPin, GraduationCap, Settings, ShoppingBag, Crown } from 'lucide-react';

interface ProfileHeaderProps {
  profile: any;
  getAge: (birthDate: string) => number | null;
}

const ProfileHeader = ({ profile, getAge }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amoura-deep-pink/10 to-purple-100 rounded-2xl" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Picture Section */}
          <div className="relative">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-amoura-soft-pink to-amoura-deep-pink text-white">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Premium Badge */}
              <div className="absolute -top-2 -right-2">
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Edit Button */}
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
                onClick={() => navigate('/settings')}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Online Status */}
            <div className="absolute bottom-6 right-6 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" />
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            {/* Name and Age */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile?.full_name || 'Your Name'}
                {profile?.birth_date && (
                  <span className="text-gray-600 font-normal ml-3 text-3xl">
                    {getAge(profile.birth_date)}
                  </span>
                )}
              </h1>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                {profile?.gender && (
                  <Badge variant="secondary" className="bg-amoura-soft-pink text-amoura-deep-pink">
                    {profile.gender}
                  </Badge>
                )}
                {profile?.relationship_type && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {profile.relationship_type}
                  </Badge>
                )}
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                  Premium Member
                </Badge>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-gray-600">
              {profile?.education && (
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">{profile.education}</span>
                </div>
              )}
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">San Francisco, CA</span>
              </div>
            </div>
            
            {/* Bio Preview */}
            {profile?.bio && (
              <p className="text-gray-700 max-w-md mx-auto lg:mx-0 leading-relaxed">
                {profile.bio.length > 100 ? `${profile.bio.substring(0, 100)}...` : profile.bio}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className="border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate('/add-ons')}
              className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Premium Add-ons
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/settings')}
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
