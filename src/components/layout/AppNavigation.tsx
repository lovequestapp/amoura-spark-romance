import React from 'react';
import { Heart, Home, User, Users, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Heart, label: 'Matches', path: '/matches' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-amoura-deep-pink' 
                  : 'text-gray-500 hover:text-amoura-deep-pink'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent 
                size={24} 
                className={`mb-1 ${isActive ? 'fill-current' : ''}`}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-6 h-0.5 bg-amoura-deep-pink rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default AppNavigation;
