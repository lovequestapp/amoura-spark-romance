
import React, { useState } from 'react';
import { X, Heart, MessageCircle, Share, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

interface PostDetailProps {
  post: Post;
  onClose: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
      
      // Heart animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      document.body.appendChild(heart);
      setTimeout(() => document.body.removeChild(heart), 1000);
    }
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment functionality coming soon!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Post shared",
      description: "Link copied to clipboard!",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You unfollowed ${post.author.name}` : `You are now following ${post.author.name}!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={`https://source.unsplash.com${post.author.avatar}`} 
                alt={post.author.name} 
              />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{post.author.name}</h3>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          
          <Button 
            variant={isFollowing ? "default" : "outline"} 
            size="sm" 
            onClick={handleFollow}
            className={isFollowing ? "bg-amoura-deep-pink hover:bg-amoura-deep-pink/90" : ""}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
            <X size={18} />
          </Button>
        </div>
        
        <div className="p-4">
          {/* Post content */}
          <p className="mb-4 text-lg whitespace-pre-line">{post.content}</p>
          
          {/* Post image */}
          {post.image && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img 
                src={`https://source.unsplash.com${post.image}`} 
                alt="Post" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-sm">
                #{tag}
              </Badge>
            ))}
          </div>
          
          {/* Engagement stats */}
          <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-t">
            <div>
              {likeCount} likes
            </div>
            <div>
              {post.comments} comments
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ${liked ? 'text-amoura-deep-pink' : ''}`}
              onClick={handleLike}
            >
              <motion.div whileTap={{ scale: 1.4 }}>
                <Heart className={liked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""} size={20} />
              </motion.div>
              Like
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleComment}>
              <MessageCircle size={20} />
              Comment
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
              <Share size={20} />
              Share
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetail;
