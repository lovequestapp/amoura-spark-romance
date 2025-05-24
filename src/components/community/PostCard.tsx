import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, MoreVertical, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Post } from '@/types/community';
import { likePost, unlikePost, deletePost } from '@/services/community';
import { likeProfile, checkProfileLiked } from '@/services/profileLikes';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from '@tanstack/react-query';

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
  const [profileLiked, setProfileLiked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if ('isLiked' in post) {
      setLiked(!!post.isLiked);
    }
  }, [post]);

  useEffect(() => {
    const checkProfileLikeStatus = async () => {
      if (user && post.author.id !== user.id) {
        try {
          const isLiked = await checkProfileLiked(post.author.id);
          setProfileLiked(isLiked);
        } catch (error) {
          console.error("Error checking profile like status:", error);
        }
      }
    };

    checkProfileLikeStatus();
  }, [user, post.author.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  const handleProfileLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like profiles",
        variant: "destructive"
      });
      return;
    }

    if (post.author.id === user.id) {
      toast({
        title: "Cannot like your own profile",
        description: "You cannot like your own profile",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newLikeStatus = await likeProfile(post.author.id);
      setProfileLiked(newLikeStatus);
      
      toast({
        title: newLikeStatus ? "Profile liked!" : "Profile unliked",
        description: newLikeStatus 
          ? `You liked ${post.author.name}'s profile` 
          : `You unliked ${post.author.name}'s profile`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deletePost(post.id);
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={getImageSrc(post.author.avatar)}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
          
          {/* Profile like button - only show if not user's own post */}
          {user && post.author.id !== user.id && (
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${profileLiked ? 'text-amoura-deep-pink' : 'text-muted-foreground'}`}
              onClick={handleProfileLike}
              title={profileLiked ? `Unlike ${post.author.name}'s profile` : `Like ${post.author.name}'s profile`}
            >
              <motion.div whileTap={{ scale: 1.2 }}>
                <User 
                  size={16} 
                  className={profileLiked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""}
                />
              </motion.div>
            </Button>
          )}
          
          {post.isUserPost && (
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline">Your Post</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        <p className="mb-3 line-clamp-3">{post.content}</p>
        
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
