
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommunityFeed from '@/components/community/CommunityFeed';
import CreatePostForm from '@/components/community/CreatePostForm';
import CommunityTabs from '@/components/community/CommunityTabs';
import CommunityTrending from '@/components/community/CommunityTrending';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const Community = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'trending' | 'following'>('latest');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleTabChange = (tab: 'latest' | 'trending' | 'following') => {
    setActiveTab(tab);
  };

  const handleCreatePostSuccess = () => {
    setShowCreatePost(false);
    toast({
      title: "Post created",
      description: "Your post has been published to the community!",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-2 md:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Community</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-amoura-deep-pink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amoura-deep-pink/90 transition-colors"
            >
              Create Post
            </button>
          </div>

          <CommunityTabs activeTab={activeTab} onChange={handleTabChange} />
          
          <div className="md:flex gap-6">
            <div className="flex-grow">
              <CommunityFeed activeTab={activeTab} />
            </div>
            
            {isMobile ? null : (
              <div className="hidden md:block w-72 shrink-0">
                <div className="sticky top-4">
                  <CommunityTrending />
                </div>
              </div>
            )}
          </div>
        </div>

        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg p-4 max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CreatePostForm onSuccess={handleCreatePostSuccess} onCancel={() => setShowCreatePost(false)} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Community;
