
const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Floating cosmic elements */}
      <div className="absolute top-8 left-4 sm:top-12 sm:left-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-16 right-6 sm:top-20 sm:right-12 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-25" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-12 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-20" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Links */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-white/70">
            <a href="#" className="hover:text-white transition-colors duration-300 text-sm sm:text-base hover:scale-105 transform">
              Términos y condiciones
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 text-sm sm:text-base hover:scale-105 transform">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 text-sm sm:text-base hover:scale-105 transform">
              Contacto
            </a>
          </div>
          
          {/* Logo */}
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-glow shadow-2xl">
              <span className="text-lg sm:text-xl lg:text-2xl animate-float">⭐</span>
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs animate-bounce opacity-80">
              ✨
            </div>
          </div>
          
          {/* Copyright */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              © 2025 AlmaEstelar. Todos los derechos reservados.
            </p>
            <p className="text-white/40 text-xs leading-relaxed px-4">
              🌟 Conectando almas a través del cosmos desde 2025 🌟
            </p>
          </div>

          {/* Cosmic divider */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 pt-2 sm:pt-4">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
            <span className="text-purple-300 text-xs sm:text-sm opacity-60">✦</span>
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
