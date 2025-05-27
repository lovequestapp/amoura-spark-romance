
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, DollarSign, MapPin, Verified, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';

interface DetailedProfileProps {
  profile: {
    id: number;
    name?: string;
    full_name?: string;
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
  const { toast } = useToast();
  const { hasItem } = useInventory();

  // Get the display name - prioritize full_name over name
  const displayName = profile.full_name || profile.name || 'User';

  const handleLike = () => {
    toast({
      title: "Profile Liked!",
      description: `You've liked ${displayName}'s profile. They'll be notified!`,
      variant: "default",
    });
  };

  const handleSuperLike = () => {
    toast({
      title: "Super Like Sent!",
      description: `You've super liked ${displayName}! They'll be notified immediately!`,
      variant: "default",
    });
  };

  const handleMessage = () => {
    // Check if user has messages in inventory
    if (hasItem('messages', 1)) {
      // Navigate to conversation/chat (implement this route as needed)
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${displayName}`,
      });
    } else {
      // Redirect to message purchase page
      navigate('/message-purchase');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50"
    >
      {/* Sticky Header with Blur Effect */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100/80"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLike}
              size="lg"
              className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              Like Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-20">
        {/* Hero Section with Main Photo */}
        <div className="relative w-full aspect-[4/5]">
          <img 
            src={profile.photos[0]} 
            alt={`${displayName}'s main photo`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {displayName}, {profile.age}
                {profile.verified && (
                  <Verified className="w-6 h-6 text-blue-400" />
                )}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span>{profile.location || profile.distance}</span>
              </div>
              <p className="text-white/80 mt-1">{profile.occupation}</p>
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="px-6 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleMessage}
                className="border-gray-200 hover:bg-gray-50 py-3 flex-1"
              >
                <DollarSign className="w-4 h-4 mr-2 text-amoura-deep-pink" />
                <span>{hasItem('messages', 1) ? 'Message' : 'Buy Messages'}</span>
              </Button>
              <Button
                onClick={handleLike}
                className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 py-3 flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span>Like</span>
              </Button>
              <Button
                onClick={handleSuperLike}
                className="bg-amoura-gold text-black hover:bg-amoura-gold/90 py-3 flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                <span>Super Like</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 mt-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          </motion.div>
        )}

        {/* Photos & Prompts Interspersed */}
        {profile.photos.slice(1).map((photo, index) => (
          <React.Fragment key={index}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="mt-6"
            >
              <img 
                src={photo} 
                alt={`${displayName}'s photo ${index + 2}`}
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </motion.div>

            {profile.prompts[index] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="px-6 mt-6"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm text-gray-500 mb-2">{profile.prompts[index].question}</h4>
                  <p className="text-gray-800 font-medium">{profile.prompts[index].answer}</p>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}

        {/* Traits Section */}
        {profile.traits && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-6 mt-6"
          >
            <div className="bg-gradient-to-br from-amoura-soft-pink to-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Personality Traits</h3>
              <div className="space-y-3">
                {profile.traits.map((trait) => (
                  <div key={trait.name} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{trait.name}</span>
                      <span className="text-amoura-deep-pink font-medium">{trait.score}%</span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trait.score}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-amoura-deep-pink rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Interests Section */}
        {profile.interests && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 mt-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailedProfileView;
