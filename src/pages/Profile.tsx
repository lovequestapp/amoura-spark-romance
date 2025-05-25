
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
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

  const getAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          </div>
          <Button
            onClick={() => navigate('/settings')}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            Settings
          </Button>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Profile Header */}
          <ProfileHeader profile={profile} getAge={getAge} />

          {/* Quick Stats */}
          <QuickStats />

          <Separator />

          {/* Basic Information Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                <Button
                  onClick={() => setShowBasicInfoEdit(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{profile?.full_name || 'Add your name'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                  <p className="text-gray-900 font-medium">
                    {profile?.birth_date 
                      ? getAge(profile.birth_date)
                      : 'Add your age'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900 font-medium">San Francisco, CA</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Zodiac Sign</label>
                  <p className="text-gray-900 font-medium">{profile?.zodiac_sign || 'Add your zodiac sign'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Education</label>
                  <p className="text-gray-900 font-medium">{profile?.education || 'Add your education'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Looking For</label>
                  <p className="text-gray-900 font-medium">{profile?.relationship_type || 'Add what you\'re looking for'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Photos</CardTitle>
                <Button
                  onClick={() => setShowPhotoUpload(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.photos && profile.photos.length > 0 ? (
                <ProfileGallery 
                  photos={profile.photos} 
                  editable={true}
                  onAddPhoto={() => setShowPhotoUpload(true)}
                  onPhotosChanged={handlePhotosChanged}
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add your first photo</h3>
                  <p className="text-gray-600 mb-4">Share photos to show your personality</p>
                  <Button onClick={() => setShowPhotoUpload(true)} className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Me Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">About Me</CardTitle>
                <Button
                  onClick={() => setShowBioEdit(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.bio ? (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">Tell people about yourself! Add a bio to help others get to know you better.</p>
              )}
            </CardContent>
          </Card>

          {/* Conversation Starters */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Conversation Starters</CardTitle>
                <Button
                  onClick={() => setShowPromptsEdit(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.prompts && profile.prompts.length > 0 ? (
                <div className="space-y-4">
                  {profile.prompts.map((prompt: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-amoura-deep-pink mb-2">
                        {prompt.question}
                      </p>
                      <p className="text-gray-700">{prompt.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add conversation starters</h3>
                  <p className="text-gray-600 mb-4">Answer prompts to show your personality and give others something to talk about</p>
                  <Button onClick={() => setShowPromptsEdit(true)} className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prompts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Active Inventory */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Active Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveInventory />
            </CardContent>
          </Card>
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
