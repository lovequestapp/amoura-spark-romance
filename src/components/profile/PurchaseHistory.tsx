
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Purchase {
  id: string;
  product_id: string;
  quantity: number;
  total_price_cents: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  products: {
    name: string;
    description: string;
    category: string;
    features: string[];
  };
}

const PurchaseHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          products (
            name,
            description,
            category,
            features
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (purchase: Purchase) => {
    if (!purchase.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (purchase.expires_at && isExpired(purchase.expires_at)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (purchase.expires_at) {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    }
    return <Badge variant="default" className="bg-blue-500">Permanent</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amoura-deep-pink"></div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-4">Start exploring our premium add-ons to enhance your experience!</p>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Purchase History</h3>
        <Button variant="outline" size="sm" onClick={fetchPurchases}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {purchases.map((purchase) => (
        <Card key={purchase.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{purchase.products.name}</CardTitle>
                <CardDescription>{purchase.products.description}</CardDescription>
              </div>
              {getStatusBadge(purchase)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Purchased: {formatDate(purchase.created_at)}</span>
              </div>
              {purchase.expires_at && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Expires: {formatDate(purchase.expires_at)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span>Quantity: {purchase.quantity}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-lg font-semibold text-amoura-deep-pink">
                ${(purchase.total_price_cents / 100).toFixed(2)}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {purchase.products.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchaseHistory;
