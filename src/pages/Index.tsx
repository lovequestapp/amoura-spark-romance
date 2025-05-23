
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Users, MessageCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AlgorithmSection from '@/components/landing/AlgorithmSection';
import AppMockup from '@/components/landing/AppMockup';

const heroTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, staggerChildren: 0.2 }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const Testimonial = ({ quote, name, age, location, stars, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-xl p-6 shadow-md border border-gray-50"
  >
    <div className="flex gap-1 mb-3">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amoura-gold text-amoura-gold" />
      ))}
    </div>
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <p className="font-medium text-amoura-black">{name}, {age}</p>
    <p className="text-sm text-gray-500">{location}</p>
  </motion.div>
);

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-white w-full">
      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-br from-white via-amoura-soft-pink to-white overflow-hidden relative w-full">
        {/* Animated background decorations */}
        <motion.div 
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-amoura-gold/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-amoura-deep-pink/5 rounded-full blur-3xl"
        />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroTextVariants}
          className="max-w-6xl mx-auto relative"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <motion.div
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: { 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }
                  }
                }}
                className="flex justify-center md:justify-start mb-6"
              >
                <div className="relative">
                  <h1 className="text-6xl font-bold text-amoura-deep-pink">amoura</h1>
                  <motion.span 
                    animate={pulseAnimation}
                    className="absolute -top-2 -right-4 text-amoura-gold text-4xl"
                  >
                    ✦
                  </motion.span>
                </div>
              </motion.div>
              
              <motion.h2 
                variants={heroTextVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-amoura-black mb-6 leading-tight"
              >
                Find Your <span className="text-amoura-deep-pink">Perfect Match</span> Through Science
              </motion.h2>
              
              <motion.p 
                variants={heroTextVariants}
                className="text-xl text-gray-600 mb-8 md:max-w-lg"
              >
                Experience dating reimagined with AI-powered matches based on psychological compatibility for connections that truly matter
              </motion.p>
              
              <motion.div 
                variants={heroTextVariants}
                className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-8"
              >
                <Button 
                  className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={handleGetStarted}
                >
                  {user ? "Go to Home" : "Get Started"}
                </Button>
              </motion.div>
              
              <motion.div
                variants={heroTextVariants}
                className="flex items-center gap-2 text-gray-500 justify-center md:justify-start"
              >
                <div className="flex -space-x-2">
                  <motion.img 
                    src="/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png"
                    alt="Community member"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <motion.img 
                    src="/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png"
                    alt="Community member"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <motion.img 
                    src="/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png"
                    alt="Community member"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <p className="text-sm font-medium">Join 100,000+ singles finding love every day</p>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 flex justify-center items-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative w-[280px] h-[560px] bg-amoura-black rounded-[40px] p-3 shadow-2xl"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-amoura-black rounded-b-[14px]"></div>
                <div className="w-full h-full rounded-[32px] overflow-hidden border-[8px] border-amoura-black">
                  <img 
                    src="/lovable-uploads/47129695-da2d-45c2-af99-edd3aa1c1244.png" 
                    alt="App Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl">Emma, 28</h3>
                      <p className="text-white/80 text-sm">2 miles away</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-amoura-deep-pink rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Heart className="text-white w-6 h-6" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorations */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="absolute top-20 right-8 w-16 h-16 rounded-full bg-amoura-gold/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Heart className="text-amoura-deep-pink w-8 h-8" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="absolute bottom-20 left-8 w-20 h-20 rounded-full bg-amoura-deep-pink/10 backdrop-blur-sm flex items-center justify-center"
              >
                <Star className="text-amoura-gold w-10 h-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <AppMockup />
      <FeaturesSection />
      <AlgorithmSection />
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-amoura-soft-pink/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-amoura-deep-pink font-medium mb-2 inline-block"
            >
              SUCCESS STORIES
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amoura-black">
              Love Stories That Started Here
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real couples who found their perfect match through our science-based compatibility algorithm
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial 
              quote="Amoura's personality compatibility feature helped me find someone who truly understands me. We've been together for over a year now!"
              name="Sarah"
              age="31"
              location="New York"
              stars={5}
              delay={0.1}
            />
            <Testimonial 
              quote="After trying other dating apps with no success, Amoura connected me with my fiancé based on our shared values and communication style."
              name="Michael"
              age="34"
              location="Chicago"
              stars={5}
              delay={0.2}
            />
            <Testimonial 
              quote="The meaningful conversation starters really helped break the ice. What started as a deep chat about life goals is now a beautiful relationship."
              name="Jennifer"
              age="29"
              location="Los Angeles"
              stars={4}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-amoura-soft-pink to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amoura-gold/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amoura-deep-pink/10 blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-amoura-black leading-tight">
            Ready to Find Your <span className="text-amoura-deep-pink">Perfect Match</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of singles who found meaningful connections based on true compatibility
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-7 px-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              asChild
            >
              <Link to="/signup">
                Begin Your Love Story Today
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="ml-2 inline-block"
                >
                  ❤️
                </motion.span>
              </Link>
            </Button>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-gray-500 text-sm"
          >
            Join over 2 million singles already on Amoura
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
