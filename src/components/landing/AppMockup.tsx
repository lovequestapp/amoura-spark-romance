
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

const AppMockup = () => {
  const { user } = useAuth();
  
  const mockupScreens = [
    "/lovable-uploads/b97ce0e5-bff9-4bb6-a114-5aaeb893964b.png",
    "/lovable-uploads/5f5c1984-5335-44b5-9c5c-e7ed15408ded.png",
    "/lovable-uploads/873e5cd7-bc30-4c2f-8f2d-2a1112333e04.png"
  ];

  const screens = [
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

        {/* Phone Mockup with Carousel */}
        <div className="flex justify-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-[280px]"
          >
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-white z-10 flex items-center justify-between px-4">
              <span className="text-xs font-medium">3:04</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 20L12.8889 18.8889C14.2222 17.5556 15 15.7778 15 13.8889C15 10.0556 12 7 12 7C12 7 9 10.0556 9 13.8889C9 15.7778 9.77778 17.5556 11.1111 18.8889L12 20Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="h-3 w-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M1.9 12C1.9 11.39 2.39 10.9 3 10.9H4C4.61 10.9 5.1 11.39 5.1 12C5.1 12.61 4.61 13.1 4 13.1H3C2.39 13.1 1.9 12.61 1.9 12ZM18.9 12C18.9 12.61 19.39 13.1 20 13.1H21C21.61 13.1 22.1 12.61 22.1 12C22.1 11.39 21.61 10.9 21 10.9H20C19.39 10.9 18.9 11.39 18.9 12ZM12 1.9C11.39 1.9 10.9 2.39 10.9 3V4C10.9 4.61 11.39 5.1 12 5.1C12.61 5.1 13.1 4.61 13.1 4V3C13.1 2.39 12.61 1.9 12 1.9Z" fill="currentColor"/>
                    <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="h-3 w-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17 5V4C17 3.45 16.55 3 16 3H8C7.45 3 7 3.45 7 4V5H4C3.45 5 3 5.45 3 6V20C3 20.55 3.45 21 4 21H20C20.55 21 21 20.55 21 20V6C21 5.45 20.55 5 20 5H17ZM15 5H9V4H15V5Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Frame */}
            <div className="w-full rounded-[40px] bg-black p-3 shadow-2xl">
              <div className="relative w-full rounded-[32px] overflow-hidden bg-white">
                {/* Content Area */}
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {mockupScreens.map((screen, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-[9/19.5]">
                            <img
                              src={screen}
                              alt={`App Screen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      <CarouselPrevious className="static transform-none mx-0" />
                      <CarouselNext className="static transform-none mx-0" />
                    </div>
                  </Carousel>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
          </motion.div>
        </div>
        
        {/* Features Section */}
        <div className="hidden md:block">
          <div className="flex space-x-8 justify-center">
            {screens.map((screen, index) => (
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
                  transition={{ duration: 0.3 }}
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
        
        {/* Mobile Features Section */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {screens.map((screen, index) => (
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
