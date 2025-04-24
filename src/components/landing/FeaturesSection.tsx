
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MessageCircle, Users, Award } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart className="w-10 h-10 text-amoura-deep-pink" />,
      title: "Smart Matches",
      description: "Our AI-powered algorithm learns your preferences and behavior patterns to find truly compatible matches that resonate with your emotional needs"
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-amoura-deep-pink" />,
      title: "Meaningful Connections",
      description: "Start conversations with personalized ice-breakers based on psychological compatibility factors that foster authentic emotional bonds"
    },
    {
      icon: <Users className="w-10 h-10 text-amoura-deep-pink" />,
      title: "Community Events",
      description: "Join exclusive social gatherings and activities designed to create natural environments where romantic connections can flourish organically"
    },
    {
      icon: <Award className="w-10 h-10 text-amoura-gold" />,
      title: "Premium Experience",
      description: "Unlock our science-backed relationship insights and increase your visibility to potential matches who share your deepest values and goals"
    },
    {
      icon: <Star className="w-10 h-10 text-amoura-gold" />,
      title: "Verified Profiles",
      description: "Connect with confidence through our multi-step verification process that ensures authentic interactions and emotional safety"
    }
  ];

  return (
    <section className="py-20 px-6 bg-amoura-soft-pink/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-amoura-deep-pink/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-amoura-pink/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-amoura-deep-pink font-medium mb-2 inline-block"
          >
            DESIGNED FOR GENUINE CONNECTION
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-amoura-black">
            Why Thousands Choose <span className="text-amoura-deep-pink">Amoura</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our science-based approach to dating combines cutting-edge technology with deep psychological insights to create meaningful connections that last
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="p-3 bg-amoura-soft-pink rounded-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-amoura-black">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
