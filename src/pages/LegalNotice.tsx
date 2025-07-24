import React from 'react';

const LegalNotice = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] text-white p-6">
    <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-cosmic-magenta text-center">Aviso Legal</h1>
      <p className="mb-2 text-center text-cosmic-gold font-semibold">AYN RAND CAPITAL SL &mdash; CIF: B72705221</p>
      <p className="mb-6 text-gray-300 text-sm text-center">Última actualización: {new Date().toLocaleDateString()}</p>
      <div className="space-y-6 text-gray-200 text-justify">
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Titularidad del sitio web</h2>
        <p>AYN RAND CAPITAL SL<br/>CIF: B72705221<br/>Dirección: Romani 3 1 3 Polinya, 08213 . Barcelona.<br/>Correo de contacto: clombardo196@gmail.com</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Objeto</h2>
        <p>El presente Aviso Legal regula el acceso, navegación y uso de la plataforma “Amor Astral”.</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Propiedad intelectual e industrial</h2>
        <ul className="list-disc ml-6">
          <li>Todos los contenidos, diseños, algoritmos y marcas de la plataforma son propiedad exclusiva de AYN RAND CAPITAL SL o de sus licenciantes.</li>
          <li>Queda prohibida la reproducción, distribución o comunicación pública sin autorización expresa.</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Responsabilidad</h2>
        <ul className="list-disc ml-6">
          <li>El titular no se responsabiliza del mal uso de la plataforma por parte de los usuarios.</li>
          <li>No se garantiza la ausencia de virus u otros elementos dañinos.</li>
          <li>El acceso y uso de la web se realiza bajo la exclusiva responsabilidad del usuario.</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Enlaces externos</h2>
        <p>La plataforma puede contener enlaces a sitios de terceros. AYN RAND CAPITAL SL no se responsabiliza de los contenidos ni de las políticas de privacidad de dichos sitios.</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Jurisdicción y legislación aplicable</h2>
        <p>Este Aviso Legal se rige por la legislación española y europea. Para cualquier controversia, las partes se someten a los juzgados de Barcelona.</p>
      </div>
    </div>
  </div>
);

export default LegalNotice; 