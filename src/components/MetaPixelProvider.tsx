import React, { createContext, useContext, ReactNode } from 'react';
import { useMetaPixel } from '../hooks/useMetaPixel';

interface MetaPixelContextType {
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackPageView: () => void;
  trackCustomEvent: (eventName: string, parameters?: Record<string, any>) => void;
}

const MetaPixelContext = createContext<MetaPixelContextType | undefined>(undefined);

interface MetaPixelProviderProps {
  children: ReactNode;
  pixelId: string;
}

export const MetaPixelProvider: React.FC<MetaPixelProviderProps> = ({ 
  children, 
  pixelId 
}) => {
  const { trackEvent, trackPageView, trackCustomEvent } = useMetaPixel({
    pixelId,
  });

  const contextValue: MetaPixelContextType = {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  };

  return (
    <MetaPixelContext.Provider value={contextValue}>
      {children}
    </MetaPixelContext.Provider>
  );
};

export const useMetaPixelContext = () => {
  const context = useContext(MetaPixelContext);
  if (context === undefined) {
    throw new Error('useMetaPixelContext must be used within a MetaPixelProvider');
  }
  return context;
}; 