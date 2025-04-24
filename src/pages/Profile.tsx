
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProfilePrompt from '@/components/profile/ProfilePrompt';

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
  interests: ["Photography", "Hiking", "Coffee", "Travel", "Movies", "Cooking"]
};

const Profile = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="relative pb-6">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => navigate('/settings')}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <Settings size={20} />
          </button>
        </div>
        
        <ProfilePhotos photos={userProfile.photos} editable />
        
        <div className="p-4">
          <div className="flex items-baseline justify-between mb-1">
            <h1 className="text-2xl font-bold">{userProfile.name}, {userProfile.age}</h1>
          </div>
          
          <p className="text-gray-500 mb-4">{userProfile.occupation} • {userProfile.location}</p>
          
          <Button 
            onClick={() => navigate('/edit-profile')}
            variant="outline" 
            className="w-full mb-6"
          >
            Edit Profile
          </Button>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-medium mb-2">About me</h2>
              <p className="text-gray-700">{userProfile.bio}</p>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="font-medium mb-3">Prompts</h2>
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
            </div>
            
            <Separator />
            
            <div>
              <h2 className="font-medium mb-3">Basic Info</h2>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p>{userProfile.education}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="font-medium mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1 bg-amoura-soft-pink rounded-full text-sm text-amoura-deep-pink"
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
