import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

export const useFacebookPixel = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      if (parameters) {
        window.fbq('track', eventName, parameters);
      } else {
        window.fbq('track', eventName);
      }
    }
  };

  const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
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

  const trackPersonalizeProduct = () => {
    trackEvent('PersonalizeProduct');
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

  const trackSearch = () => {
    trackEvent('Search');
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

  return {
    trackEvent,
    trackPageView,
    trackAddPaymentInfo,
    trackCompleteRegistration,
    trackContact,
    trackPersonalizeProduct,
    trackFindLocation,
    trackInitiateCheckout,
    trackLead,
    trackPurchase,
    trackSearch,
    trackSubmitApplication,
    trackSubscribe,
    trackViewContent,
  };
}; 