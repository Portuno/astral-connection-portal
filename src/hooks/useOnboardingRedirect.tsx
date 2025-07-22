import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useOnboardingRedirect = (userId: string | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const checkProfile = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (
        profile &&
        profile.is_premium &&
        (
          !profile.age ||
          !profile.sign ||
          !profile.photo_url
        )
      ) {
        navigate("/onboarding");
      }
    };
    checkProfile();
  }, [userId, navigate]);
}; 