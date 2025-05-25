import { useState, useEffect } from 'react';
import { useInventory } from '@/hooks/useInventory';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  features: string[];
  quantity: number;
  category: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { addToInventory } = useInventory();

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.priceValue * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const simulateCheckout = async (): Promise<boolean> => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process each item in the cart and add to inventory
      for (const item of cartItems) {
        let itemType = '';
        let quantity = item.quantity || 1;
        
        // Map cart items to inventory item types
        if (item.category === 'communication' || item.name.toLowerCase().includes('message')) {
          itemType = 'messages';
          // Extract message count from item name or use a default mapping
          if (item.name.includes('10')) quantity = 10;
          else if (item.name.includes('25')) quantity = 25;
          else if (item.name.includes('50')) quantity = 50;
          else quantity = 10; // default
        } else if (item.name.toLowerCase().includes('super like')) {
          itemType = 'super_likes';
          quantity = 5; // Default super likes pack
        } else if (item.name.toLowerCase().includes('rewind')) {
          itemType = 'rewinds';
          quantity = 5; // Default rewinds pack
        } else if (item.name.toLowerCase().includes('boost')) {
          itemType = 'boosts';
          quantity = 1; // Default boost count
        }
        
        if (itemType) {
          // Calculate expiry date based on item type
          let expiresAt: string | undefined;
          if (itemType === 'messages') {
            // Messages expire in 30-90 days based on pack
            const days = item.name.includes('Premium') ? 90 : 
                        item.name.includes('Popular') ? 60 : 30;
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + days);
            expiresAt = expiry.toISOString();
          }
          
          await addToInventory(itemType, quantity, expiresAt);
        }
      }
      
      // Clear cart after successful checkout
      clearCart();
      return true;
    } catch (error) {
      console.error('Checkout failed:', error);
      return false;
    }
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    simulateCheckout
  };
};
