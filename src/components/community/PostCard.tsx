
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Post } from '@/types/community';
import { likePost, unlikePost } from '@/services/community';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
  isMobile: boolean;
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, isMobile, onTagClick, selectedTag }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();
  
  // Initialize the liked state based on if the user has liked this post
  useEffect(() => {
    if ('isLiked' in post) {
      setLiked(!!post.isLiked);
    }
  }, [post]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the post detail
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (liked) {
        const newLikeCount = await unlikePost(post.id);
        setLiked(false);
        setLikeCount(newLikeCount);
      } else {
        const newLikeCount = await likePost(post.id);
        setLiked(true);
        setLikeCount(newLikeCount);
        
        // Show heart animation
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        setTimeout(() => document.body.removeChild(heart), 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a URL with the post ID
    const postUrl = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Opening the full post will naturally focus on the comment section
  };
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  // Function to determine the correct image source
  const getImageSrc = (path?: string) => {
    if (!path) return '';
    
    if (path.startsWith('/lovable-uploads/') || path.startsWith('https://')) {
      return path;
    } else {
      return `https://source.unsplash.com${path}`;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={getImageSrc(post.author.avatar)}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
          {post.isUserPost && (
            <Badge variant="outline" className="ml-auto">Your Post</Badge>
          )}
        </div>
        
        {/* Post content - truncated in card view */}
        <p className="mb-3 line-clamp-3">{post.content}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className={`text-xs cursor-pointer hover:bg-muted transition-colors ${tag === selectedTag ? 'bg-amoura-soft-pink text-amoura-deep-pink' : ''}`}
              onClick={(e) => handleTagClick(e, tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* Image preview */}
        {post.image && (
          <div className="mb-3 rounded-md overflow-hidden">
            <img 
              src={post.image}
              alt="Post content"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 border-t flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${liked ? 'text-amoura-deep-pink' : ''}`}
          onClick={handleLike}
        >
          <motion.div whileTap={{ scale: 1.4 }}>
            <Heart 
              size={isMobile ? 18 : 16} 
              className={liked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""}
            />
          </motion.div>
          {likeCount}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2" 
          onClick={handleComment}
        >
          <MessageCircle size={isMobile ? 18 : 16} />
          {post.comments}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
        >
          <Share size={isMobile ? 18 : 16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
