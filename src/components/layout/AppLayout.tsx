
import React, { ReactNode } from 'react';
import AppNavigation from './AppNavigation';

interface AppLayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, hideNavigation = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {!hideNavigation && <AppNavigation />}
    </div>
  );
};

export default AppLayout;
