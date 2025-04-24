
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MessageCircle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-amoura-deep-pink" />,
      title: "Smart Matches",
      description: "Our AI-powered algorithm learns your preferences to find compatible matches"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-amoura-deep-pink" />,
      title: "Meaningful Connections",
      description: "Start conversations with personalized ice-breakers and prompts"
    },
    {
      icon: <Star className="w-8 h-8 text-amoura-gold" />,
      title: "Premium Experience",
      description: "Unlock advanced features and increase your visibility to potential matches"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-amoura-black">
          Why Choose Amoura?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-amoura-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
