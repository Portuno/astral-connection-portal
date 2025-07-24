
import { Toaster } from "@/components/ui/toaster";
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
import ProfileEdit from "./pages/ProfileEdit";
import ProfilePage from "./pages/Profile";
import { useAuth } from "./components/AuthProvider";
import PreHome from "./pages/PreHome";
import Preloading from "./pages/Preloading";
import Premium from "./pages/Premium";
import PaymentSuccess from "./pages/PaymentSuccess";
import Diagnostic from "./pages/Diagnostic";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";

const queryClient = new QueryClient();

const OnboardingWrapper = () => {
  const { user } = useAuth();
  return <Onboarding userId={user?.id} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/prehome" element={<PreHome />} />
            <Route path="/preloading" element={<Preloading />} />
            <Route path="/onboarding" element={<OnboardingWrapper />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:profileId" element={<ChatInterface />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/profile/:profileId" element={<ProfilePage />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <footer className="w-full py-6 flex flex-col items-center gap-2 bg-transparent text-gray-300 text-sm">
        <div className="flex gap-4">
          <a href="/terms" className="hover:text-cosmic-magenta underline focus:outline-none focus:ring-2 focus:ring-cosmic-magenta" tabIndex={0} aria-label="Términos y Condiciones">Términos</a>
          <a href="/privacy-policy" className="hover:text-cosmic-magenta underline focus:outline-none focus:ring-2 focus:ring-cosmic-magenta" tabIndex={0} aria-label="Política de Privacidad">Política de Privacidad</a>
          <a href="/legal-notice" className="hover:text-cosmic-magenta underline focus:outline-none focus:ring-2 focus:ring-cosmic-magenta" tabIndex={0} aria-label="Aviso Legal">Aviso Legal</a>
        </div>
        <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} AYN RAND CAPITAL SL</div>
      </footer>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
