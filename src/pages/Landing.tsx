
import HeroSection from "@/components/HeroSection";
import CompactInfoSection from "@/components/CompactInfoSection";
import Footer from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

const Landing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDiscoverClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="content-wrapper">
      <HeroSection onDiscoverClick={handleDiscoverClick} />
      <CompactInfoSection />
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Landing;
