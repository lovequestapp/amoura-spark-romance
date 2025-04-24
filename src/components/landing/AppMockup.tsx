
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
  
  const screens = [
    {
      image: "/lovable-uploads/4ef8b9eb-0a3a-4a0c-ac2b-801f9a8c311f.png",
      title: "Discover",
      description: "Find people who share your interests",
      path: "/home"
    },
    {
      image: "/lovable-uploads/f6f5f04b-a831-4d1d-918c-2c09c38b2e26.png",
      title: "Connect",
      description: "Start meaningful conversations",
      path: "/matches"
    },
    {
      image: "/lovable-uploads/edfcf3e4-d0fa-408a-87d2-65224f904870.png",
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
        
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-[280px] h-[580px] bg-amoura-black rounded-[40px] p-3 shadow-2xl"
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-amoura-black rounded-b-[14px] flex items-center justify-center">
              <div className="w-16 h-4 bg-black rounded-full"></div>
            </div>
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 px-6 flex justify-between items-center text-white z-10 text-xs">
              <span>3:04</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full border border-white"></div>
                <div className="h-3 w-3 rounded-full border border-white"></div>
                <span>24</span>
              </div>
            </div>

            <div className="w-full h-full rounded-[32px] overflow-hidden border-[8px] border-amoura-black bg-white">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {screens.map((screen, index) => (
                    <CarouselItem key={screen.title} className="h-full">
                      <Link to={handleCardClick(screen.path)} className="block h-full">
                        <img 
                          src={screen.image} 
                          alt={screen.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  <CarouselPrevious className="h-8 w-8 static transform-none mx-1" />
                  <CarouselNext className="h-8 w-8 static transform-none mx-1" />
                </div>
              </Carousel>
            </div>
            
            {/* Home Bar */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-white rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppMockup;
