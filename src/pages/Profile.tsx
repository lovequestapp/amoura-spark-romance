
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileGallery from '@/components/profile/ProfileGallery';
import BioEditDialog from '@/components/profile/BioEditDialog';
import PhotoUploadDialog from '@/components/profile/PhotoUploadDialog';
import PromptsEditDialog from '@/components/profile/PromptsEditDialog';
import ActiveInventory from '@/components/profile/ActiveInventory';
import QuickStats from '@/components/profile/QuickStats';
import BasicInfoEdit from '@/components/profile/BasicInfoEdit';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfileData } from '@/services/profile';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBioEdit, setShowBioEdit] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPromptsEdit, setShowPromptsEdit] = useState(false);
  const [showBasicInfoEdit, setShowBasicInfoEdit] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (url: string) => {
    setProfile(prev => ({
      ...prev,
      photos: [...(prev?.photos || []), url]
    }));
  };

  const handlePhotosChanged = (newPhotos: string[]) => {
    setProfile(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  const handleBioUpdated = (newBio: string) => {
    setProfile(prev => ({
      ...prev,
      bio: newBio
    }));
  };

  const handlePromptsUpdated = (newPrompts: any[]) => {
    setProfile(prev => ({
      ...prev,
      prompts: newPrompts
    }));
  };

  const handleBasicInfoUpdated = (updatedInfo: any) => {
    setProfile(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 flex items-center border-b">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </button>
          <h1 className="text-lg font-medium mx-auto">My Profile</h1>
          <Button
            onClick={() => navigate('/settings')}
            variant="ghost"
            size="sm"
          >
            Settings
          </Button>
        </div>

        <div className="p-6 space-y-8 max-w-2xl mx-auto">
          {/* Quick Stats */}
          <QuickStats />

          <Separator />

          {/* Basic Information */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Basic Information</h2>
              <Button
                onClick={() => setShowBasicInfoEdit(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{profile?.full_name || 'Add your name'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">
                    {profile?.birth_date 
                      ? new Date().getFullYear() - new Date(profile.birth_date).getFullYear()
                      : 'Add your age'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">San Francisco, CA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zodiac Sign</p>
                  <p className="font-medium">{profile?.zodiac_sign || 'Add your zodiac sign'}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Photos */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Photos</h2>
              <Button
                onClick={() => setShowPhotoUpload(true)}
                variant="outline"
                size="sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>
            
            {profile?.photos && profile.photos.length > 0 ? (
              <ProfileGallery 
                photos={profile.photos} 
                editable={true}
                onAddPhoto={() => setShowPhotoUpload(true)}
                onPhotosChanged={handlePhotosChanged}
              />
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add your first photo</h3>
                  <p className="text-gray-600 mb-4">Share photos to show your personality</p>
                  <Button onClick={() => setShowPhotoUpload(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <Separator />

          {/* About Me */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">About Me</h2>
              <Button
                onClick={() => setShowBioEdit(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {profile?.bio ? (
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">Tell people about yourself! Add a bio to help others get to know you better.</p>
                )}
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Prompts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Conversation Starters</h2>
              <Button
                onClick={() => setShowPromptsEdit(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            {profile?.prompts && profile.prompts.length > 0 ? (
              <div className="space-y-4">
                {profile.prompts.map((prompt: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-amoura-deep-pink mb-2">
                        {prompt.question}
                      </p>
                      <p className="text-gray-700">{prompt.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add conversation starters</h3>
                  <p className="text-gray-600 mb-4">Answer prompts to show your personality and give others something to talk about</p>
                  <Button onClick={() => setShowPromptsEdit(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prompts
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <Separator />

          {/* Active Inventory */}
          <section>
            <h2 className="text-lg font-medium mb-4">Active Inventory</h2>
            <ActiveInventory />
          </section>
        </div>

        {/* Edit Dialogs */}
        <BasicInfoEdit
          open={showBasicInfoEdit}
          onClose={() => setShowBasicInfoEdit(false)}
          profile={profile}
          onProfileUpdated={handleBasicInfoUpdated}
        />

        <BioEditDialog
          open={showBioEdit}
          onClose={() => setShowBioEdit(false)}
          currentBio={profile?.bio || ''}
          onBioUpdated={handleBioUpdated}
        />

        <PhotoUploadDialog
          open={showPhotoUpload}
          onClose={() => setShowPhotoUpload(false)}
          onPhotoUploaded={handlePhotoUploaded}
          currentPhotos={profile?.photos || []}
          currentPhotosCount={profile?.photos?.length || 0}
        />

        <PromptsEditDialog
          open={showPromptsEdit}
          onClose={() => setShowPromptsEdit(false)}
          currentPrompts={profile?.prompts || []}
          onPromptsUpdated={handlePromptsUpdated}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
