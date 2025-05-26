import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Camera, Plus, Eye, Settings, ShoppingBag, Crown, Share2, MapPin, GraduationCap, Heart, MessageCircle, Sparkles } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/20 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-amoura-soft-pink/10 via-purple-50/30 to-pink-50/20">
        {/* Enhanced Full-Width Header */}
        <div className="bg-white/90 backdrop-blur-lg border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
          <div className="w-full px-6 py-5">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <motion.button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 rounded-lg px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  <span className="font-medium">Back</span>
                </motion.button>
                <div className="border-l border-gray-300 h-8" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amoura-deep-pink to-purple-600 bg-clip-text text-transparent">
                    My Profile
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Manage your dating profile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowProfilePreview(true)}
                    variant="outline"
                    size="sm"
                    className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white transition-all duration-200 font-medium shadow-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Profile
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/settings')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Container */}
        <div className="w-full">
          {/* Hero Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amoura-deep-pink/5 via-purple-100/20 to-pink-100/15" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,20,147,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
            
            <div className="relative max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-center">
                {/* Profile Picture Section */}
                <div className="xl:col-span-1 flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative">
                      {/* Animated Ring */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-amoura-deep-pink via-purple-500 to-pink-500 rounded-full blur-sm group-hover:blur-md transition-all duration-300 animate-pulse"></div>
                      <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-amoura-soft-pink to-amoura-deep-pink p-2 shadow-2xl">
                        <img 
                          src={profile?.photos?.[0] || '/placeholder.svg'} 
                          alt={profile?.full_name || 'Profile'}
                          className="w-full h-full rounded-full object-cover bg-white shadow-lg"
                        />
                      </div>
                      
                      {/* Premium Crown */}
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full p-3 shadow-xl border-2 border-white">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Edit Button */}
                      <motion.div
                        className="absolute -bottom-2 -right-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          onClick={() => setShowPhotoUpload(true)}
                          className="rounded-full bg-white hover:bg-gray-50 text-gray-700 shadow-xl border-2 border-white h-12 w-12 p-0"
                        >
                          <Camera className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* Online Status */}
                    <div className="absolute bottom-8 right-8 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg animate-pulse" />
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setShowBasicInfoEdit(true)}
                        className="w-full bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 text-white shadow-lg font-medium py-3"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => navigate('/add-ons')}
                        variant="outline"
                        className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-medium py-3"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Premium Add-ons
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                {/* Profile Info Section */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="text-center xl:text-left">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3 leading-tight">
                      {profile?.full_name || 'Your Name'}
                      {profile?.birth_date && (
                        <span className="text-gray-600 font-normal ml-4 text-4xl">
                          {getAge(profile.birth_date)}
                        </span>
                      )}
                    </h1>
                    
                    {/* Enhanced Badges */}
                    <div className="flex flex-wrap gap-3 justify-center xl:justify-start mb-6">
                      {profile?.gender && (
                        <Badge className="bg-gradient-to-r from-amoura-soft-pink to-pink-200 text-amoura-deep-pink border-0 px-4 py-2 text-sm font-medium">
                          {profile.gender}
                        </Badge>
                      )}
                      {profile?.relationship_type && (
                        <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0 px-4 py-2 text-sm font-medium">
                          {profile.relationship_type}
                        </Badge>
                      )}
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 px-4 py-2 text-sm font-medium shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Premium Member
                      </Badge>
                    </div>

                    {/* Enhanced Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {profile?.education && (
                        <div className="flex items-center gap-3 justify-center xl:justify-start bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2">
                            <GraduationCap className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-700">{profile.education}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 justify-center xl:justify-start bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-2">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-700">San Francisco, CA</span>
                      </div>
                    </div>
                    
                    {/* Bio Preview */}
                    {profile?.bio && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {profile.bio.length > 150 ? `${profile.bio.substring(0, 150)}...` : profile.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            <QuickStats />
          </motion.div>

          <div className="max-w-7xl mx-auto px-6">
            <Separator className="mb-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

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
          </div>
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
      </div>
    </AppLayout>
  );
};

export default Profile;
