
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import DateIdea from '@/components/profile/DateIdea';
import MatchCard from '@/components/matches/MatchCard';
import LikeCard from '@/components/matches/LikeCard';
import { useMatches } from '@/hooks/useMatches';
import { useLikes } from '@/hooks/useLikes';

const Matches = () => {
  const navigate = useNavigate();
  const { matches, loading: matchesLoading } = useMatches();
  const { likes, loading: likesLoading } = useLikes();
  
  const handleMatchClick = (matchUserId: string) => {
    navigate(`/messages/${matchUserId}`);
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
            {matchesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amoura-deep-pink" />
                <span className="ml-2 text-gray-600">Loading matches...</span>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => handleMatchClick(match.user_id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">💖</div>
                <p className="text-gray-500 mb-2">No matches yet. Keep swiping!</p>
                <Button 
                  onClick={() => navigate('/home')} 
                  className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
                >
                  Discover matches now
                </Button>
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
            
            {likesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amoura-deep-pink" />
                <span className="ml-2 text-gray-600">Loading likes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {likes.map((like, index) => (
                  <LikeCard key={like.id} like={like} index={index} />
                ))}
                
                {/* Blurred placeholder cards for premium upsell */}
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Matches;
