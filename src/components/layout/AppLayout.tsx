
import React, { ReactNode } from 'react';
import AppNavigation from './AppNavigation';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {!hideNavigation && !isHomePage && <AppNavigation />}
    </div>
  );
};

export default AppLayout;
