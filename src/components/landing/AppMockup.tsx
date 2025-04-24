
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

const AppMockup = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
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
      return "/auth";
    }
    return path;
  };

  return (
    <section className="py-16 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gray-100 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gray-200 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-amoura-black"
        >
          Experience Dating Like Never Before
        </motion.h2>
        
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
