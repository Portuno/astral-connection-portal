import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] text-white p-6">
    <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-cosmic-magenta text-center">Política de Privacidad</h1>
      <p className="mb-2 text-center text-cosmic-gold font-semibold">AYN RAND CAPITAL SL &mdash; CIF: B72705221</p>
      <p className="mb-6 text-gray-300 text-sm text-center">Última actualización: {new Date().toLocaleDateString()}</p>
      <div className="space-y-4 text-gray-200 text-justify">
        <p>En <span className="text-cosmic-gold font-bold">AYN RAND CAPITAL SL</span> nos comprometemos a proteger tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
        <p>El responsable del tratamiento de los datos es <span className="text-cosmic-gold font-bold">AYN RAND CAPITAL SL</span> con CIF <span className="text-cosmic-gold font-bold">B72705221</span>.</p>
        <p>Solo utilizaremos tus datos para los fines indicados y conforme a la legislación vigente. Puedes ejercer tus derechos de acceso, rectificación y cancelación contactando con nosotros.</p>
        <p>Para más detalles, consulta la información ampliada en esta página o contáctanos a través de los canales oficiales.</p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 