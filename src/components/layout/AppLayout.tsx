
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
      <main className="flex-1 overflow-auto pb-[72px]">
        {children}
      </main>
      
      {!hideNavigation && !isHomePage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
          <AppNavigation />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
