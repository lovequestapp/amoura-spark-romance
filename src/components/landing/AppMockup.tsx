
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AppMockup = () => {
  const screens = [
    {
      image: "/photo-1581091226825-a6a2a5aee158",
      title: "Discover",
      description: "Find people who share your interests"
    },
    {
      image: "/photo-1649972904349-6e44c42644a7",
      title: "Connect",
      description: "Start meaningful conversations"
    },
    {
      image: "/photo-1581092795360-fd1ca04f0952",
      title: "Meet",
      description: "Turn online connections into real dates"
    }
  ];

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
        
        <div className="hidden md:block">
          <div className="flex space-x-8 justify-center">
            {screens.map((screen, index) => (
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex-shrink-0 w-64 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="relative h-[480px]">
                    <img
                      src={`https://source.unsplash.com${screen.image}`}
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
            ))}
          </div>
        </div>
        
        {/* Mobile carousel version */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {screens.map((screen, index) => (
                <CarouselItem key={screen.title} className="pl-4 md:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                      <div className="relative h-[400px]">
                        <img
                          src={`https://source.unsplash.com${screen.image}`}
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
