
import UserDashboard from "@/components/UserDashboard";
import PaymentModal from "@/components/PaymentModal";
import { useState } from "react";

const Home = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <UserDashboard onShowPaymentModal={() => setShowPaymentModal(true)} />
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
};

export default Home;
