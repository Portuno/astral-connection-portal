
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";
import WelcomeSection from "@/components/WelcomeSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

interface FormData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleDiscoverClick = () => {
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById('registration-form')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setShowWelcome(true);
    // Smooth scroll to welcome section
    setTimeout(() => {
      document.getElementById('welcome-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="content-wrapper">
      <HeroSection onDiscoverClick={handleDiscoverClick} />
      
      {showForm && (
        <div id="registration-form">
          <RegistrationForm onSubmit={handleFormSubmit} />
        </div>
      )}
      
      {showWelcome && (
        <div id="welcome-section">
          <WelcomeSection />
        </div>
      )}
      
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
