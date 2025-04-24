
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
  
  const phoneScreens = [
    '/lovable-uploads/775b1c0b-229a-46b3-9428-6831e4fb6b1e.png',
    '/lovable-uploads/47129695-da2d-45c2-af99-edd3aa1c1244.png',
    '/lovable-uploads/d087d2b0-450b-402c-91f9-cc0841a89716.png'
  ];
  
  // State to track active carousel slide
  const [activeSlide, setActiveSlide] = React.useState(0);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
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
        <div className="flex justify-center">
          <div className="relative w-[280px] h-[580px] mx-auto">
            <div className="absolute inset-0 bg-amoura-black rounded-[40px] p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-amoura-black rounded-b-[14px] z-10"></div>
              <div className="w-full h-full rounded-[32px] overflow-hidden border-[8px] border-amoura-black bg-white relative">
                <Carousel 
                  className="w-full h-full"
                  onSlideChange={handleSlideChange}
                >
                  <CarouselContent className="h-full">
                    {phoneScreens.map((screen, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="relative w-full h-full">
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
                    {phoneScreens.map((_, index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 rounded-full bg-white/50"
                        animate={{ opacity: index === activeSlide ? 1 : 0.5 }}
                      />
                    ))}
                  </div>
                </Carousel>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppMockup;
