
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturesSection from '@/components/landing/FeaturesSection';
import AlgorithmSection from '@/components/landing/AlgorithmSection';
import AppMockup from '@/components/landing/AppMockup';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amoura-soft-pink">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-6xl font-bold text-amoura-deep-pink">amoura</h1>
              <span className="absolute -top-2 -right-4 text-amoura-gold text-4xl">✦</span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-amoura-black mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience dating reimagined with AI-powered matches and meaningful connections
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 px-8 text-lg"
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button 
              variant="outline"
              className="rounded-full py-6 px-8 text-lg"
              asChild
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <AppMockup />
      <FeaturesSection />
      <AlgorithmSection />

      {/* Final CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-amoura-soft-pink">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-amoura-black">
            Ready to Find Your Perfect Match?
          </h2>
          <Button 
            className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 px-12 text-lg"
            asChild
          >
            <Link to="/signup">Join Amoura Today</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
