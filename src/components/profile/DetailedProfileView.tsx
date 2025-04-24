
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Verified, Heart, MessageCircle, Share2, MapPinIcon } from 'lucide-react';
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
      className="min-h-screen bg-white"
    >
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

      <div className="max-w-2xl mx-auto pb-20">
        {/* Hero Section */}
        <div className="w-full aspect-[4/3]">
          <img 
            src={profile.photos[0]} 
            alt={`${profile.name}'s main photo`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Basic Info Section */}
        <div className="px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
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
          </div>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="px-6 mt-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          </div>
        )}

        {/* Second Photo */}
        {profile.photos[1] && (
          <div className="mt-6">
            <img 
              src={profile.photos[1]} 
              alt={`${profile.name}'s second photo`}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Prompts Section */}
        {profile.prompts.length > 0 && (
          <div className="px-6 mt-6 space-y-4">
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

        {/* Third Photo */}
        {profile.photos[2] && (
          <div className="mt-6">
            <img 
              src={profile.photos[2]} 
              alt={`${profile.name}'s third photo`}
              className="w-full h-[300px] object-cover"
            />
          </div>
        )}

        {/* Personality & Interests */}
        {(profile.traits || profile.interests) && (
          <div className="px-6 mt-6">
            <div className="bg-amoura-soft-pink/30 rounded-xl p-6">
              {profile.traits && (
                <div className="space-y-2">
                  <h3 className="font-medium text-amoura-deep-pink mb-4">Personality Traits</h3>
                  {profile.traits.map((trait) => (
                    <div key={trait.name} className="flex items-center gap-2">
                      <div className="text-sm text-gray-600 w-24">{trait.name}</div>
                      <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amoura-deep-pink rounded-full"
                          style={{ width: `${trait.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profile.interests && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white rounded-full text-sm text-gray-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailedProfileView;
