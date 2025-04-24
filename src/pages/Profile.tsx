
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileGallery from '@/components/profile/ProfileGallery';
import { Badge } from '@/components/ui/badge';

// Sample user profile data
const userProfile = {
  name: "Jamie",
  age: 29,
  photos: ["/assets/user-1.jpg", "/assets/user-2.jpg", "/assets/user-3.jpg"],
  bio: "Adventure enthusiast, coffee lover, and amateur photographer. Looking for someone to explore new places with.",
  occupation: "Marketing Specialist",
  location: "San Francisco",
  education: "Stanford University",
  prompts: [
    {
      question: "My simple pleasures...",
      answer: "Finding hidden coffee shops, reading in the park on sunny days, and spontaneous road trips with good playlists."
    },
    {
      question: "We'll get along if...",
      answer: "You enjoy trying new restaurants, can quote The Office, and don't mind my terrible puns."
    }
  ],
  interests: ["Photography", "Hiking", "Coffee", "Travel", "Movies", "Cooking"],
  premium: true
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddPhoto = () => {
    toast({
      title: "Coming Soon!",
      description: "The ability to add photos will be available soon.",
    });
  };

  const handleAddInterest = () => {
    toast({
      title: "Coming Soon!",
      description: "The ability to add interests will be available soon.",
    });
  };

  return (
    <AppLayout>
      <div className="relative pb-6">
        <motion.div 
          className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-4 flex items-center justify-between border-b"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-bold">{userProfile.name}</h1>
            {userProfile.premium && (
              <Badge variant="premium" className="flex items-center gap-1">
                <Star size={12} className="fill-black" />
                Premium
              </Badge>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/settings')}
            className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Settings size={18} />
          </button>
        </motion.div>
        
        <div className="p-4 space-y-6">
          <ProfileGallery 
            photos={userProfile.photos} 
            editable 
            onAddPhoto={handleAddPhoto}
          />
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{userProfile.name}, {userProfile.age}</h2>
                <p className="text-gray-600">{userProfile.occupation} • {userProfile.location}</p>
              </div>
              
              <Button 
                onClick={() => navigate('/edit-profile')}
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                Edit
              </Button>
            </div>
            
            {userProfile.bio && (
              <p className="text-gray-700">{userProfile.bio}</p>
            )}
          </motion.div>
          
          <ProfileStats />
          
          <Separator />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-medium mb-3">Prompts</h3>
            <div className="space-y-3">
              {userProfile.prompts.map((prompt, index) => (
                <ProfilePrompt 
                  key={index}
                  question={prompt.question}
                  answer={prompt.answer}
                  editable
                />
              ))}
            </div>
          </motion.div>
          
          <Separator />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-medium mb-3">Basic Info</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p>{userProfile.education}</p>
              </div>
            </div>
          </motion.div>
          
          <Separator />
          
          <ProfileInterests 
            interests={userProfile.interests} 
            editable
            onAddInterest={handleAddInterest}
          />
          
          <Separator />
          
          <div className="pt-2">
            <Button
              onClick={() => {
                toast({
                  title: "Account Settings",
                  description: "Account settings page coming soon!",
                });
              }}
              variant="outline"
              className="w-full mb-3"
            >
              Account Settings
            </Button>
            
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Upgrade to Premium to access exclusive features!",
                });
              }}
              className="w-full bg-gradient-to-r from-amoura-gold to-amber-500 hover:from-amber-500 hover:to-amoura-gold text-black"
            >
              <Star size={16} className="mr-2 fill-black" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
