
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileStats from '@/components/profile/ProfileStats';
import PurchaseHistory from '@/components/profile/PurchaseHistory';
import ActiveInventory from '@/components/profile/ActiveInventory';
import QuickStats from '@/components/profile/QuickStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  const userInterests = profile?.interests || ['Travel', 'Music', 'Fitness', 'Reading'];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto p-4 space-y-8">
          {/* Profile Header */}
          <ProfileHeader profile={profile} getAge={getAge} />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <QuickStats />
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="photos" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="interests" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Interests
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="purchases" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
                  Purchases
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="overview" className="space-y-6">
                  {/* Bio Card */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amoura-deep-pink">
                        <Heart className="w-5 h-5" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {profile?.bio || "Tell people about yourself! Add a bio in your settings to help others get to know you better."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Prompts */}
                  {profile?.prompts && profile.prompts.length > 0 && (
                    <div className="grid gap-4">
                      {profile.prompts.slice(0, 3).map((prompt: any, index: number) => (
                        <ProfilePrompt
                          key={index}
                          question={prompt.question}
                          answer={prompt.answer}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="inventory">
                  <ActiveInventory />
                </TabsContent>

                <TabsContent value="photos">
                  <ProfilePhotos photos={profile?.photos || []} />
                </TabsContent>

                <TabsContent value="interests">
                  <ProfileInterests interests={userInterests} />
                </TabsContent>

                <TabsContent value="analytics">
                  <ProfileStats />
                </TabsContent>

                <TabsContent value="purchases">
                  <PurchaseHistory />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
