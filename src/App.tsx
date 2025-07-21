
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import ChatInterface from "./components/ChatInterface";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import PremiumCheckout from "./components/PremiumCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:profileId" element={<ChatInterface />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/premium" element={<PremiumCheckout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
