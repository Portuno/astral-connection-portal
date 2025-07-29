# Implementación de Facebook Pixel en Amor Astral

## Resumen

Se ha implementado el píxel de Facebook (ID: 1515946322709140) en el sitio web de Amor Astral con el código base en todas las páginas y eventos específicos en páginas concretas.

## Código Base Implementado

El código base del píxel ya está implementado en `index.html` y se ejecuta en todas las páginas del sitio web.

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
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1515946322709140&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

## Hook Personalizado

Se ha creado un hook personalizado `useFacebookPixel` en `src/hooks/useFacebookPixel.ts` que proporciona funciones para rastrear todos los eventos estándar de Facebook:

- `trackPageView()` - Vista de página
- `trackAddPaymentInfo()` - Información de pago añadida
- `trackCompleteRegistration()` - Registro completado
- `trackContact()` - Contacto
- `trackPersonalizeProduct()` - Personalizar producto
- `trackFindLocation()` - Buscar ubicación
- `trackInitiateCheckout()` - Finalización de compra iniciada
- `trackLead()` - Cliente potencial
- `trackPurchase(value, currency)` - Comprar
- `trackSearch()` - Buscar
- `trackSubmitApplication()` - Enviar solicitud
- `trackSubscribe(value, currency, predictedLtv)` - Suscribirse
- `trackViewContent()` - Ver contenido

## Eventos Implementados

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

## Componente de Seguimiento Avanzado

Se ha creado un componente `FacebookPixelTracker` en `src/components/FacebookPixelTracker.tsx` para casos de uso más avanzados donde se necesite rastrear eventos basados en condiciones específicas.

## Beneficios de la Implementación

1. **Seguimiento Completo:** Todos los eventos importantes del funnel de conversión están cubiertos
2. **Optimización de Anuncios:** Los datos permitirán optimizar campañas para conversiones específicas
3. **Audiencias Personalizadas:** Se pueden crear audiencias basadas en comportamientos específicos
4. **Análisis de Conversión:** Mejor comprensión del journey del usuario
5. **ROI Mejorado:** Optimización de presupuesto publicitario basada en datos reales

## Próximos Pasos Recomendados

1. **Verificar Implementación:** Usar Facebook Pixel Helper para verificar que todos los eventos se disparan correctamente
2. **Configurar Conversiones:** Configurar los eventos como conversiones en Facebook Ads Manager
3. **Crear Audiencias:** Crear audiencias personalizadas basadas en los eventos rastreados
4. **Optimización Continua:** Monitorear y ajustar la implementación según los resultados

## Notas Técnicas

- Todos los eventos incluyen verificación de que `window.fbq` existe antes de ejecutarse
- Los eventos se ejecutan solo en el lado del cliente (browser)
- Se mantiene la compatibilidad con SSR/SSG
- Los valores de compra están hardcodeados pero pueden ser dinámicos según el plan seleccionado 