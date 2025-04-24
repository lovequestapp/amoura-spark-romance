
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PhoneMockup from '@/components/ui/phone-mockup';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, MessageCircle } from 'lucide-react';

const AppMockup = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const phoneScreens = [
    '/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png',
    '/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png',
    '/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png'
  ];
  
  const featureScreens = [
    {
      image: "/lovable-uploads/woman-laptop-1.jpg",
      title: "Discover",
      description: "Find people who share your interests",
      path: "/home"
    },
    {
      image: "/lovable-uploads/woman-laptop-2.jpg",
      title: "Connect",
      description: "Start meaningful conversations",
      path: "/matches"
    },
    {
      image: "/lovable-uploads/man-laptop.jpg",
      title: "Community",
      description: "Join our vibrant dating community",
      path: "/community"
    }
  ];

  const handleCardClick = (path: string) => {
    if (!user) {
      // If user is not logged in, redirect to auth page instead
      return "/auth";
    }
    return path;
  };

  return (
    <section className="py-16 px-6 overflow-hidden bg-gradient-to-r from-white to-amoura-soft-pink">
      <div className="max-w-6xl mx-auto relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-amoura-black"
        >
          Experience Dating Like Never Before
        </motion.h2>
        
        {/* Phone Mockup Carousel */}
        <div className="flex justify-center mb-20">
          <PhoneMockup>
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {phoneScreens.map((screen, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative w-full h-full">
                      <img 
                        src={screen} 
                        alt={`App Screen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* App UI overlay elements */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex justify-between items-center">
                          <div className="text-white">
                            <h3 className="font-bold text-lg">Sophia, 28</h3>
                            <p className="text-xs opacity-80">2 miles away</p>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                            >
                              <MessageCircle className="w-5 h-5 text-white" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 bg-amoura-deep-pink rounded-full flex items-center justify-center"
                            >
                              <Heart className="w-5 h-5 text-white" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {phoneScreens.map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/50"
                    animate={{ opacity: index === 0 ? 1 : 0.5 }}
                  />
                ))}
              </div>
            </Carousel>
          </PhoneMockup>
        </div>
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl font-semibold text-center mb-8 text-amoura-black"
        >
          Everything you need to find your match
        </motion.h3>
        
        {/* Feature Cards */}
        <div className="hidden md:block">
          <div className="flex space-x-8 justify-center">
            {featureScreens.map((screen, index) => (
              <Link 
                key={screen.title}
                to={handleCardClick(screen.path)}
                className="block flex-shrink-0 w-64"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all"
                >
                  <div className="relative h-[480px]">
                    <img
                      src={screen.image}
                      alt={screen.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <h3 className="font-semibold text-lg">{screen.title}</h3>
                      <p className="text-sm text-white/90">{screen.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile Feature Carousel */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {featureScreens.map((screen, index) => (
                <CarouselItem key={screen.title} className="pl-4 md:basis-1/2">
                  <Link to={handleCardClick(screen.path)} className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                    >
                      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="relative h-[400px]">
                          <img
                            src={screen.image}
                            alt={screen.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                            <h3 className="font-semibold text-lg">{screen.title}</h3>
                            <p className="text-sm text-white/90">{screen.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static transform-none mx-0" />
              <CarouselNext className="static transform-none mx-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AppMockup;
