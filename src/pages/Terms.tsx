import React from 'react';

const Terms = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] text-white p-6">
    <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-cosmic-magenta text-center">Términos y Condiciones</h1>
      <p className="mb-2 text-center text-cosmic-gold font-semibold">AYN RAND CAPITAL SL &mdash; CIF: B72705221</p>
      <p className="mb-6 text-gray-300 text-sm text-center">Última actualización: {new Date().toLocaleDateString()}</p>
      <div className="space-y-4 text-gray-200 text-justify">
        <p>Bienvenido/a a nuestra plataforma. Al acceder o utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de continuar.</p>
        <p>La empresa titular de este sitio es <span className="text-cosmic-gold font-bold">AYN RAND CAPITAL SL</span> con CIF <span className="text-cosmic-gold font-bold">B72705221</span>.</p>
        <p>El uso de este sitio web implica la aceptación de las condiciones aquí expuestas. Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
        <p>Para más información, contacta con nosotros a través de los canales oficiales indicados en la web.</p>
      </div>
    </div>
  </div>
);

export default Terms; 