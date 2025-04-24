
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, MessageCircle, User } from 'lucide-react';

const AppNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-t py-2 px-4 bg-white">
      <div className="flex justify-around">
        <Link to="/home" className={`nav-icon ${isActive('/home') ? 'active' : ''}`}>
          <Search size={26} />
        </Link>
        
        <Link to="/standouts" className={`nav-icon ${isActive('/standouts') ? 'active' : ''}`}>
          <Heart size={26} />
        </Link>
        
        <Link to="/matches" className={`nav-icon ${isActive('/matches') ? 'active' : ''}`}>
          <MessageCircle size={26} />
        </Link>
        
        <Link to="/profile" className={`nav-icon ${isActive('/profile') ? 'active' : ''}`}>
          <User size={26} />
        </Link>
      </div>
    </nav>
  );
};

export default AppNavigation;
