
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommunityFeed, { Post } from '@/components/community/CommunityFeed';
import CreatePostForm from '@/components/community/CreatePostForm';
import CommunityTabs from '@/components/community/CommunityTabs';
import CommunityTrending from '@/components/community/CommunityTrending';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

// Sample posts database
const sampleAllPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Party Planner Pro',
      avatar: '/photo-1649972904349-6e44c42644a7',
    },
    content: "Just hosted the most epic singles mixer event! The energy was incredible and we saw so many connections being made. Here are my top tips for organizing a successful social gathering:\n\n1. Choose a unique venue\n2. Create interactive activities\n3. Have great music\n4. Plan ice-breaker games\n\nSwipe to see the amazing moments we captured!",
    image: '/lovable-uploads/a587d90b-bc43-4d5f-8a28-253bf2ef3eba.png',
    tags: ['singles', 'events', 'networking', 'dating'],
    likes: 156,
    comments: 47,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: {
      name: 'Adventure Seeker',
      avatar: '/photo-1581092795360-fd1ca04f0952',
    },
    content: "Just returned from an incredible hiking date in the mountains! If you're looking for a unique date idea that combines adventure and romance, this is it. The views were breathtaking and it's a perfect way to have meaningful conversations while staying active.\n\nPro tip: Pack a surprise picnic for the summit - it's the perfect romantic gesture!",
    image: '/lovable-uploads/dec017df-5117-4384-b5ee-21f5a6ca0e9b.png',
    tags: ['outdoors', 'dating', 'adventure', 'hiking'],
    likes: 89,
    comments: 23,
    timestamp: '6 hours ago'
  },
  {
    id: '3',
    author: {
      name: 'Sophia Rodriguez',
      avatar: '/photo-1581091226825-a6a2a5aee158',
    },
    content: 'Looking for advice: how soon is too soon to introduce someone you\'re dating to your family? We\'ve been seeing each other for about 3 months now.\n\nI really like them and things are going well, but I\'m worried about timing. Would love to hear others\' experiences!',
    tags: ['advice', 'dating', 'family'],
    likes: 28,
    comments: 35,
    timestamp: '1 day ago'
  },
  {
    id: '4',
    author: {
      name: 'James Thompson',
      avatar: '/photo-1721322800607-8c38375eef04',
    },
    content: 'Communication is key! Had a breakthrough conversation with my partner last night about our future goals. Sometimes just sitting down and talking openly makes all the difference.\n\nHere\'s what helped us have a productive discussion:\n- Set aside dedicated time\n- No phones or distractions\n- Use "I feel" statements\n- Listen actively\n- Take breaks if needed',
    image: '/photo-1519389950473-47ba0277781c',
    tags: ['communication', 'relationships', 'growth'],
    likes: 89,
    comments: 16,
    timestamp: '2 days ago'
  },
  {
    id: '5',
    author: {
      name: 'Dating Coach',
      avatar: '/photo-1528892952291-009c663ce843',
    },
    content: 'NEW VIDEO: "5 First Date Conversation Starters That Actually Work"\n\nTired of awkward silences? Watch my latest video where I break down proven conversation techniques that create genuine connections.\n\nRemember: The goal isn\'t to impress them with your achievements, but to create a comfortable space where you both can be yourselves!',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    tags: ['dating', 'advice', 'conversation', 'first-date'],
    likes: 134,
    comments: 42,
    timestamp: '3 days ago'
  },
  {
    id: '6',
    author: {
      name: 'Relationship Therapist',
      avatar: '/photo-1607746882042-944635dfe10e',
    },
    content: 'Vulnerability isn\'t weakness - it\'s courage.\n\nI\'ve noticed many clients struggle with opening up emotionally. Yet the relationships that thrive are those where both partners create safe spaces for vulnerability.\n\nWhat\'s one small way you can practice being more vulnerable with your partner today?',
    tags: ['vulnerability', 'relationships', 'therapy', 'growth'],
    likes: 211,
    comments: 67,
    timestamp: '4 days ago'
  }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'trending' | 'my-feed'>('latest');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // State for managing posts
  const [allPosts, setAllPosts] = useState<Post[]>(sampleAllPosts);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  
  const handleTabChange = (tab: 'latest' | 'trending' | 'my-feed') => {
    setActiveTab(tab);
  };
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    // If a tag is selected, automatically switch to latest tab to show all matching posts
    if (tag && activeTab !== 'latest') {
      setActiveTab('latest');
    }
  };

  const handleCreatePostSuccess = (newPost: Post) => {
    setShowCreatePost(false);
    // Add the new post to both all posts and user posts
    setAllPosts([newPost, ...allPosts]);
    setUserPosts([newPost, ...userPosts]);
    
    toast({
      title: "Post created",
      description: "Your post has been published to the community!",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
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
          
          {isMobile ? null : (
            <div className="hidden md:block sticky top-4">
              <CommunityTrending onTagSelect={handleTagSelect} />
            </div>
          )}

          <div className="md:flex gap-6">
            <div className="flex-grow">
              <CommunityFeed 
                activeTab={activeTab} 
                onTagSelect={handleTagSelect}
                selectedTag={selectedTag}
                userPosts={userPosts}
                allPosts={allPosts}
              />
            </div>
            
            {isMobile ? null : (
              <div className="hidden md:block w-72">
                <div className="sticky top-4">
                  <CommunityTrending onTagSelect={handleTagSelect} />
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
