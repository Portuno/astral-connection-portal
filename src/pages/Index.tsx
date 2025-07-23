
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir inmediatamente a la página de landing
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-blue text-white">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 border-4 border-cosmic-magenta border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xl">Cargando Amor Astral...</p>
      </div>
    </div>
  );
};

export default Index;
