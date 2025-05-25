
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Zap, MessageCircle, RotateCcw, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const AddOns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart, getCartCount } = useCart();

  // Updated add-ons with multiple message pack options
  const addOns = [
    {
      id: 'profile-boost',
      name: 'Profile Boost',
      description: 'Get 10x more profile views for 30 minutes',
      price: '$2.99',
      priceValue: 299,
      icon: Zap,
      color: 'bg-purple-500',
      features: [
        '10x more profile visibility',
        'Priority in discovery queue',
        'Active for 30 minutes',
        'Instant activation'
      ]
    },
    {
      id: 'message-starter',
      name: 'Starter Message Pack',
      description: '10 premium messages for casual conversations',
      price: '$4.99',
      priceValue: 499,
      icon: MessageCircle,
      color: 'bg-blue-500',
      features: [
        '10 premium messages',
        'Message anyone without matching',
        'Valid for 30 days',
        'Higher response rate'
      ]
    },
    {
      id: 'message-popular',
      name: 'Popular Message Pack',
      description: '25 premium messages - best value for active daters',
      price: '$9.99',
      priceValue: 999,
      icon: MessageCircle,
      color: 'bg-blue-600',
      popular: true,
      features: [
        '25 premium messages',
        'Message anyone without matching',
        'Valid for 60 days',
        'Priority message delivery',
        'Read receipts included'
      ]
    },
    {
      id: 'message-premium',
      name: 'Premium Message Pack',
      description: '50 premium messages for serious connections',
      price: '$17.99',
      priceValue: 1799,
      icon: MessageCircle,
      color: 'bg-blue-700',
      features: [
        '50 premium messages',
        'Message anyone without matching',
        'Valid for 90 days',
        'Priority message delivery',
        'Read receipts included',
        'Message scheduling'
      ]
    },
    {
      id: 'super-likes',
      name: 'Super Likes',
      description: 'Stand out with 5 Super Likes',
      price: '$4.99',
      priceValue: 499,
      icon: Star,
      color: 'bg-yellow-500',
      features: [
        '5 Super Likes included',
        '3x higher match rate',
        'Instant notification to user',
        'Show genuine interest'
      ]
    },
    {
      id: 'rewinds',
      name: 'Rewinds',
      description: 'Undo your last 5 swipes',
      price: '$1.99',
      priceValue: 199,
      icon: RotateCcw,
      color: 'bg-green-500',
      features: [
        '5 rewinds included',
        'Undo accidental passes',
        'Get second chances',
        'Never miss a connection'
      ]
    }
  ];

  const handleAddToCart = (addOn: typeof addOns[0]) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const cartItem = {
      id: addOn.id,
      name: addOn.name,
      description: addOn.description,
      price: addOn.price,
      priceValue: addOn.priceValue,
      features: addOn.features,
      quantity: 1,
      category: 'add-on'
    };

    addToCart(cartItem);

    toast({
      title: "Added to Cart!",
      description: `${addOn.name} has been added to your cart.`,
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900">Premium Add-Ons</h1>
              <p className="text-gray-600 mt-1">Boost your dating experience with premium features</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/cart')}
              className="flex-shrink-0 relative px-3"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Cart</span>
              {getCartCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-amoura-deep-pink text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Add-Ons Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {addOns.map((addOn, index) => {
              const Icon = addOn.icon;
              
              return (
                <motion.div
                  key={addOn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm relative ${
                    addOn.popular ? 'border-amoura-deep-pink shadow-lg scale-105' : ''
                  }`}>
                    {addOn.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-amoura-deep-pink text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 ${addOn.color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{addOn.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {addOn.description}
                      </CardDescription>
                      <div className="text-3xl font-bold text-amoura-deep-pink">
                        {addOn.price}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-6">
                        {addOn.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleAddToCart(addOn)}
                        className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart - {addOn.price}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>All purchases are one-time payments. No recurring charges.</p>
            <p className="mt-1">Features activate immediately after purchase.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddOns;
