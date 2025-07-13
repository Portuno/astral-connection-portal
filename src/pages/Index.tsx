
import { useAuth } from "@/components/AuthProvider";
import Landing from "./Landing";
import Home from "./Home";

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Conectando con el cosmos...</div>
      </div>
    );
  }

  // Show HOME page if user is logged in, LANDING page if not
  return user ? <Home /> : <Landing />;
};

export default Index;
