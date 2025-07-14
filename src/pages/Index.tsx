
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Landing from "./Landing";
import Home from "./Home";
import OnboardingFlow from "@/components/OnboardingFlow";
import CosmicLoadingScreen from "@/components/CosmicLoadingScreen";
import { DebugAuth } from "@/components/DebugAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setOnboardingCompleted(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setOnboardingCompleted(false);
          return;
        }

        setOnboardingCompleted(data?.onboarding_completed || false);
      } catch (error) {
        console.error('Unexpected error:', error);
        setOnboardingCompleted(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setOnboardingCompleted(true);
  };

  // Show loading state while checking authentication
  if (loading || (user && onboardingCompleted === null)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Conectando con el cosmos...</div>
      </div>
    );
  }

  // If no user, show landing page
  if (!user) {
    return (
      <>
        <DebugAuth />
        <Landing />
      </>
    );
  }

  // If showing cosmic loading screen
  if (showLoading) {
    return <CosmicLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // If user exists but hasn't completed onboarding
  if (user && onboardingCompleted === false) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // User is logged in and has completed onboarding - show home
  return (
    <>
      <DebugAuth />
      <Home />
    </>
  );
};

export default Index;
