import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

interface FacebookPixelTrackerProps {
  eventName: string;
  parameters?: Record<string, any>;
  triggerOnMount?: boolean;
  triggerOnCondition?: boolean;
}

export const FacebookPixelTracker = ({ 
  eventName, 
  parameters, 
  triggerOnMount = false,
  triggerOnCondition = false 
}: FacebookPixelTrackerProps) => {
  const { trackEvent } = useFacebookPixel();

  useEffect(() => {
    if (triggerOnMount || triggerOnCondition) {
      trackEvent(eventName, parameters);
    }
  }, [eventName, parameters, triggerOnMount, triggerOnCondition, trackEvent]);

  return null; // Este componente no renderiza nada
};

export default FacebookPixelTracker; 