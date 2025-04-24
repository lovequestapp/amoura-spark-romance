
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Send, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface Author {
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
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
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, isOpen, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
    }
  }, [post]);

  if (!post) return null;

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      
      // Show heart animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      document.body.appendChild(heart);
      setTimeout(() => document.body.removeChild(heart), 1000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Math.random().toString(),
      author: {
        name: "Current User",
        avatar: "/photo-1581091226825-a6a2a5aee158",
      },
      content: newComment,
      timestamp: "Just now"
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the discussion",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={onClose}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img 
              src={`https://source.unsplash.com${post.author.avatar}`}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {/* Post content */}
          <p className="text-lg whitespace-pre-line">{post.content}</p>
          
          {/* Image with better presentation */}
          {post.image && (
            <Card className="overflow-hidden rounded-lg border">
              <img 
                src={`https://source.unsplash.com${post.image}`}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </Card>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
          
          {/* Interaction buttons */}
          <div className="flex items-center gap-4 py-4 border-t border-b">
            <Button 
              variant="ghost" 
              className={`gap-2 ${liked ? 'text-amoura-deep-pink' : ''}`}
              onClick={handleLike}
            >
              <motion.div whileTap={{ scale: 1.4 }}>
                <Heart className={liked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""} />
              </motion.div>
              {likeCount}
            </Button>
            
            <Button variant="ghost" className="gap-2">
              <MessageCircle />
              {comments.length}
            </Button>
            
            <Button variant="ghost" onClick={handleShare}>
              <Share />
            </Button>
          </div>
          
          {/* Comment section */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow resize-none"
              />
              <Button onClick={handleComment} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={`https://source.unsplash.com${comment.author.avatar}`}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{comment.author.name}</h4>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
