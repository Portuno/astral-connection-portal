import React from 'react';

const Terms = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] text-white p-6">
    <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-cosmic-magenta text-center">Términos y Condiciones</h1>
      <p className="mb-2 text-center text-cosmic-gold font-semibold">AYN RAND CAPITAL SL &mdash; CIF: B72705221</p>
      <p className="mb-6 text-gray-300 text-sm text-center">Última actualización: {new Date().toLocaleDateString()}</p>
      <div className="space-y-6 text-gray-200 text-justify">
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Titular de la plataforma</h2>
        <p>AYN RAND CAPITAL SL<br/>CIF: B72705221<br/>Dirección: Romani 3 1 3 Polinya, 08213 . Barcelona.<br/>Correo de contacto: clombardo196@gmail.com</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">1. Objeto</h2>
        <p>Estos términos regulan el acceso y uso de la plataforma de compatibilidad y chat astrológico “Amor Astral”.</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">2. Condiciones de uso</h2>
        <ul className="list-disc ml-6">
          <li>El usuario debe ser mayor de 18 años.</li>
          <li>El usuario se compromete a proporcionar información veraz y actualizada.</li>
          <li>No se permite el uso de la plataforma para fines ilícitos, ofensivos o fraudulentos.</li>
          <li>El usuario es responsable de la confidencialidad de sus credenciales.</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">3. Servicios ofrecidos</h2>
        <ul className="list-disc ml-6">
          <li>Creación de perfil astrológico y búsqueda de compatibilidades</li>
          <li>Chat entre usuarios registrados</li>
          <li>Acceso a funciones premium mediante suscripción</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">4. Propiedad intelectual</h2>
        <ul className="list-disc ml-6">
          <li>Todos los contenidos, marcas y algoritmos son propiedad de AYN RAND CAPITAL SL.</li>
          <li>Queda prohibida la reproducción total o parcial sin autorización.</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">5. Exclusión de responsabilidad</h2>
        <ul className="list-disc ml-6">
          <li>La plataforma no garantiza la veracidad de los datos aportados por los usuarios.</li>
          <li>No se garantiza el éxito en la búsqueda de pareja o amistad.</li>
          <li>No nos responsabilizamos de los daños derivados del uso indebido de la plataforma.</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">6. Suspensión y cancelación</h2>
        <p>Nos reservamos el derecho de suspender o cancelar cuentas que incumplan estos términos.</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">7. Legislación aplicable</h2>
        <p>Estos términos se rigen por la legislación española y europea. Para cualquier controversia, las partes se someten a los juzgados de Barcelona.</p>
      </div>
    </div>
  </div>
);

export default Terms; 