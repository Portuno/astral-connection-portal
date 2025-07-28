import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMetaPixelContext } from './MetaPixelProvider';

interface MetaPixelTrackerProps {
  eventName?: string;
  parameters?: Record<string, any>;
  trackPageView?: boolean;
}

export const MetaPixelTracker: React.FC<MetaPixelTrackerProps> = ({
  eventName,
  parameters,
  trackPageView = true,
}) => {
  const { trackEvent, trackPageView: trackPageViewEvent } = useMetaPixelContext();
  const location = useLocation();

  useEffect(() => {
    // Track page view when component mounts
    if (trackPageView) {
      trackPageViewEvent();
    }

    // Track custom event if provided
    if (eventName) {
      trackEvent(eventName, parameters);
    }
  }, [location.pathname, eventName, parameters, trackPageView, trackPageViewEvent, trackEvent]);

  return null; // This component doesn't render anything
};

// Hook for easy event tracking
export const useMetaPixelTracking = () => {
  const { trackEvent, trackCustomEvent } = useMetaPixelContext();

  const trackRegistration = (userId: string) => {
    trackEvent('CompleteRegistration', {
      content_name: 'User Registration',
      content_category: 'Account',
      value: 1,
      currency: 'USD',
      user_id: userId,
    });
  };

  const trackPurchase = (amount: number, currency: string = 'USD') => {
    trackEvent('Purchase', {
      value: amount,
      currency: currency,
      content_category: 'Premium Subscription',
    });
  };

  const trackLead = (source: string) => {
    trackEvent('Lead', {
      content_name: 'Lead Generation',
      content_category: 'Conversion',
      source: source,
    });
  };

  const trackChatStarted = (profileId: string) => {
    trackCustomEvent('ChatStarted', {
      profile_id: profileId,
      content_category: 'Chat',
    });
  };

  const trackProfileView = (profileId: string) => {
    trackCustomEvent('ProfileView', {
      profile_id: profileId,
      content_category: 'Profile',
    });
  };

  return {
    trackRegistration,
    trackPurchase,
    trackLead,
    trackChatStarted,
    trackProfileView,
    trackEvent,
    trackCustomEvent,
  };
}; 