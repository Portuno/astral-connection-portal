import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

type MetaPixelEvent = 
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'Lead'
  | 'Contact'
  | 'Subscribe'
  | 'CustomEvent';

interface MetaPixelConfig {
  pixelId: string;
  events?: MetaPixelEvent[];
}

export const useMetaPixel = (config: MetaPixelConfig) => {
  useEffect(() => {
    // Initialize Meta Pixel if not already done
    if (!window.fbq) {
      // Load Meta Pixel script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://connect.facebook.net/en_US/fbevents.js`;
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize Meta Pixel
        window.fbq('init', config.pixelId);
        window.fbq('track', 'PageView');
      };
    }
  }, [config.pixelId]);

  const trackEvent = (eventName: MetaPixelEvent, parameters?: Record<string, any>) => {
    if (window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  const trackPageView = () => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  };

  const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (window.fbq) {
      window.fbq('trackCustom', eventName, parameters);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  };
}; 