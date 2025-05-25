
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Camera, Plus, Eye, Settings, ShoppingBag, Crown, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ProfileGallery from '@/components/profile/ProfileGallery';
import BioEditDialog from '@/components/profile/BioEditDialog';
import PhotoUploadDialog from '@/components/profile/PhotoUploadDialog';
import PromptsEditDialog from '@/components/profile/PromptsEditDialog';
import ActiveInventory from '@/components/profile/ActiveInventory';
import QuickStats from '@/components/profile/QuickStats';
import BasicInfoEdit from '@/components/profile/BasicInfoEdit';
import ProfilePreview from '@/components/profile/ProfilePreview';
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
  const [showProfilePreview, setShowProfilePreview] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/20 to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/20 to-purple-50">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-1" />
                  Back
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-gray-600">Manage your dating profile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowProfilePreview(true)}
                  variant="outline"
                  size="sm"
                  className="border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={() => navigate('/settings')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Enhanced Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amoura-deep-pink/10 via-purple-100/50 to-pink-100/30 rounded-3xl blur-xl" />
            
            <Card className="relative shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Profile Picture Section */}
                  <div className="relative group">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amoura-soft-pink to-amoura-deep-pink p-1">
                        <img 
                          src={profile?.photos?.[0] || '/placeholder.svg'} 
                          alt={profile?.full_name || 'Profile'}
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      
                      {/* Premium Badge */}
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Edit Button */}
                      <Button
                        size="sm"
                        onClick={() => setShowPhotoUpload(true)}
                        className="absolute -bottom-2 -right-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 shadow-lg border-2 border-white"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Online Status */}
                    <div className="absolute bottom-6 right-6 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {profile?.full_name || 'Your Name'}
                        {profile?.birth_date && (
                          <span className="text-gray-600 font-normal ml-3 text-3xl">
                            {getAge(profile.birth_date)}
                          </span>
                        )}
                      </h1>
                      
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

                    {profile?.bio && (
                      <p className="text-gray-700 max-w-md mx-auto lg:mx-0 leading-relaxed">
                        {profile.bio.length > 120 ? `${profile.bio.substring(0, 120)}...` : profile.bio}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setShowBasicInfoEdit(true)}
                      className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={() => navigate('/add-ons')}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add-ons
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <QuickStats />
          </motion.div>

          <Separator className="my-8" />

          {/* Enhanced Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photos Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-amoura-deep-pink" />
                      Photos ({profile?.photos?.length || 0}/6)
                    </CardTitle>
                    <Button
                      onClick={() => setShowPhotoUpload(true)}
                      variant="outline"
                      size="sm"
                      className="border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
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
            </motion.div>

            {/* About Me Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">About Me</CardTitle>
                    <Button
                      onClick={() => setShowBioEdit(true)}
                      variant="outline"
                      size="sm"
                      className="border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white"
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
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Tell people about yourself!</p>
                      <Button onClick={() => setShowBioEdit(true)} className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bio
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Conversation Starters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Conversation Starters</CardTitle>
                  <Button
                    onClick={() => setShowPromptsEdit(true)}
                    variant="outline"
                    size="sm"
                    className="border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white"
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
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                        <p className="text-sm font-medium text-amoura-deep-pink mb-2">
                          {prompt.question}
                        </p>
                        <p className="text-gray-700">{prompt.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add conversation starters</h3>
                    <p className="text-gray-600 mb-4">Answer prompts to show your personality</p>
                    <Button onClick={() => setShowPromptsEdit(true)} className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Prompts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <Separator className="my-8" />

          {/* Active Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ActiveInventory />
          </motion.div>
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

        <ProfilePreview
          open={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
          profile={profile}
          getAge={getAge}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
