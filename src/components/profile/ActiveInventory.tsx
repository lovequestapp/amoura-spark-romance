
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, Zap, Heart, MessageSquare, Eye, Infinity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity?: number;
  expires_at?: string;
  is_active: boolean;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  usage?: number;
  max_usage?: number;
}

const ActiveInventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          products (
            name,
            category,
            features
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const inventoryItems: InventoryItem[] = (data || []).map(purchase => {
        const iconMap: { [key: string]: React.ComponentType<any> } = {
          'profile': Zap,
          'communication': MessageSquare,
          'matching': Heart,
          'analytics': Eye,
          'special': Package
        };

        const colorMap: { [key: string]: string } = {
          'profile': 'from-yellow-400 to-orange-500',
          'communication': 'from-blue-400 to-blue-600',
          'matching': 'from-pink-400 to-rose-600',
          'analytics': 'from-purple-400 to-purple-600',
          'special': 'from-green-400 to-emerald-600'
        };

        return {
          id: purchase.id,
          name: purchase.products.name,
          category: purchase.products.category,
          quantity: purchase.quantity,
          expires_at: purchase.expires_at,
          is_active: purchase.is_active,
          features: purchase.products.features,
          icon: iconMap[purchase.products.category] || Package,
          color: colorMap[purchase.products.category] || 'from-gray-400 to-gray-600',
          usage: Math.floor(Math.random() * 5), // Mock usage data
          max_usage: purchase.products.name.includes('Messages') ? 5 : 
                    purchase.products.name.includes('Likes') ? 50 : undefined
        };
      });

      setInventory(inventoryItems);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load your inventory.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getUsageProgress = (usage?: number, maxUsage?: number) => {
    if (!usage || !maxUsage) return undefined;
    return (usage / maxUsage) * 100;
  };

  if (loading) {
    return (
      <Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Active Inventory
          </CardTitle>
          <CardDescription>Your purchased add-ons and premium features</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No active items</h3>
          <p className="text-gray-600 mb-4">Purchase premium add-ons to enhance your dating experience!</p>
          <Button 
            onClick={() => window.location.href = '/add-ons'}
            className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
          >
            Browse Add-ons
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Active Inventory</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          {inventory.length} active item{inventory.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const IconComponent = item.icon;
          const usageProgress = getUsageProgress(item.usage, item.max_usage);
          
          return (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className={`h-2 bg-gradient-to-r ${item.color}`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {item.quantity && item.quantity > 1 && (
                    <Badge className="bg-gray-100 text-gray-700">
                      {item.quantity}x
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {item.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {item.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.features.length - 2} more
                    </Badge>
                  )}
                </div>
                
                {/* Usage Progress */}
                {usageProgress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usage</span>
                      <span className="font-medium">{item.usage}/{item.max_usage}</span>
                    </div>
                    <Progress value={usageProgress} className="h-2" />
                  </div>
                )}
                
                {/* Expiry */}
                {item.expires_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {getTimeRemaining(item.expires_at)} remaining
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
    </div>
  );
};

export default ActiveInventory;
