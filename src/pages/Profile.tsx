import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Camera, Plus, Eye, Settings, ShoppingBag, Crown, Share2, MapPin, GraduationCap, Heart, MessageCircle, Sparkles, User, Globe } from 'lucide-react';
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
import InterestsEditDialog from '@/components/profile/InterestsEditDialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBioEdit, setShowBioEdit] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPromptsEdit, setShowPromptsEdit] = useState(false);
  const [showBasicInfoEdit, setShowBasicInfoEdit] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [showInterestsEdit, setShowInterestsEdit] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserInterests();
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

  const fetchUserInterests = async () => {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserInterests(data?.map(item => item.interest_id) || []);
    } catch (error) {
      console.error('Error fetching user interests:', error);
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

  const handleInterestsUpdated = (newInterests: string[]) => {
    setUserInterests(newInterests);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/20 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/10 via-purple-50/30 to-pink-50/20">
        {/* Enhanced Professional Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
          <div className="w-full px-4 md:px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {/* Left Section */}
              <div className="flex items-center gap-3 md:gap-4">
                <motion.button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 rounded-xl px-3 py-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium hidden sm:block">Back</span>
                </motion.button>
                
                <div className="border-l border-gray-300 h-8 hidden sm:block" />
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amoura-deep-pink to-purple-600 p-0.5">
                      <img 
                        src={profile?.photos?.[0] || '/placeholder.svg'} 
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  
                  <div>
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amoura-deep-pink to-purple-600 bg-clip-text text-transparent">
                      {profile?.full_name || 'My Profile'}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      Complete your profile • {Math.round((
                        (profile?.photos?.length > 0 ? 25 : 0) +
                        (profile?.bio ? 25 : 0) +
                        (profile?.prompts?.length > 0 ? 25 : 0) +
                        (userInterests.length > 0 ? 25 : 0)
                      ))}% done
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right Section */}
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowProfilePreview(true)}
                    variant="outline"
                    size="sm"
                    className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white transition-all duration-200 font-medium shadow-sm hidden sm:flex"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowProfilePreview(true)}
                    variant="outline"
                    size="sm"
                    className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white transition-all duration-200 font-medium shadow-sm sm:hidden"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/settings')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-xl"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Profile Management Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8"
          >
            {/* Quick Edit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setShowPhotoUpload(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 rounded-lg p-2">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">Photos</h3>
                        <p className="text-xs text-gray-600">{profile?.photos?.length || 0}/6</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setShowBasicInfoEdit(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">Basic Info</h3>
                        <p className="text-xs text-gray-600">Name, age, location</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setShowInterestsEdit(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">Interests</h3>
                        <p className="text-xs text-gray-600">{userInterests.length} selected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setShowBioEdit(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-2">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">About Me</h3>
                        <p className="text-xs text-gray-600">{profile?.bio ? 'Complete' : 'Add bio'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {/* Photos Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-2"
              >
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-amoura-soft-pink/20 to-purple-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 rounded-full p-2">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        Photos ({profile?.photos?.length || 0}/6)
                      </CardTitle>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setShowPhotoUpload(true)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Photo
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {profile?.photos && profile.photos.length > 0 ? (
                      <ProfileGallery 
                        photos={profile.photos} 
                        editable={true}
                        onAddPhoto={() => setShowPhotoUpload(true)}
                        onPhotosChanged={handlePhotosChanged}
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gradient-to-b from-gray-50 to-white">
                        <div className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Add your first photo</h3>
                        <p className="text-gray-600 mb-6 text-lg">Share photos to show your personality</p>
                        <Button 
                          onClick={() => setShowPhotoUpload(true)} 
                          className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 px-8 py-3 text-lg font-medium"
                        >
                          <Plus className="w-5 h-5 mr-2" />
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
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        About Me
                      </CardTitle>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setShowBioEdit(true)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white font-medium"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {profile?.bio ? (
                      <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Tell people about yourself!</h4>
                        <Button 
                          onClick={() => setShowBioEdit(true)} 
                          className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Conversation Starters - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      Conversation Starters
                    </CardTitle>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setShowPromptsEdit(true)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Prompts
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {profile?.prompts && profile.prompts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {profile.prompts.map((prompt: any, index: number) => (
                        <motion.div 
                          key={index} 
                          className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <p className="text-sm font-bold text-amoura-deep-pink mb-3 uppercase tracking-wide">
                            {prompt.question}
                          </p>
                          <p className="text-gray-700 text-lg leading-relaxed">{prompt.answer}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Add conversation starters</h3>
                      <p className="text-gray-600 mb-6 text-lg">Answer prompts to show your personality</p>
                      <Button 
                        onClick={() => setShowPromptsEdit(true)} 
                        className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 px-8 py-3 text-lg font-medium"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Prompts
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <Separator className="mb-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Active Inventory - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <ActiveInventory />
            </motion.div>
          </motion.div>
        </div>

        {/* Keep existing dialogs */}
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

        <InterestsEditDialog
          open={showInterestsEdit}
          onClose={() => setShowInterestsEdit(false)}
          currentInterests={userInterests}
          onInterestsUpdated={handleInterestsUpdated}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
