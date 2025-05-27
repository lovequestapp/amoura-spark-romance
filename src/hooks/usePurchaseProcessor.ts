
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  messages?: number;
  quantity: number;
  category: string;
  features: string[];
}

export const usePurchaseProcessor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processPurchase = async (items: PurchaseItem[]): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);

    try {
      // Process each item in the cart
      for (const item of items) {
        let itemType = 'messages'; // Default to messages
        let quantity = item.messages || item.quantity;

        // Determine item type based on category and name
        if (item.category === 'communication' || item.name.toLowerCase().includes('message')) {
          itemType = 'messages';
          quantity = item.messages || item.quantity;
        } else if (item.name.toLowerCase().includes('super like')) {
          itemType = 'super_likes';
        } else if (item.name.toLowerCase().includes('boost')) {
          itemType = 'boosts';
        } else if (item.name.toLowerCase().includes('rewind')) {
          itemType = 'rewinds';
        }

        // Call the process_purchase function
        const { data, error } = await supabase.rpc('process_purchase', {
          user_id_param: user.id,
          product_name_param: item.name,
          product_category_param: item.category,
          item_type_param: itemType,
          quantity_param: quantity,
          price_cents_param: item.priceValue,
          stripe_session_id_param: null // For demo purposes
        });

        if (error) {
          console.error('Error processing purchase:', error);
          throw error;
        }

        console.log('Purchase processed:', data);
      }

      toast({
        title: "Purchase Successful!",
        description: "Your items have been added to your inventory.",
      });

      // Clear cart after successful purchase
      localStorage.removeItem('cart');

      return true;
    } catch (error) {
      console.error('Purchase processing error:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPurchase,
    isProcessing
  };
};
