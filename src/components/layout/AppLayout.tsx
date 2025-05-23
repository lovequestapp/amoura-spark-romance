
import React, { ReactNode, useEffect } from 'react';
import AppNavigation from './AppNavigation';
import { useLocation } from 'react-router-dom';
import { isNativePlatform, getSafeAreaInsets } from '@/utils/platform';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();
  const safeAreaInsets = getSafeAreaInsets();
  
  useEffect(() => {
    // Apply safe area padding when on native platforms
    if (isNativePlatform()) {
      document.documentElement.style.setProperty('--safe-area-top', `${safeAreaInsets.top}px`);
      document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaInsets.bottom}px`);
    }
  }, [safeAreaInsets]);

  return (
    <div 
      className="min-h-screen flex flex-col bg-white w-full"
      style={{
        paddingTop: isNativePlatform() ? `var(--safe-area-top, 0px)` : 0,
        paddingBottom: isNativePlatform() ? `var(--safe-area-bottom, 0px)` : 0
      }}
    >
      <main className="flex-1 overflow-auto pb-[72px] w-full">
        {children}
      </main>
      
      {!hideNavigation && !isHomePage && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-white z-50"
          style={{
            paddingBottom: isNativePlatform() ? `var(--safe-area-bottom, 0px)` : 0
          }}
        >
          <AppNavigation />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
