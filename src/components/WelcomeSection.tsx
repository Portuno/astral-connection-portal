
import { Card } from "@/components/ui/card";

const WelcomeSection = () => {
  return (
    <section className="py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <Card className="glass-card p-4 md:p-6 text-center space-y-4 md:space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">✨</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Tu carta ha sido leída
            </h2>
            
            <p className="text-lg font-medium text-white/90">
              Ya sabemos quién es tu alma gemela.
            </p>
            
            <p className="text-sm text-white/70">
              Para poder ver y hablar con ella, activa tu suscripción.
            </p>
          </div>

          <div className="space-y-3">
            {/* Square Payment Button */}
            <div className="w-full flex justify-center">
              <div style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                maxWidth: "300px",
                background: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                borderRadius: "16px",
                fontFamily: "Karla, SQ Market, Helvetica, Arial, sans-serif"
              }}>
                <div style={{ padding: "20px", width: "100%" }}>
                  <p style={{
                    fontSize: "18px",
                    lineHeight: "20px",
                    color: "#1a1f3a",
                    marginBottom: "8px",
                    textAlign: "center"
                  }}>AstroTarot</p>
                  <p style={{
                    fontSize: "18px",
                    lineHeight: "20px",
                    fontWeight: "600",
                    color: "#1a1f3a",
                    marginBottom: "16px",
                    textAlign: "center"
                  }}>29,90&nbsp;€</p>
                  <a 
                    target="_blank" 
                    href="https://square.link/u/NuZ4xbVI?src=embed" 
                    style={{
                      display: "inline-block",
                      fontSize: "18px",
                      lineHeight: "48px",
                      height: "48px",
                      color: "#ffffff",
                      width: "100%",
                      backgroundColor: "#cc0023",
                      textAlign: "center",
                      boxShadow: "0 0 0 1px rgba(0,0,0,.1) inset",
                      borderRadius: "50px",
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#a8001d";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#cc0023";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Comprar ahora
                  </a>
                </div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla" />
              </div>
            </div>
            
            <p className="text-xs text-white/60">
              Pago seguro mediante Square. Puedes cancelar cuando quieras.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default WelcomeSection;
