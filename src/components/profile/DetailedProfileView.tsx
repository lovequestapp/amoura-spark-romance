
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Verified, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import ProfilePhotos from './ProfilePhotos';
import ProfilePrompt from './ProfilePrompt';
import { useNavigate } from 'react-router-dom';

interface DetailedProfileProps {
  profile: {
    id: number;
    name: string;
    age: number;
    distance: string;
    occupation: string;
    photos: string[];
    bio: string;
    verified?: boolean;
    premium?: boolean;
    personalityMatch?: number;
    prompts: {
      question: string;
      answer: string;
    }[];
    traits?: Array<{
      name: string;
      score: number;
    }>;
    relationshipIntention?: string;
    personalityBadges?: string[];
    location?: string;
    interests?: string[];
  };
}

const DetailedProfileView: React.FC<DetailedProfileProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      <div className="relative">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <ProfilePhotos photos={profile.photos} />

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.name}, {profile.age}
                {profile.verified && (
                  <Verified className="w-5 h-5 text-blue-500" />
                )}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location || profile.distance}</span>
              </div>
              <p className="text-gray-600 mt-1">{profile.occupation}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="lg" className="rounded-full">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button size="lg" className="rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {profile.personalityMatch && (
            <div className="bg-amoura-soft-pink/30 p-4 rounded-xl">
              <h3 className="font-medium text-amoura-deep-pink mb-2">
                {profile.personalityMatch}% Personality Match
              </h3>
              {profile.traits && (
                <div className="space-y-2">
                  {profile.traits.map((trait) => (
                    <div key={trait.name} className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">{trait.name}</div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-amoura-deep-pink rounded-full"
                          style={{ width: `${trait.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {profile.bio && (
            <div>
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          {profile.prompts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Prompts</h3>
              {profile.prompts.map((prompt, index) => (
                <ProfilePrompt
                  key={index}
                  question={prompt.question}
                  answer={prompt.answer}
                />
              ))}
            </div>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.relationshipIntention && (
            <div className="border-t pt-6">
              <h3 className="font-medium mb-2">Looking for</h3>
              <p className="text-gray-600">{profile.relationshipIntention}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedProfileView;
