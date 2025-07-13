
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CompactInfoSection from "@/components/CompactInfoSection";
import RegistrationForm from "@/components/RegistrationForm";
import PaymentGate from "@/components/PaymentGate";
import Footer from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/components/AuthProvider";
import UserDashboard from "@/components/UserDashboard";
import PaymentModal from "@/components/PaymentModal";

interface FormData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user } = useAuth();

  const handleDiscoverClick = () => {
    setShowAuthModal(true);
  };

  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setShowPaymentGate(true);
    // Smooth scroll to payment gate
    setTimeout(() => {
      document.getElementById('payment-gate')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowDashboard(true);
  };

  // If user chooses to see dashboard, show it
  if (showDashboard && user) {
    return (
      <>
        <UserDashboard onShowPaymentModal={() => setShowPaymentModal(true)} />
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
        />
      </>
    );
  }

  // Always show the landing page first
  return (
    <div className="content-wrapper">
      <HeroSection onDiscoverClick={handleDiscoverClick} />
      
      {!showForm && !showPaymentGate && (
        <CompactInfoSection />
      )}
      
      {showForm && !showPaymentGate && (
        <div id="registration-form">
          <RegistrationForm onSubmit={handleFormSubmit} />
        </div>
      )}
      
      {showPaymentGate && (
        <div id="payment-gate">
          <PaymentGate />
        </div>
      )}
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
