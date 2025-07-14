# 🌟 AlmaEstelar - Tu Alma Gemela Está Escrita en las Estrellas

**AlmaEstelar** es una aplicación web innovadora que combina la astrología con la tecnología moderna para ayudar a las personas a encontrar su alma gemela perfecta basándose en compatibilidad astrológica y cartas natales personalizadas.

## 🎯 ¿Qué es AlmaEstelar?

AlmaEstelar es una plataforma de compatibilidad cósmica que utiliza datos astrológicos (fecha, hora y lugar de nacimiento) para:

- **Generar cartas astrales únicas** personalizadas para cada usuario
- **Analizar compatibilidad cósmica** entre perfiles
- **Conectar almas gemelas** a través de un sistema de matching inteligente
- **Facilitar comunicación** mediante chat integrado
- **Ofrecer insights astrológicos** detallados sobre relaciones

## ✨ Características Principales

### 🔮 **Experiencia Cósmica Completa**
- **Landing Page Inmersiva**: Diseño espacial con animaciones y gradientes cósmicos
- **Onboarding Personalizado**: Captura de datos natales con interfaz intuitiva
- **Pantalla de Carga Cósmica**: Experiencia mágica mientras se procesa la información

### 🌙 **Sistema de Autenticación**
- **Registro Seguro**: Integración con Supabase para autenticación robusta
- **Gestión de Perfiles**: Sistema completo de usuarios con datos astrológicos
- **Control de Acceso**: Manejo de suscripciones y permisos

### 💫 **Funcionalidades Premium**
- **8 Perfiles Personalizados**: Matches cósmicos basados en compatibilidad astral
- **Chat Ilimitado**: Comunicación directa con matches compatibles
- **Análisis Detallado**: Compatibilidad astral profunda
- **Dashboard Personal**: Panel de control con toda la información cósmica

### 💳 **Sistema de Pagos**
- **Integración con Square**: Procesamiento seguro de pagos
- **Suscripción Premium**: Acceso completo por €29.90
- **Gestión de Suscripciones**: Control automático de acceso premium

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** - Biblioteca principal para UI
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool rápido y moderno
- **Tailwind CSS** - Framework de estilos utility-first
- **Shadcn/ui** - Componentes de UI modernos y accesibles

### **Backend & Database**
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de filas

### **Estado & Routing**
- **React Query** - Gestión de estado del servidor
- **React Router** - Enrutamiento del lado del cliente
- **React Hook Form** - Manejo de formularios

### **UI/UX**
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconografía moderna
- **Framer Motion** - Animaciones (implícitas en CSS)

## 🚀 Instalación y Configuración Local

### **Prerrequisitos**
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Supabase (para desarrollo)

### **Pasos de Instalación**

1. **Clona el repositorio**
```bash
git clone https://gitlab.com/capital-worldwide-ecommerce-group-mvp/mvp-capital.git
cd mvp-capital
```

2. **Instala las dependencias**
```bash
npm install
# o
yarn install
```

3. **Configuración de Variables de Entorno**
```bash
# Crea un archivo .env.local en la raíz del proyecto
cp .env.example .env.local
```

**Variables necesarias en `.env.local`:**
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configuración de Base de Datos**
```bash
# Si tienes Supabase CLI instalado
supabase db reset

# O ejecuta las migraciones manualmente en tu dashboard de Supabase
# usando los archivos en /supabase/migrations/
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

6. **Abre en tu navegador**
```
http://localhost:5173
```

## 📁 Estructura del Proyecto

```
astrotarot/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes UI base (Shadcn)
│   │   ├── AuthModal.tsx    # Modal de autenticación
│   │   ├── AuthProvider.tsx # Contexto de autenticación
│   │   ├── ChatInterface.tsx # Sistema de chat
│   │   ├── OnboardingFlow.tsx # Flujo de registro
│   │   ├── PaymentGate.tsx  # Control de acceso premium
│   │   └── ...
│   ├── pages/               # Páginas principales
│   │   ├── Landing.tsx      # Página de aterrizaje
│   │   ├── Home.tsx         # Dashboard de usuario
│   │   └── Index.tsx        # Controlador principal
│   ├── integrations/        # Integraciones externas
│   │   └── supabase/        # Configuración de Supabase
│   ├── hooks/               # Custom hooks
│   └── lib/                 # Utilidades
├── supabase/                # Configuración de base de datos
│   ├── migrations/          # Migraciones SQL
│   └── config.toml         # Configuración local
└── public/                  # Archivos estáticos
```

## 🎨 Componentes Principales

### **AuthProvider**
- Gestión global de autenticación
- Control de estado de usuario
- Verificación de suscripciones premium

### **OnboardingFlow**
- Captura de datos natales
- Validación de formularios
- Progreso visual del proceso

### **ChatInterface**
- Sistema de mensajería en tiempo real
- Gestión de conversaciones
- UI responsive para mobile y desktop

### **PaymentGate**
- Control de acceso premium
- Integración con Square Payments
- Manejo de estados de suscripción

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Build para producción
npm run build:dev    # Build en modo desarrollo

# Calidad de Código
npm run lint         # Ejecuta ESLint

# Preview
npm run preview      # Preview del build de producción
```

## 🌐 Despliegue

### **Producción**
El proyecto está configurado para desplegarse fácilmente en:
- **Vercel** (recomendado)
- **Netlify**
- **Cloudflare Pages**

### **Variables de Entorno en Producción**
Asegúrate de configurar las siguientes variables:
```env
VITE_SUPABASE_URL=tu_supabase_url_produccion
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_produccion
```

## 📊 Base de Datos

### **Tablas Principales**
- **profiles** - Perfiles de usuario con datos astrológicos
- **user_registrations** - Registro inicial de usuarios
- **chat_messages** - Sistema de mensajería
- **subscriptions** - Control de suscripciones premium

### **Migraciones**
Las migraciones se encuentran en `/supabase/migrations/` y deben ejecutarse en orden cronológico.

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- **Autenticación JWT** con Supabase
- **Validación de datos** en frontend y backend
- **Control de acceso** basado en suscripciones

## 🎨 Diseño y UX

### **Paleta de Colores**
- **Primarios**: Gradientes púrpura, rosa y azul
- **Secundarios**: Blancos con opacidad para efecto glassmorphism
- **Acentos**: Dorado y naranja para elementos destacados

### **Tipografía**
- **Fuente Principal**: Sistema por defecto optimizada
- **Iconos**: Emojis cósmicos y Lucide React
- **Animaciones**: CSS personalizadas con efectos cósmicos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📈 Próximas Funcionalidades

- [ ] **Sistema de Matches Avanzado**: Algoritmo de compatibilidad mejorado
- [ ] **Notificaciones Push**: Alertas de nuevos matches y mensajes
- [ ] **Análisis Astrológico Profundo**: Informes detallados de compatibilidad
- [ ] **Video Chat**: Comunicación cara a cara
- [ ] **Eventos Cósmicos**: Calendario de eventos astrológicos
- [ ] **Aplicación Móvil**: Versión nativa para iOS y Android

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- **Email**: soporte@almaestelar.com
- **Issues**: Usa el sistema de issues de GitLab

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**✨ Hecho con magia cósmica y tecnología moderna ✨**

*"Tu alma gemela está escrita en las estrellas, nosotros solo te ayudamos a leer el mapa."*
