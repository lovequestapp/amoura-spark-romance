
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Users, MessageCircle, Brain, Shield, Sparkles, Zap, Award, CheckCircle, ArrowRight, Play } from "lucide-react";
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
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex gap-1 mb-3">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amoura-gold text-amoura-gold" />
      ))}
    </div>
    <p className="text-gray-600 italic mb-4 leading-relaxed">"{quote}"</p>
    <p className="font-medium text-amoura-black">{name}, {age}</p>
    <p className="text-sm text-gray-500">{location}</p>
  </motion.div>
);

const StatCard = ({ number, label, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2"
      >
        {number}
      </motion.div>
      <p className="text-white/90 font-medium">{label}</p>
    </div>
  </motion.div>
);

const FeatureHighlight = ({ icon, title, description, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    <div className={`absolute inset-0 ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
    <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradient} mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    console.log('Get Started clicked - User:', !!user, 'Loading:', isLoading);
    navigate('/login');
  };
  
  const handleGoToHome = () => {
    console.log('Go to Home clicked - User:', !!user, 'Loading:', isLoading);
    
    if (user) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-white w-full overflow-hidden">
      {/* Enhanced Hero Section with Floating Elements */}
      <section className="relative pt-24 pb-20 px-6 bg-gradient-to-br from-white via-amoura-soft-pink/30 to-purple-50/50 overflow-hidden">
        {/* Animated Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
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
            className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-amoura-gold/10 to-amoura-deep-pink/10 rounded-full blur-3xl"
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
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          />
          
          {/* Floating Hearts */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amoura-deep-pink/20"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [0, -20, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              <Heart className="w-6 h-6" />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroTextVariants}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-3/5 text-center lg:text-left">
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
                className="flex justify-center lg:justify-start mb-8"
              >
                <div className="relative">
                  <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-amoura-deep-pink via-purple-600 to-amoura-gold bg-clip-text text-transparent">
                    amoura
                  </h1>
                  <motion.span 
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="absolute -top-4 -right-6 text-amoura-gold text-5xl"
                  >
                    ✦
                  </motion.span>
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amoura-deep-pink to-amoura-gold rounded-full"
                  />
                </div>
              </motion.div>
              
              <motion.h2 
                variants={heroTextVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              >
                Where <span className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 bg-clip-text text-transparent">Science</span> Meets <span className="bg-gradient-to-r from-amoura-gold to-orange-500 bg-clip-text text-transparent">Soulmates</span>
              </motion.h2>
              
              <motion.p 
                variants={heroTextVariants}
                className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl lg:max-w-none"
              >
                Revolutionary AI-powered dating that analyzes <span className="font-semibold text-amoura-deep-pink">136 compatibility factors</span> to find your perfect match based on deep psychological connection, not just photos.
              </motion.p>
              
              <motion.div 
                variants={heroTextVariants}
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 hover:from-amoura-deep-pink/90 hover:to-purple-600/90 text-white rounded-full py-8 px-12 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={handleGetStarted}
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Start Your Love Journey
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline"
                    className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full py-8 px-12 text-xl font-semibold transition-all duration-300"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div
                variants={heroTextVariants}
                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[
                      "/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png",
                      "/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png",
                      "/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png"
                    ].map((src, i) => (
                      <motion.img 
                        key={i}
                        src={src}
                        alt="Community member"
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">2.5M+ Success Stories</p>
                    <p className="text-sm text-gray-600">Finding love every day</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amoura-gold text-amoura-gold" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">4.9/5 Rating</span>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Phone Mockup */}
            <div className="lg:w-2/5 flex justify-center items-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Glowing ring effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-amoura-deep-pink to-purple-600 rounded-[45px] blur-xl"
                />
                
                <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[45px] p-3 shadow-2xl">
                  {/* Phone frame */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[35px] bg-gray-900 rounded-b-[18px] z-10"></div>
                  
                  {/* Screen content */}
                  <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative">
                    {/* Status bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-amoura-deep-pink to-purple-600 z-20 flex items-center justify-between px-6 text-white text-sm font-medium">
                      <span>12:56</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">5G</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-white' : 'bg-white/60'}`} />
                          ))}
                        </div>
                        <div className="w-6 h-3 bg-white rounded-sm text-xs flex items-center justify-center text-gray-900 font-bold">95</div>
                      </div>
                    </div>
                    
                    {/* Profile content */}
                    <img 
                      src="/lovable-uploads/f572c971-a715-43c4-84b3-ce8d82790d45.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Profile overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                          >
                            <ArrowRight className="w-5 h-5 text-white rotate-180" />
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                          >
                            <Heart className="w-5 h-5 inline mr-2" />
                            97% Match
                          </motion.div>
                        </div>
                        
                        <div className="text-white mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-bold">Sofia, 24</h3>
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <p className="text-white/90 text-sm mb-1">📍 2 miles away</p>
                          <p className="text-white/90 text-sm">Marketing Professional • Dog Lover</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/10 backdrop-blur-sm text-white py-3 rounded-2xl text-center font-medium border border-white/20"
                          >
                            💬 Message
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 text-white py-3 rounded-2xl text-center font-medium shadow-lg"
                          >
                            ❤️ Like
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full"></div>
                </div>
              </motion.div>
              
              {/* Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="absolute top-16 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">AI Analysis</p>
                    <p className="text-xs text-gray-600">97% Compatible</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.4 }}
                className="absolute bottom-32 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">New Match!</p>
                    <p className="text-xs text-gray-600">2 mins ago</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-amoura-deep-pink via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Millions Worldwide
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join the fastest-growing community of singles finding meaningful connections
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              number="2.5M+" 
              label="Success Stories" 
              icon={<Heart className="w-8 h-8 text-white" />}
              delay={0.1}
            />
            <StatCard 
              number="97%" 
              label="Match Accuracy" 
              icon={<Brain className="w-8 h-8 text-white" />}
              delay={0.2}
            />
            <StatCard 
              number="136" 
              label="Compatibility Factors" 
              icon={<Zap className="w-8 h-8 text-white" />}
              delay={0.3}
            />
            <StatCard 
              number="4.9★" 
              label="App Store Rating" 
              icon={<Award className="w-8 h-8 text-white" />}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-amoura-deep-pink font-semibold mb-4 inline-block text-lg"
            >
              REVOLUTIONARY APPROACH
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why <span className="bg-gradient-to-r from-amoura-deep-pink to-purple-600 bg-clip-text text-transparent">Amoura</span> is Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've revolutionized online dating by combining cutting-edge AI with psychological science to create deeper, more meaningful connections
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureHighlight
              icon={<Brain className="w-8 h-8 text-white" />}
              title="AI-Powered Psychology"
              description="Our advanced algorithms analyze personality traits, communication styles, and emotional intelligence to find your perfect psychological match."
              gradient="from-purple-500 to-indigo-600"
              delay={0.1}
            />
            
            <FeatureHighlight
              icon={<Shield className="w-8 h-8 text-white" />}
              title="Verified Profiles"
              description="Every profile is verified through our multi-step process including photo verification, social media linking, and behavioral analysis."
              gradient="from-green-500 to-emerald-600"
              delay={0.2}
            />
            
            <FeatureHighlight
              icon={<Sparkles className="w-8 h-8 text-white" />}
              title="Smart Conversation Starters"
              description="Never run out of things to say with AI-generated conversation starters based on shared interests and compatibility factors."
              gradient="from-amoura-deep-pink to-pink-500"
              delay={0.3}
            />
            
            <FeatureHighlight
              icon={<Zap className="w-8 h-8 text-white" />}
              title="Real-Time Chemistry Detection"
              description="Our proprietary algorithm detects romantic chemistry patterns in your conversations and suggests optimal timing for dates."
              gradient="from-yellow-500 to-orange-500"
              delay={0.4}
            />
            
            <FeatureHighlight
              icon={<Users className="w-8 h-8 text-white" />}
              title="Community Events"
              description="Join exclusive virtual and in-person events designed to help you meet like-minded singles in a comfortable environment."
              gradient="from-blue-500 to-cyan-500"
              delay={0.5}
            />
            
            <FeatureHighlight
              icon={<Award className="w-8 h-8 text-white" />}
              title="Success Guarantee"
              description="We're so confident in our matching algorithm that we offer a relationship success guarantee or your money back."
              gradient="from-indigo-500 to-purple-600"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      <AppMockup />
      <FeaturesSection />
      <AlgorithmSection />
      
      {/* Enhanced Testimonials Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-amoura-soft-pink/20 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-amoura-deep-pink font-semibold mb-4 inline-block text-lg"
            >
              SUCCESS STORIES
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Real Love Stories from Real People
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Thousands of couples have found their perfect match through our science-based compatibility system
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Testimonial 
              quote="Amoura's personality compatibility feature was a game-changer. Within two weeks, I met someone who truly understands me. We're planning our wedding next spring!"
              name="Sarah Chen"
              age="31"
              location="San Francisco"
              stars={5}
              delay={0.1}
            />
            <Testimonial 
              quote="After years of disappointing dates from other apps, Amoura connected me with my soulmate. The psychological matching really works - we think alike on everything!"
              name="Michael Rodriguez"
              age="34"
              location="Austin"
              stars={5}
              delay={0.2}
            />
            <Testimonial 
              quote="The conversation starters helped break the ice naturally. What started as a chat about shared values became the most beautiful relationship of my life."
              name="Jennifer Park"
              age="29"
              location="Seattle"
              stars={5}
              delay={0.3}
            />
          </div>
          
          {/* Video Testimonial CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-deep-pink hover:text-white font-semibold px-8 py-4"
            >
              <Play className="w-5 h-5 mr-3" />
              Watch More Success Stories
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-amoura-deep-pink via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amoura-gold/20 blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Sparkles className="w-6 h-6 text-amoura-gold" />
              <span className="text-white font-semibold text-lg">Limited Time: Free Premium Features for New Users</span>
              <Sparkles className="w-6 h-6 text-amoura-gold" />
            </div>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
            Your <span className="bg-gradient-to-r from-amoura-gold to-yellow-300 bg-clip-text text-transparent">Perfect Match</span> is Waiting
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 2.5 million singles who've discovered the science of lasting love
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                className="bg-white text-amoura-deep-pink hover:bg-gray-100 rounded-full py-8 px-16 text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
                onClick={handleGetStarted}
              >
                <Heart className="w-7 h-7 mr-4" />
                Find Your Soulmate Today
                <motion.span
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="ml-4 inline-block text-3xl"
                >
                  💕
                </motion.span>
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Start matching in minutes</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
