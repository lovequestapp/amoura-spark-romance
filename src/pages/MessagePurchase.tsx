
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowLeft, Check, Zap, Star, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MessagePurchase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const messagePacks = [
    {
      id: 'starter',
      name: 'Starter Pack',
      messages: 10,
      price: '$4.99',
      priceValue: 499,
      popular: false,
      description: 'Perfect for casual conversations',
      features: ['10 premium messages', 'Valid for 30 days', 'No subscription required']
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      messages: 25,
      price: '$9.99',
      priceValue: 999,
      popular: true,
      description: 'Best value for active daters',
      features: ['25 premium messages', 'Valid for 60 days', 'Priority message delivery', 'Read receipts included']
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      messages: 50,
      price: '$17.99',
      priceValue: 1799,
      popular: false,
      description: 'For serious connections',
      features: ['50 premium messages', 'Valid for 90 days', 'Priority message delivery', 'Read receipts included', 'Message scheduling']
    }
  ];

  const handleAddToCart = (pack: typeof messagePacks[0]) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Add to cart logic would go here
    toast({
      title: "Added to Cart!",
      description: `${pack.name} has been added to your cart.`,
    });
    
    navigate('/cart');
  };

  const handlePurchase = async (pack: typeof messagePacks[0]) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to purchase message credits.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${pack.messages} premium messages for ${pack.price}.`,
      });
      
      // Navigate back to messages or previous page
      navigate(-1);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header - Fixed alignment */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Premium Messages</h1>
                <p className="text-gray-600 mt-1">Choose your message pack and start connecting</p>
              </div>
            </div>
            <div className="w-12"></div> {/* Spacer to balance the back button */}
          </div>

          {/* Info Card */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Why Premium Messages?</h3>
                  <p className="text-green-700 text-sm mb-3">
                    Premium messages allow you to start conversations with anyone, even without matching first. 
                    Stand out from the crowd and make meaningful connections.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Check className="w-3 h-3 mr-1" />
                      No match required
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Zap className="w-3 h-3 mr-1" />
                      Instant delivery
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Star className="w-3 h-3 mr-1" />
                      Higher response rate
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Packs */}
          <div className="grid md:grid-cols-3 gap-6">
            {messagePacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${pack.popular ? 'border-amoura-deep-pink shadow-lg scale-105' : 'border-gray-200'}`}>
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-amoura-deep-pink text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold">{pack.name}</CardTitle>
                    <CardDescription className="text-sm">{pack.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-amoura-deep-pink">{pack.price}</div>
                      <div className="text-sm text-gray-500">{pack.messages} messages</div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-2 mb-6">
                      {pack.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddToCart(pack)}
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>

                      <Button
                        onClick={() => handlePurchase(pack)}
                        disabled={isLoading}
                        className={`w-full ${pack.popular 
                          ? 'bg-amoura-deep-pink hover:bg-amoura-deep-pink/90' 
                          : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          `Buy Now - ${pack.messages} Messages`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>All purchases are one-time payments. No recurring charges.</p>
            <p className="mt-1">Unused messages expire based on the pack validity period.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MessagePurchase;
