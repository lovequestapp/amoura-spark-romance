
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
  item_type: string;
  quantity: number;
  expires_at?: string;
}

export const useInventory = () => {
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
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_inventory', {
        user_id_param: user.id
      });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const hasItem = (itemType: string, minQuantity: number = 1): boolean => {
    const item = inventory.find(inv => inv.item_type === itemType);
    return item ? item.quantity >= minQuantity : false;
  };

  const getItemQuantity = (itemType: string): number => {
    const item = inventory.find(inv => inv.item_type === itemType);
    return item ? item.quantity : 0;
  };

  const useItem = async (itemType: string, quantity: number = 1): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('use_inventory_item', {
        user_id_param: user.id,
        item_type_param: itemType,
        quantity_param: quantity
      });

      if (error) throw error;

      if (data) {
        // Refresh inventory after successful use
        await fetchInventory();
        return true;
      } else {
        toast({
          title: "Insufficient Items",
          description: `You don't have enough ${itemType} in your inventory.`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error using item:', error);
      toast({
        title: "Error",
        description: "Failed to use item",
        variant: "destructive"
      });
      return false;
    }
  };

  const addToInventory = async (itemType: string, quantity: number, expiresAt?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('add_to_inventory', {
        user_id_param: user.id,
        item_type_param: itemType,
        quantity_param: quantity,
        expires_at_param: expiresAt || null
      });

      if (error) throw error;

      // Refresh inventory after successful addition
      await fetchInventory();
      return true;
    } catch (error) {
      console.error('Error adding to inventory:', error);
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    inventory,
    loading,
    hasItem,
    getItemQuantity,
    useItem,
    addToInventory,
    refetchInventory: fetchInventory
  };
};
