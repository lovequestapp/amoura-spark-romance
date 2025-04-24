
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const matches = [
  {
    id: 1,
    name: "Emma",
    photo: "/assets/profile-1a.jpg",
    matchTime: "Just now",
    lastMessage: null
  },
  {
    id: 2,
    name: "Alex",
    photo: "/assets/profile-2a.jpg",
    matchTime: "2 hours ago",
    lastMessage: "Hey there! I noticed we both love hiking. Any favorite trails?"
  },
  {
    id: 3,
    name: "Sofia",
    photo: "/assets/profile-3a.jpg",
    matchTime: "1 day ago",
    lastMessage: "Thanks for the recommendation! I'll check out that restaurant this weekend."
  }
];

const likes = [
  {
    id: 4,
    name: "James",
    photo: "/assets/like-1.jpg",
    time: "3 hours ago"
  },
  {
    id: 5,
    name: "Mia",
    photo: "/assets/like-2.jpg",
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
        <h1 className="text-2xl font-bold mb-6">Your Connections</h1>
        
        <Tabs defaultValue="matches">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matches" className="animate-fade-in">
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="relative mr-4">
                      <img 
                        src={match.photo} 
                        alt={match.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{match.name}</h3>
                        <span className="text-xs text-gray-500">{match.matchTime}</span>
                      </div>
                      
                      {match.lastMessage ? (
                        <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                      ) : (
                        <p className="text-sm text-amoura-deep-pink">New match! Say hello</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No matches yet. Keep swiping!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="likes" className="animate-fade-in">
            <div className="bg-amoura-soft-pink/30 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amoura-gold flex items-center justify-center mr-4">
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
                <div key={like.id} className="relative rounded-xl overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-black/50" />
                  <img 
                    src={like.photo} 
                    alt={like.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-medium">{like.name}</h3>
                    <p className="text-xs opacity-80">{like.time}</p>
                  </div>
                </div>
              ))}
              
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`blur-${i}`} className="rounded-xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
                  <div className="text-gray-400">
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
