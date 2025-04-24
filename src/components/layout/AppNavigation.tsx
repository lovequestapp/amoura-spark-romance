
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, MessageCircle, User } from 'lucide-react';

const AppNavigation = () => {
  // We need to make sure this component is rendered inside a Router
  // The error happens because the component is used outside Router context
  // Get current location to highlight the active tab
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-t py-2 px-4 bg-white">
      <div className="flex justify-around">
        <Link to="/home" className={`nav-icon ${isActive('/home') ? 'text-amoura-deep-pink' : 'text-gray-500'}`}>
          <Search size={26} />
        </Link>
        
        <Link to="/standouts" className={`nav-icon ${isActive('/standouts') ? 'text-amoura-deep-pink' : 'text-gray-500'}`}>
          <Heart size={26} />
        </Link>
        
        <Link to="/matches" className={`nav-icon ${isActive('/matches') ? 'text-amoura-deep-pink' : 'text-gray-500'}`}>
          <MessageCircle size={26} />
        </Link>
        
        <Link to="/profile" className={`nav-icon ${isActive('/profile') ? 'text-amoura-deep-pink' : 'text-gray-500'}`}>
          <User size={26} />
        </Link>
      </div>
    </nav>
  );
};

export default AppNavigation;
