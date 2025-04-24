
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import DateIdea from '@/components/profile/DateIdea';

const matches = [
  {
    id: 1,
    name: "Emma",
    photo: "/assets/profile-1a.jpg",
    matchTime: "Just now",
    lastMessage: null,
    online: true
  },
  {
    id: 2,
    name: "Alex",
    photo: "/assets/profile-2a.jpg",
    matchTime: "2 hours ago",
    lastMessage: "Hey there! I noticed we both love hiking. Any favorite trails?",
    online: true
  },
  {
    id: 3,
    name: "Sofia",
    photo: "/assets/profile-3a.jpg",
    matchTime: "1 day ago",
    lastMessage: "Thanks for the recommendation! I'll check out that restaurant this weekend.",
    online: false
  }
];

const likes = [
  {
    id: 4,
    name: "James",
    photo: "https://source.unsplash.com/photo-1618160702438-9b02ab6515c9",
    time: "3 hours ago"
  },
  {
    id: 5,
    name: "Mia",
    photo: "https://source.unsplash.com/photo-1582562124811-c09040d0a901",
    time: "1 day ago"
  }
];

const Matches = () => {
  const navigate = useNavigate();
  
  const handleMatchClick = (matchId: number) => {
    navigate(`/messages/${matchId}`);
  };
  
  return (
    <AppLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Your Connections</h1>
        <p className="text-gray-500 mb-4">Find your matches and conversations here</p>
        
        <DateIdea />
        
        <Tabs defaultValue="matches">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="matches" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
              Matches
              {matches.length > 0 && (
                <Badge className="ml-2 bg-amoura-gold text-black">{matches.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="likes" className="data-[state=active]:bg-amoura-deep-pink data-[state=active]:text-white">
              Likes
              {likes.length > 0 && (
                <Badge className="ml-2 bg-amoura-gold text-black">{likes.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="matches" className="animate-fade-in">
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <motion.div 
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleMatchClick(match.id)}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className="relative mr-4">
                      <img 
                        src={match.photo} 
                        alt={match.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className={`absolute bottom-0 right-0 h-3 w-3 ${match.online ? 'bg-green-500' : 'bg-gray-300'} rounded-full border-2 border-white`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{match.name}</h3>
                        <span className="text-xs text-gray-500">{match.matchTime}</span>
                      </div>
                      
                      {match.lastMessage ? (
                        <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                      ) : (
                        <p className="text-sm text-amoura-deep-pink font-medium">New match! Say hello</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">💖</div>
                <p className="text-gray-500 mb-2">No matches yet. Keep swiping!</p>
                <button onClick={() => navigate('/home')} className="text-sm text-amoura-deep-pink font-medium">
                  Discover matches now
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="likes" className="animate-fade-in">
            <div className="bg-amoura-soft-pink/30 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amoura-gold flex items-center justify-center mr-4 shadow-sm">
                  <span className="text-white">✦</span>
                </div>
                <div>
                  <h3 className="font-medium">See who likes you</h3>
                  <p className="text-sm text-gray-600">Upgrade to Premium to see all your likes</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {likes.map((like) => (
                <motion.div 
                  key={like.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <img 
                    src={like.photo} 
                    alt={like.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-medium">{like.name}</h3>
                    <p className="text-xs opacity-80">{like.time}</p>
                  </div>
                </motion.div>
              ))}
              
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={`blur-${i}`} 
                  className="rounded-xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center shadow-sm"
                >
                  <div className="text-gray-400 flex flex-col items-center">
                    <span className="block text-3xl mb-1">👤</span>
                    <span className="text-xs">Unlock likes</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Matches;
