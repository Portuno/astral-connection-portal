
const Footer = () => {
  return (
    <footer className="py-16 px-6 relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-white/70">
            <a href="#" className="hover:text-white transition-colors">
              Términos y condiciones
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>
          
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          
          <p className="text-white/60 text-sm">
            © 2025 AlmaEstelar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
