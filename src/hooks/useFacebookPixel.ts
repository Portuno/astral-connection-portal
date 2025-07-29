import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

export const useFacebookPixel = () => {
  const eventQueue = useRef<Set<string>>(new Set());

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Prevent duplicate events in short time
      const eventKey = `${eventName}_${JSON.stringify(parameters || {})}`;
      
      if (eventQueue.current.has(eventKey)) {
        console.log(`Facebook Pixel: Event ${eventName} already tracked recently, skipping.`);
        return;
      }

      // Add to queue to prevent duplicates
      eventQueue.current.add(eventKey);
      
      // Remove from queue after 5 seconds
      setTimeout(() => {
        eventQueue.current.delete(eventKey);
      }, 5000);

      if (parameters) {
        window.fbq('track', eventName, parameters);
      } else {
        window.fbq('track', eventName);
      }
      
      console.log(`Facebook Pixel: Tracked ${eventName}`, parameters || '');
    }
  };

  const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Only track PageView once per session
      if (!sessionStorage.getItem('fbq_pageview_tracked')) {
        window.fbq('track', 'PageView');
        sessionStorage.setItem('fbq_pageview_tracked', 'true');
        console.log('Facebook Pixel: Tracked PageView');
      }
    }
  };

  // Standard Meta Pixel Events - Complete Implementation
  const trackAddToCart = (value?: number, currency?: string) => {
    trackEvent('AddToCart', value && currency ? { value, currency } : undefined);
  };

  const trackAddToWishlist = (value?: number, currency?: string) => {
    trackEvent('AddToWishlist', value && currency ? { value, currency } : undefined);
  };

  const trackAddPaymentInfo = () => {
    trackEvent('AddPaymentInfo');
  };

  const trackCompleteRegistration = () => {
    trackEvent('CompleteRegistration');
  };

  const trackContact = () => {
    trackEvent('Contact');
  };

  const trackDonate = (value?: number, currency?: string) => {
    trackEvent('Donate', value && currency ? { value, currency } : undefined);
  };

  const trackFindLocation = () => {
    trackEvent('FindLocation');
  };

  const trackInitiateCheckout = () => {
    trackEvent('InitiateCheckout');
  };

  const trackLead = () => {
    trackEvent('Lead');
  };

  const trackPurchase = (value: number, currency: string = 'USD') => {
    trackEvent('Purchase', { value, currency });
  };

  const trackSchedule = () => {
    trackEvent('Schedule');
  };

  const trackSearch = () => {
    trackEvent('Search');
  };

  const trackStartTrial = (value: string = '0.00', currency: string = 'USD', predictedLtv: string = '0.00') => {
    trackEvent('StartTrial', { value, currency, predicted_ltv: predictedLtv });
  };

  const trackSubmitApplication = () => {
    trackEvent('SubmitApplication');
  };

  const trackSubscribe = (value: string = '0.00', currency: string = 'USD', predictedLtv: string = '0.00') => {
    trackEvent('Subscribe', { value, currency, predicted_ltv: predictedLtv });
  };

  const trackViewContent = () => {
    trackEvent('ViewContent');
  };

  const trackPersonalizeProduct = () => {
    trackEvent('PersonalizeProduct');
  };

  return {
    trackEvent,
    trackPageView,
    // Complete list of standard Meta Pixel events
    trackAddToCart,
    trackAddToWishlist,
    trackAddPaymentInfo,
    trackCompleteRegistration,
    trackContact,
    trackDonate,
    trackFindLocation,
    trackInitiateCheckout,
    trackLead,
    trackPurchase,
    trackSchedule,
    trackSearch,
    trackStartTrial,
    trackSubmitApplication,
    trackSubscribe,
    trackViewContent,
    trackPersonalizeProduct,
  };
}; 