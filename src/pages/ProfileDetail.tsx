import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Heart, UserPlus, UserCheck, MoreHorizontal } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';
import PaidMessageDialog from '@/components/messages/PaidMessageDialog';
import { useInventory } from '@/hooks/useInventory';

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { hasItem } = useInventory();
  const [showPaidMessageDialog, setShowPaidMessageDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Fetch profile data from Supabase based on the ID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    // Check if user has paid messages in inventory
    if (hasItem('messages', 1)) {
      setShowPaidMessageDialog(true);
    } else {
      // Redirect to message purchase page
      navigate('/message-purchase');
    }
  };

  const handlePaidMessageSent = async (message: string): Promise<boolean> => {
    // Here you would implement the actual message sending logic
    // For now, we'll simulate success
    console.log('Sending paid message:', message, 'to profile:', id);
    
    // In a real implementation, you would:
    // 1. Create or find a conversation
    // 2. Send the message via your messaging system
    // 3. Mark it as a premium message
    
    return true;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink"></div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Profile Not Found</h2>
              <p>Sorry, the profile you are looking for could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                {profile.full_name}
              </CardTitle>
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.photos?.[0] || '/placeholder.svg'} alt={profile.full_name} />
                  <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardDescription>
                    {profile.bio || 'No bio available'}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {profile.location || 'Unknown location'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <PremiumFeatures />

          <Separator />

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-sm mx-auto flex gap-3">
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {hasItem('messages', 1) ? 'Send Premium Message' : 'Buy Messages'}
              </Button>
              <Button variant="outline" className="flex-1 border-gray-300">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
            </div>
          </div>

          {/* Add the PaidMessageDialog */}
          <PaidMessageDialog
            open={showPaidMessageDialog}
            onClose={() => setShowPaidMessageDialog(false)}
            recipientName={profile?.full_name || 'User'}
            recipientPhoto={profile?.photos?.[0] || '/placeholder.svg'}
            onSendMessage={handlePaidMessageSent}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfileDetail;
