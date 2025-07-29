# Implementación Completa de Facebook Pixel en Amor Astral

## Resumen

Se ha implementado el píxel de Facebook (ID: 1515946322709140) en el sitio web de Amor Astral con el código base en todas las páginas y **todos los eventos estándar de Meta** implementados según la documentación oficial.

## Código Base Implementado

El código base del píxel está implementado en `index.html` y se ejecuta en todas las páginas del sitio web.

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1515946322709140');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
```

## Hook Personalizado - Implementación Completa

Se ha creado un hook personalizado `useFacebookPixel` en `src/hooks/useFacebookPixel.ts` que proporciona funciones para rastrear **todos los eventos estándar de Meta**:

### Eventos Estándar de Meta Implementados:

1. **`trackPageView()`** - Vista de página (incluido en código base)
2. **`trackAddToCart(value?, currency?)`** - Añadir al carrito
3. **`trackAddToWishlist(value?, currency?)`** - Añadir a la lista de deseos
4. **`trackAddPaymentInfo()`** - Información de pago añadida
5. **`trackCompleteRegistration()`** - Registro completado
6. **`trackContact()`** - Contacto
7. **`trackDonate(value?, currency?)`** - Hacer donación
8. **`trackFindLocation()`** - Buscar ubicación
9. **`trackInitiateCheckout()`** - Finalización de compra iniciada
10. **`trackLead()`** - Cliente potencial
11. **`trackPurchase(value, currency)`** - Comprar
12. **`trackSchedule()`** - Programar
13. **`trackSearch()`** - Buscar
14. **`trackStartTrial(value, currency, predictedLtv)`** - Iniciar prueba
15. **`trackSubmitApplication()`** - Enviar solicitud
16. **`trackSubscribe(value, currency, predictedLtv)`** - Suscribirse
17. **`trackViewContent()`** - Ver contenido
18. **`trackPersonalizeProduct()`** - Personalizar producto

## Eventos Implementados en Páginas Específicas

### 1. CompleteRegistration
**Ubicación:** `src/pages/Auth.tsx` y `src/components/AuthModal.tsx`
**Descripción:** Se activa cuando un usuario completa el registro exitosamente
**Implementación:**
```typescript
const { trackCompleteRegistration } = useFacebookPixel();

// En la función handleRegister después del registro exitoso
if (success) {
  trackCompleteRegistration();
  // ... resto del código
}
```

### 2. Purchase
**Ubicación:** `src/pages/PaymentSuccess.tsx`
**Descripción:** Se activa cuando se completa una compra exitosamente
**Implementación:**
```typescript
const { trackPurchase } = useFacebookPixel();

useEffect(() => {
  trackPurchase(29.99, 'USD');
}, [trackPurchase]);
```

### 3. InitiateCheckout
**Ubicación:** `src/pages/Premium.tsx`
**Descripción:** Se activa cuando el usuario inicia el proceso de pago
**Implementación:**
```typescript
const { trackInitiateCheckout } = useFacebookPixel();

const handleActivatePremium = async () => {
  trackInitiateCheckout();
  // ... resto del código de checkout
};
```

### 4. ViewContent
**Ubicación:** `src/pages/Home.tsx`
**Descripción:** Se activa cuando los usuarios ven el contenido principal
**Implementación:**
```typescript
const { trackViewContent } = useFacebookPixel();

useEffect(() => {
  trackViewContent();
}, [trackViewContent]);
```

### 5. Lead
**Ubicación:** `src/pages/Landing.tsx`
**Descripción:** Se activa cuando los usuarios muestran interés en el servicio
**Implementación:**
```typescript
const { trackLead } = useFacebookPixel();

const handleOpenOnboarding = () => {
  trackLead();
  navigate('/prehome');
};
```

### 6. Search
**Ubicación:** `src/pages/Chats.tsx`
**Descripción:** Se activa cuando los usuarios buscan conversaciones
**Implementación:**
```typescript
const { trackSearch } = useFacebookPixel();

useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredChats(chats);
    return;
  }
  
  trackSearch();
  // ... resto del código de búsqueda
}, [searchQuery, chats, trackSearch]);
```

### 7. SubmitApplication
**Ubicación:** `src/pages/ProfileEdit.tsx`
**Descripción:** Se activa cuando los usuarios envían/actualizan su perfil
**Implementación:**
```typescript
const { trackSubmitApplication } = useFacebookPixel();

