
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AppNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-t py-3 px-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around">
        <Link to="/home" className="flex flex-col items-center">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${isActive('/home') ? 'bg-amoura-soft-pink' : ''}`}
          >
            <Search size={26} className={`${isActive('/home') ? 'text-amoura-deep-pink' : 'text-gray-500'}`} />
          </motion.div>
          <span className={`text-xs mt-1 ${isActive('/home') ? 'text-amoura-deep-pink font-medium' : 'text-gray-500'}`}>
            Discover
          </span>
        </Link>
        
        <Link to="/standouts" className="flex flex-col items-center">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${isActive('/standouts') ? 'bg-amoura-soft-pink' : ''}`}
          >
            <Heart size={26} className={`${isActive('/standouts') ? 'text-amoura-deep-pink' : 'text-gray-500'}`} />
          </motion.div>
          <span className={`text-xs mt-1 ${isActive('/standouts') ? 'text-amoura-deep-pink font-medium' : 'text-gray-500'}`}>
            Standouts
          </span>
        </Link>
        
        <Link to="/matches" className="flex flex-col items-center">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${isActive('/matches') ? 'bg-amoura-soft-pink' : ''}`}
          >
            <MessageCircle size={26} className={`${isActive('/matches') ? 'text-amoura-deep-pink' : 'text-gray-500'}`} />
          </motion.div>
          <span className={`text-xs mt-1 ${isActive('/matches') ? 'text-amoura-deep-pink font-medium' : 'text-gray-500'}`}>
            Matches
          </span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${isActive('/profile') ? 'bg-amoura-soft-pink' : ''}`}
          >
            <User size={26} className={`${isActive('/profile') ? 'text-amoura-deep-pink' : 'text-gray-500'}`} />
          </motion.div>
          <span className={`text-xs mt-1 ${isActive('/profile') ? 'text-amoura-deep-pink font-medium' : 'text-gray-500'}`}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default AppNavigation;
