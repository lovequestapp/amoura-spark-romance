
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit, MapPin, Calendar, GraduationCap, Briefcase, Heart, Star, Settings, ShoppingBag } from 'lucide-react';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileStats from '@/components/profile/ProfileStats';
import PurchaseHistory from '@/components/profile/PurchaseHistory';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  // Default interests if none are available
  const userInterests = profile?.interests || ['Travel', 'Music', 'Fitness', 'Reading'];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your profile and view your activity</p>
          </motion.div>

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full"
                      onClick={() => navigate('/settings')}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profile?.full_name || 'Your Name'}
                      {profile?.birth_date && (
                        <span className="text-gray-600 font-normal ml-2">
                          {getAge(profile.birth_date)}
                        </span>
                      )}
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {profile?.gender && (
                        <Badge variant="outline">{profile.gender}</Badge>
                      )}
                      {profile?.relationship_type && (
                        <Badge variant="outline">{profile.relationship_type}</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {profile?.education && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.education}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      onClick={() => navigate('/add-ons')}
                      className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add-ons
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6">
                  {/* Bio */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {profile?.bio || "Tell people about yourself! Add a bio in your settings to help others get to know you better."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Prompts */}
                  {profile?.prompts && profile.prompts.length > 0 && (
                    <div className="space-y-4">
                      {profile.prompts.slice(0, 3).map((prompt: any, index: number) => (
                        <ProfilePrompt
                          key={index}
                          question={prompt.question}
                          answer={prompt.answer}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <ProfilePhotos photos={profile?.photos || []} />
              </TabsContent>

              <TabsContent value="interests" className="mt-6">
                <ProfileInterests interests={userInterests} />
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <ProfileStats />
              </TabsContent>

              <TabsContent value="purchases" className="mt-6">
                <PurchaseHistory />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
