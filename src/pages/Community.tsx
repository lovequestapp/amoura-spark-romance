
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommunityFeed from '@/components/community/CommunityFeed';
import CreatePostForm from '@/components/community/CreatePostForm';
import CommunityTabs from '@/components/community/CommunityTabs';
import CommunityTrending from '@/components/community/CommunityTrending';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types/community';
import { 
  fetchPosts, 
  fetchTrendingPosts, 
  fetchUserPosts, 
  fetchPostsByTag,
  createPost
} from '@/services/community';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Community = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'trending' | 'my-feed'>('latest');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for fetching posts with improved error handling
  const { data: allPosts = [], isLoading: loadingAllPosts, error: allPostsError } = useQuery({
    queryKey: ['posts', selectedTag],
    queryFn: async () => {
      console.log("Fetching posts, selected tag:", selectedTag);
      try {
        if (selectedTag) {
          const posts = await fetchPostsByTag(selectedTag, user?.id);
          console.log("Fetched posts by tag:", posts);
          return posts;
        }
        const posts = await fetchPosts(user?.id);
        console.log("Fetched all posts:", posts);
        return posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Query for trending posts with improved error handling
  const { data: trendingPosts = [], isLoading: loadingTrendingPosts, error: trendingPostsError } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      console.log("Fetching trending posts");
      try {
        const posts = await fetchTrendingPosts(user?.id);
        console.log("Fetched trending posts:", posts);
        return posts;
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Query for user posts with improved error handling
  const { data: userPosts = [], isLoading: loadingUserPosts, error: userPostsError } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      console.log("Fetching user posts, user id:", user?.id);
      try {
        if (user?.id) {
          const posts = await fetchUserPosts(user?.id);
          console.log("Fetched user posts:", posts);
          return posts;
        }
        return [];
      } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user
  });
  
  // Handle errors from queries
  useEffect(() => {
    if (allPostsError) {
      toast({
        title: "Error loading posts",
        description: "Please try again later",
        variant: "destructive"
      });
    }
    if (trendingPostsError) {
      toast({
        title: "Error loading trending posts",
        description: "Please try again later",
        variant: "destructive"
      });
    }
    if (userPostsError && user) {
      toast({
        title: "Error loading your posts",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [allPostsError, trendingPostsError, userPostsError, toast, user]);
  
  const handleTabChange = (tab: 'latest' | 'trending' | 'my-feed') => {
    setActiveTab(tab);
    // Clear tag selection when changing tabs
    if (selectedTag) {
      setSelectedTag('');
    }
  };
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    // If a tag is selected, automatically switch to latest tab to show all matching posts
    if (tag && activeTab !== 'latest') {
      setActiveTab('latest');
    }
  };

  const handleCreatePostSuccess = async (content: string, tags: string[], imageFile?: File | null) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }
    
    setShowCreatePost(false);
    
    try {
      const newPost = await createPost(content, tags, imageFile);
      
      if (newPost) {
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user-posts'] });
        queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
        
        toast({
          title: "Post created",
          description: "Your post has been published to the community!",
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Debug logs
  useEffect(() => {
    console.log("Current tab:", activeTab);
    console.log("Selected tag:", selectedTag);
    console.log("User logged in:", !!user);
    console.log("User ID:", user?.id);
    console.log("All posts count:", allPosts?.length);
    console.log("Trending posts count:", trendingPosts?.length);
    console.log("User posts count:", userPosts?.length);
    console.log("Loading states:", { loadingAllPosts, loadingTrendingPosts, loadingUserPosts });
  }, [activeTab, selectedTag, allPosts, trendingPosts, userPosts, loadingAllPosts, 
      loadingTrendingPosts, loadingUserPosts, user]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Community</h1>
            <button
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Authentication required",
                    description: "Please sign in to create posts",
                    variant: "destructive"
                  });
                  return;
                }
                setShowCreatePost(true);
              }}
              className="bg-amoura-deep-pink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amoura-deep-pink/90 transition-colors"
            >
              Create Post
            </button>
          </div>

          <CommunityTabs activeTab={activeTab} onChange={handleTabChange} />
          
          <div className="md:flex gap-6">
            <div className="flex-grow">
              <CommunityFeed 
                activeTab={activeTab} 
                onTagSelect={handleTagSelect}
                selectedTag={selectedTag}
                userPosts={userPosts}
                allPosts={activeTab === 'trending' ? trendingPosts : allPosts}
                isLoading={activeTab === 'trending' ? loadingTrendingPosts : activeTab === 'my-feed' ? loadingUserPosts : loadingAllPosts}
              />
            </div>
            
            <div className="hidden md:block w-72 sticky top-4">
              <CommunityTrending onTagSelect={handleTagSelect} />
            </div>
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
              <CreatePostForm 
                onSuccess={handleCreatePostSuccess} 
                onCancel={() => setShowCreatePost(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Community;
