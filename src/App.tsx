
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
import ProfileEdit from "./pages/ProfileEdit";
import ProfilePage from "./pages/Profile";
import { useAuth } from "./components/AuthProvider";
import PreHome from "./pages/PreHome";
import Preloading from "./pages/Preloading";

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
        <Sonner />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
