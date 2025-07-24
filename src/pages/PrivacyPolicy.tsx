import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] text-white p-6">
    <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-4 text-cosmic-magenta text-center">Política de Privacidad</h1>
      <p className="mb-2 text-center text-cosmic-gold font-semibold">AYN RAND CAPITAL SL &mdash; CIF: B72705221</p>
      <p className="mb-6 text-gray-300 text-sm text-center">Última actualización: {new Date().toLocaleDateString()}</p>
      <div className="space-y-6 text-gray-200 text-justify">
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">Responsable del tratamiento</h2>
        <p>AYN RAND CAPITAL SL<br/>CIF: B72705221<br/>[Dirección de la empresa]<br/>Contacto: [email de contacto]</p>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">1. Qué datos personales se recopilan</h2>
        <ul className="list-disc ml-6">
          <li>Nombre, apellidos y datos de perfil</li>
          <li>Correo electrónico</li>
          <li>Fecha, hora y lugar de nacimiento</li>
          <li>Información de pago (usuarios premium, gestionada por proveedores externos)</li>
          <li>Mensajes enviados en la plataforma</li>
          <li>Datos de uso y navegación (cookies, logs, IP, dispositivo)</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">2. Cómo se utilizan los datos personales</h2>
        <ul className="list-disc ml-6">
          <li>Crear y gestionar tu cuenta de usuario</li>
          <li>Calcular compatibilidades astrológicas y mostrar perfiles afines</li>
          <li>Permitir la comunicación entre usuarios (chats)</li>
          <li>Gestionar pagos y suscripciones premium</li>
          <li>Enviar notificaciones y comunicaciones relacionadas con el servicio</li>
          <li>Mejorar la experiencia de usuario y la seguridad de la plataforma</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">3. Con quién se comparten los datos personales</h2>
        <ul className="list-disc ml-6">
          <li>Proveedores de servicios de pago (por ejemplo, Square)</li>
          <li>Proveedores de hosting y almacenamiento (por ejemplo, Supabase)</li>
          <li>Autoridades legales, si es requerido por ley</li>
          <li>No vendemos ni cedemos tus datos a terceros con fines comerciales</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">4. Derechos de los usuarios</h2>
        <ul className="list-disc ml-6">
          <li>Acceso, rectificación, supresión y portabilidad de tus datos</li>
          <li>Oposición y limitación al tratamiento</li>
          <li>Retirar el consentimiento en cualquier momento</li>
          <li>Para ejercer tus derechos, contacta a: [email de contacto]</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">5. Medidas de seguridad</h2>
        <ul className="list-disc ml-6">
          <li>Cifrado de datos en tránsito y en reposo</li>
          <li>Acceso restringido a la información personal</li>
          <li>Monitorización y auditoría de accesos</li>
          <li>Actualización regular de sistemas y políticas</li>
        </ul>
        <h2 className="text-xl font-bold text-cosmic-magenta mb-2">6. Actualizaciones</h2>
        <p>La política de privacidad puede actualizarse. Notificaremos a los usuarios sobre cambios relevantes.</p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 