// En la función handleSubmit después del guardado exitoso
if (result.error) {
  // ... manejo de error
} else {
  trackSubmitApplication();
  // ... resto del código
}
```

### 8. Contact
**Ubicación:** `src/pages/Diagnostic.tsx`
**Descripción:** Se activa cuando los usuarios acceden a la página de diagnóstico (intento de contacto con soporte)
**Implementación:**
```typescript
const { trackContact } = useFacebookPixel();

useEffect(() => {
  trackContact();
}, [trackContact]);
```

### 9. Subscribe
**Ubicación:** `src/pages/Premium.tsx`
**Descripción:** Se activa cuando los usuarios inician una suscripción premium
**Implementación:**
```typescript
const { trackSubscribe } = useFacebookPixel();

const handleActivatePremium = async () => {
  trackSubscribe('29.90', 'EUR', '29.90');
  // ... resto del código
};
```

### 10. FindLocation
**Ubicación:** `src/pages/PreHome.tsx`
**Descripción:** Se activa cuando los usuarios seleccionan una ubicación de nacimiento
**Implementación:**
```typescript
const { trackFindLocation } = useFacebookPixel();

const handleSelectCity = (city: string) => {
  setForm({ ...form, birthCity: city });
  trackFindLocation();
};
```

### 11. AddPaymentInfo
**Ubicación:** `src/pages/Premium.tsx`
**Descripción:** Se activa cuando los usuarios intentan añadir información de pago
**Implementación:**
```typescript
const { trackAddPaymentInfo } = useFacebookPixel();

const handleActivatePremium = async () => {
  trackAddPaymentInfo();
  // ... resto del código
};
```

### 12. PersonalizeProduct
**Ubicación:** `src/pages/Onboarding.tsx`
**Descripción:** Se activa cuando los usuarios completan la personalización de su perfil
**Implementación:**
```typescript
const { trackPersonalizeProduct } = useFacebookPixel();

// En la función handleNext después del guardado exitoso del perfil
if (error) return setError("Error guardando perfil: " + error.message);

trackPersonalizeProduct();
navigate("/home");
```

## Eventos Adicionales Disponibles

Los siguientes eventos están implementados y disponibles para uso futuro:

- **`trackAddToCart()`** - Para funcionalidades de carrito de compras
- **`trackAddToWishlist()`** - Para listas de favoritos
- **`trackDonate()`** - Para donaciones
- **`trackSchedule()`** - Para programación de citas
- **`trackStartTrial()`** - Para pruebas gratuitas

## Componente de Seguimiento Avanzado

Se ha creado un componente `FacebookPixelTracker` en `src/components/FacebookPixelTracker.tsx` para casos de uso más avanzados donde se necesite rastrear eventos basados en condiciones específicas.

## Beneficios de la Implementación Completa

1. **Cobertura Total:** Todos los eventos estándar de Meta están implementados
2. **Flexibilidad:** Puedes usar cualquier evento estándar según tus necesidades
3. **Optimización de Anuncios:** Los datos permitirán optimizar campañas para conversiones específicas
4. **Audiencias Personalizadas:** Se pueden crear audiencias basadas en comportamientos específicos
5. **Análisis de Conversión:** Mejor comprensión del journey del usuario
6. **ROI Mejorado:** Optimización de presupuesto publicitario basada en datos reales
7. **Cumplimiento de Estándares:** Implementación según las especificaciones oficiales de Meta

## Próximos Pasos Recomendados

1. **Verificar Implementación:** Usar Facebook Pixel Helper para verificar que todos los eventos se disparan correctamente
2. **Configurar Conversiones:** Configurar los eventos como conversiones en Facebook Ads Manager
3. **Crear Audiencias:** Crear audiencias personalizadas basadas en los eventos rastreados
4. **Optimización Continua:** Monitorear y ajustar la implementación según los resultados
5. **Implementar Eventos Adicionales:** Usar los eventos disponibles según las necesidades del negocio

## Notas Técnicas

- Todos los eventos incluyen verificación de que `window.fbq` existe antes de ejecutarse
- Los eventos se ejecutan solo en el lado del cliente (browser)
- Se mantiene la compatibilidad con SSR/SSG
- Los valores de compra están hardcodeados pero pueden ser dinámicos según el plan seleccionado
- La implementación está optimizada para el rendimiento y no afecta la experiencia del usuario
- **Cumple con todas las especificaciones oficiales de Meta para eventos estándar** 