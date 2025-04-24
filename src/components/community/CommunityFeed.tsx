
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

// Enhanced post type with additional fields
export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isUserPost?: boolean;
}

interface CommunityFeedProps {
  activeTab: 'latest' | 'trending' | 'my-feed';
  onTagSelect?: (tag: string) => void;
  selectedTag?: string;
  userPosts: Post[];
  allPosts: Post[];
}

// Sort options
type SortOption = 'newest' | 'oldest' | 'most-liked' | 'most-commented';

const CommunityFeed: React.FC<CommunityFeedProps> = ({ 
  activeTab, 
  onTagSelect, 
  selectedTag,
  userPosts,
  allPosts 
}) => {
  const isMobile = useIsMobile();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Filter and sort posts based on activeTab, selectedTag, and sortBy
    let filteredPosts: Post[] = [];
    
    switch(activeTab) {
      case 'trending':
        filteredPosts = [...allPosts].filter(post => post.likes > 30);
        break;
      case 'my-feed':
        filteredPosts = [...userPosts];
        break;
      default: // latest
        filteredPosts = [...allPosts];
        break;
    }
    
    // Apply tag filtering if a tag is selected
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.includes(selectedTag)
      );
    }
    
    // Apply sorting
    filteredPosts = sortPosts(filteredPosts, sortBy);
    
    setDisplayPosts(filteredPosts);
  }, [activeTab, selectedTag, sortBy, userPosts, allPosts]);
  
  // Function to sort posts based on selected sort option
  const sortPosts = (posts: Post[], sortOption: SortOption): Post[] => {
    const sortedPosts = [...posts];
    
    switch(sortOption) {
      case 'newest':
        return sortedPosts.sort((a, b) => {
          // Converting timestamp strings to comparable values
          // Assuming timestamps are in format like "2 hours ago", "1 day ago"
          const aTime = getTimestampValue(a.timestamp);
          const bTime = getTimestampValue(b.timestamp);
          return bTime - aTime;
        });
      case 'oldest':
        return sortedPosts.sort((a, b) => {
          const aTime = getTimestampValue(a.timestamp);
          const bTime = getTimestampValue(b.timestamp);
          return aTime - bTime;
        });
      case 'most-liked':
        return sortedPosts.sort((a, b) => b.likes - a.likes);
      case 'most-commented':
        return sortedPosts.sort((a, b) => b.comments - a.comments);
      default:
        return sortedPosts;
    }
  };
  
  // Helper function to convert timestamp strings to comparable values
  const getTimestampValue = (timestamp: string): number => {
    if (timestamp.includes('just now')) return Date.now();
    if (timestamp.includes('minute')) {
      const minutes = parseInt(timestamp.split(' ')[0]) || 1;
      return Date.now() - minutes * 60 * 1000;
    }
    if (timestamp.includes('hour')) {
      const hours = parseInt(timestamp.split(' ')[0]) || 1;
      return Date.now() - hours * 60 * 60 * 1000;
    }
    if (timestamp.includes('day')) {
      const days = parseInt(timestamp.split(' ')[0]) || 1;
      return Date.now() - days * 24 * 60 * 60 * 1000;
    }
    return 0;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {selectedTag ? (
          <div className="flex items-center gap-2">
            <Badge className="bg-amoura-deep-pink text-white py-1 px-3">
              #{selectedTag}
              <button 
                onClick={() => onTagSelect && onTagSelect('')} 
                className="ml-2 hover:text-opacity-80"
                aria-label="Remove tag filter"
              >
                <X size={14} />
              </button>
            </Badge>
            <span className="text-sm text-muted-foreground">
              Showing posts with #{selectedTag}
            </span>
          </div>
        ) : (
          <div className="h-8"></div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <Select 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="most-commented">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {displayPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts to display</p>
          {selectedTag && (
            <button 
              onClick={() => onTagSelect && onTagSelect('')}
              className="mt-2 text-amoura-deep-pink hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setSelectedPost(post)}
          >
            <PostCard 
              post={post} 
              isMobile={isMobile} 
              onTagClick={(tag) => onTagSelect && onTagSelect(tag)}
            />
          </motion.div>
        ))
      )}
      
      <PostDetail 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onTagClick={(tag) => onTagSelect && onTagSelect(tag)}
      />
    </div>
  );
};

export default CommunityFeed;
