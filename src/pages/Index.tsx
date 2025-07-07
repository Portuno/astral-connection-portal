
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CompactInfoSection from "@/components/CompactInfoSection";
import RegistrationForm from "@/components/RegistrationForm";
import PaymentGate from "@/components/PaymentGate";
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
  const [showPaymentGate, setShowPaymentGate] = useState(false);

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
    setShowPaymentGate(true);
    // Smooth scroll to payment gate
    setTimeout(() => {
      document.getElementById('payment-gate')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

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
    </div>
  );
};

export default Index;
