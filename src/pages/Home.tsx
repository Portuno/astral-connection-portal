
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import UserDashboard from '@/components/UserDashboard';
import PaymentModal from '@/components/PaymentModal';

const Home = () => {
  const { user, hasPaidAccess, checkPaymentStatus } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Show payment modal if user doesn't have paid access
    if (user && !hasPaidAccess) {
      setShowPaymentModal(true);
    }
  }, [user, hasPaidAccess]);

  useEffect(() => {
    // Check payment status periodically
    const interval = setInterval(() => {
      if (user) {
        checkPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, checkPaymentStatus]);

  const handleShowPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <>
      <UserDashboard onShowPaymentModal={handleShowPaymentModal} />
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={handleClosePaymentModal} 
      />
    </>
  );
};

export default Home;
