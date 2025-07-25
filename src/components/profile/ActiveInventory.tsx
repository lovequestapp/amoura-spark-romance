
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, Zap, Heart, MessageSquare, Eye, Infinity, ShoppingCart } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useNavigate } from 'react-router-dom';

const ActiveInventory = () => {
  const { inventory, loading, refetchInventory } = useInventory();
  const navigate = useNavigate();

  // Refresh inventory when component mounts
  React.useEffect(() => {
    refetchInventory();
  }, [refetchInventory]);

  const getIconForItemType = (itemType: string) => {
    switch (itemType) {
      case 'messages': return MessageSquare;
      case 'super_likes': return Heart;
      case 'rewinds': return Zap;
      case 'boosts': return Eye;
      default: return Package;
    }
  };

  const getColorForItemType = (itemType: string) => {
    switch (itemType) {
      case 'messages': return 'from-blue-400 to-blue-600';
      case 'super_likes': return 'from-pink-400 to-rose-600';
      case 'rewinds': return 'from-green-400 to-emerald-600';
      case 'boosts': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDisplayName = (itemType: string) => {
    switch (itemType) {
      case 'messages': return 'Premium Messages';
      case 'super_likes': return 'Super Likes';
      case 'rewinds': return 'Rewinds';
      case 'boosts': return 'Profile Boosts';
      default: return itemType;
    }
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2">
              <Package className="w-5 h-5 text-white" />
            </div>
            Active Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amoura-deep-pink"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (inventory.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2">
              <Package className="w-5 h-5 text-white" />
            </div>
            Active Inventory
          </CardTitle>
          <CardDescription>Your purchased add-ons and premium features</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-12">
          <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No active items</h3>
          <p className="text-gray-600 mb-6 text-lg">Purchase premium add-ons to enhance your dating experience!</p>
          <Button 
            onClick={() => navigate('/add-ons')}
            className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 px-8 py-3 text-lg font-medium"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Browse Add-ons
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2">
              <Package className="w-5 h-5 text-white" />
            </div>
            Active Inventory
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1">
            {inventory.length} active item{inventory.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <CardDescription>Your purchased add-ons and premium features</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => {
            const IconComponent = getIconForItemType(item.item_type);
            const colorClass = getColorForItemType(item.item_type);
            const displayName = getDisplayName(item.item_type);
            const timeRemaining = getTimeRemaining(item.expires_at);
            
            return (
              <Card key={item.item_type} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50">
                <div className={`h-3 bg-gradient-to-r ${colorClass}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg leading-tight">{displayName}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.item_type}
                        </Badge>
                      </div>
                    </div>
                    
                    <Badge className="bg-gray-100 text-gray-700 text-lg font-bold px-3 py-1">
                      {item.quantity}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available</span>
                      <span className="font-medium">{item.quantity} remaining</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (item.quantity / Math.max(item.quantity, 10)) * 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Expiry */}
                  {timeRemaining && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {timeRemaining} remaining
                      </span>
                    </div>
                  )}
                  
                  {!item.expires_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Infinity className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Permanent</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/add-ons')}
              variant="outline"
              className="flex-1 border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse More Add-ons
            </Button>
            <Button 
              onClick={() => navigate('/message-purchase')}
              className="flex-1 bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 font-medium"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Buy Messages
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveInventory;
