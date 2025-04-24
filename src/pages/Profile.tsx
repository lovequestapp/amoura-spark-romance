
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileGallery from '@/components/profile/ProfileGallery';
import ProfileAnalytics from '@/components/profile/ProfileAnalytics';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';
import { useToast } from '@/hooks/use-toast';
import PremiumModal from '@/components/subscription/PremiumModal';
import PhotoUploadDialog from '@/components/profile/PhotoUploadDialog';
import BioEditDialog from '@/components/profile/BioEditDialog';
import PromptsEditDialog from '@/components/profile/PromptsEditDialog';
import { fetchProfileData, updateProfileBio, updateProfilePrompts, type ProfilePrompt } from '@/services/profile';

const Profile = () => {
  const { user } = useAuth();
  const { tier, isSubscribed } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showBioEdit, setShowBioEdit] = useState(false);
  const [showPromptsEdit, setShowPromptsEdit] = useState(false);
  const [profileData, setProfileData] = useState<{
    photos: string[];
    bio: string;
    prompts: ProfilePrompt[];
  }>({
    photos: [],
    bio: "",
    prompts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user, toast]);

  const handlePhotoUploaded = (url: string) => {
    const newPhotos = [...profileData.photos, url];
    setProfileData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handlePhotosChanged = (newPhotos: string[]) => {
    setProfileData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handleBioUpdated = async (newBio: string) => {
    const success = await updateProfileBio(newBio);
    if (success) {
      setProfileData(prev => ({ ...prev, bio: newBio }));
      toast({
        title: "Bio updated",
        description: "Your bio has been updated successfully."
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your bio. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePromptsUpdated = async (newPrompts: ProfilePrompt[]) => {
    const success = await updateProfilePrompts(newPrompts);
    if (success) {
      setProfileData(prev => ({ ...prev, prompts: newPrompts }));
      toast({
        title: "Prompts updated",
        description: "Your prompts have been updated successfully."
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your prompts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-500">Loading profile...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20 border-2 border-amoura-deep-pink">
            <AvatarImage src={profileData.photos[0]} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <ProfileStats 
            profileViews={124}
            superLikes={18}
            popularity="high"
            verified={true}
          />
        </div>

        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">Your Photos</h2>
          <ProfileGallery 
            photos={profileData.photos} 
            editable={true} 
            onAddPhoto={() => setShowPhotoUpload(true)} 
            onPhotosChanged={handlePhotosChanged}
          />
          <Button 
            variant="outline" 
            className="w-full mt-3"
            onClick={() => setShowPhotoUpload(true)}
          >
            Edit Photos
          </Button>
        </div>
        
        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">About You</h2>
          <div className="bg-white p-4 rounded-lg border">
            <p>{profileData.bio || "Add a bio to tell people about yourself..."}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-3"
            onClick={() => setShowBioEdit(true)}
          >
            Edit Bio
          </Button>
        </div>
        
        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">Your Prompts</h2>
          {profileData.prompts.map((prompt, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-3">
              <h3 className="font-medium text-amoura-deep-pink">{prompt.question}</h3>
              <p className="mt-1">{prompt.answer}</p>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full mt-3 mb-8"
            onClick={() => setShowPromptsEdit(true)}
          >
            Edit Prompts
          </Button>
        </div>

        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amoura-deep-pink to-amoura-gold p-4 rounded-lg mb-4 text-white flex justify-between items-center">
            <div>
              <h2 className="font-bold">Upgrade to Premium</h2>
              <p className="text-sm">Get more visibility and premium features</p>
            </div>
            <Button 
              onClick={() => setShowPremiumModal(true)}
              size="sm"
              variant="secondary"
              className="bg-white text-amoura-deep-pink hover:bg-gray-100"
            >
              View Plans
            </Button>
          </div>
        )}
        <PremiumFeatures />

        <div className="mt-6">
          <ProfileAnalytics />
        </div>
        
        <div className="mt-8 flex justify-center gap-4 mb-20">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
          >
            Account Settings
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </Button>
        </div>

        <PhotoUploadDialog
          open={showPhotoUpload}
          onClose={() => setShowPhotoUpload(false)}
          onPhotoUploaded={handlePhotoUploaded}
          currentPhotos={profileData.photos}
          currentPhotosCount={profileData.photos.length}
        />
        
        <BioEditDialog
          open={showBioEdit}
          onClose={() => setShowBioEdit(false)}
          currentBio={profileData.bio}
          onBioUpdated={handleBioUpdated}
        />
        
        <PromptsEditDialog
          open={showPromptsEdit}
          onClose={() => setShowPromptsEdit(false)}
          currentPrompts={profileData.prompts}
          onPromptsUpdated={handlePromptsUpdated}
        />

        <PremiumModal 
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
