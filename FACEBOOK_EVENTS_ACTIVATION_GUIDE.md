# Guía de Activación de Eventos de Facebook Pixel

## 🎯 **Problema Identificado**

✅ **Pixel configurado** - Facebook lo detecta  
✅ **Eventos implementados** - En tu código funcionan  
❌ **Eventos no activados** - Facebook no los reconoce para conversiones  

## 🔧 **Solución: Activar Eventos en Facebook**

### **Paso 1: Ir a Events Manager**
1. Ve a [Facebook Business Manager](https://business.facebook.com/)
2. Navega a **Events Manager**
3. Haz clic en tu pixel `1515946322709140`

### **Paso 2: Ir a "Probar eventos"**
1. Ve a la pestaña **"Probar eventos"**
2. Haz clic en **"Crear evento de prueba"**

### **Paso 3: Enviar Eventos de Prueba**
Abre tu sitio web `https://www.amorastral.com/` y en la consola (F12) ejecuta:

```javascript
// Copia y pega estos comandos uno por uno:

// 1. PageView (ya debería estar activo)
fbq('track', 'PageView');

// 2. CompleteRegistration
fbq('track', 'CompleteRegistration');

// 3. Lead
fbq('track', 'Lead');

// 4. Purchase
fbq('track', 'Purchase', {value: 29.99, currency: 'USD'});

// 5. InitiateCheckout
fbq('track', 'InitiateCheckout');

// 6. Subscribe
fbq('track', 'Subscribe', {value: '29.90', currency: 'EUR', predicted_ltv: '29.90'});

// 7. AddPaymentInfo
fbq('track', 'AddPaymentInfo');

// 8. ViewContent
fbq('track', 'ViewContent');

// 9. Search
fbq('track', 'Search');

// 10. SubmitApplication
fbq('track', 'SubmitApplication');

// 11. Contact
fbq('track', 'Contact');

// 12. FindLocation
fbq('track', 'FindLocation');

// 13. PersonalizeProduct
fbq('track', 'PersonalizeProduct');
```

### **Paso 4: Verificar en Events Manager**
1. **Regresa a Facebook Events Manager**
2. **Ve a "Probar eventos"**
3. **Espera 1-2 minutos**
4. **Verifica** que los eventos aparecen en la lista

### **Paso 5: Activar Eventos para Conversiones**
Una vez que los eventos aparecen en "Probar eventos":

1. **Ve a la pestaña "Eventos"**
2. **Haz clic en "Añadir eventos"**
3. **Selecciona los eventos** que quieres activar:
   - `CompleteRegistration`
   - `Purchase`
   - `Lead`
   - `InitiateCheckout`
   - `Subscribe`
   - etc.

## 📊 **Eventos Principales para Amor Astral**

### **Eventos de Conversión (Más Importantes):**
1. **`CompleteRegistration`** - Registro de usuarios
2. **`Purchase`** - Compra de suscripción premium
3. **`Lead`** - Interés inicial en el servicio
4. **`InitiateCheckout`** - Inicio del proceso de pago
5. **`Subscribe`** - Suscripción premium

### **Eventos de Engagement:**
6. **`ViewContent`** - Ver contenido principal
7. **`Search`** - Búsqueda en el sitio
8. **`Contact`** - Contacto con soporte
9. **`FindLocation`** - Selección de ubicación
10. **`PersonalizeProduct`** - Personalización de perfil

## 🧪 **Verificación de Eventos**

### **Método 1: Facebook Pixel Helper**
1. **Instala Facebook Pixel Helper** (extensión de Chrome)
2. **Ve a tu sitio** `www.amorastral.com`
3. **Haz clic en el icono** de Pixel Helper
4. **Verifica** que los eventos aparecen

### **Método 2: Network Tab**
1. **Abre Developer Tools** (F12)
2. **Ve a Network tab**
3. **Filtra por "facebook"**
4. **Navega por tu sitio** o dispara eventos
5. **Busca requests** a `facebook.com/tr`

### **Método 3: Console Test**
```javascript
// En la consola de tu sitio
console.log(window.fbq); // Debería mostrar una función

// Test eventos
fbq('track', 'CompleteRegistration');
fbq('track', 'Lead');
fbq('track', 'Purchase', {value: 29.99, currency: 'USD'});
```

## ✅ **Resultado Esperado**

Después de activar los eventos:

✅ **Los eventos aparecen** en "Probar eventos"  
✅ **Puedes configurar conversiones** en Ads Manager  
✅ **Facebook Pixel Helper** muestra eventos activos  
✅ **Puedes crear audiencias** basadas en eventos  
✅ **Puedes optimizar campañas** para conversiones  

## 🚀 **Próximos Pasos Después de Activación**

### **1. Configurar Conversiones en Ads Manager**
1. Ve a **Ads Manager**
2. **Crea una campaña** o edita una existente
3. **En "Optimización"** selecciona tu evento (ej: `CompleteRegistration`)
4. **Facebook optimizará** para ese evento

### **2. Crear Audiencias Personalizadas**
1. Ve a **Audience Manager**
2. **Crea audiencia personalizada**
3. **Selecciona eventos** como fuente
4. **Usa para remarketing**

### **3. Monitorear Rendimiento**
1. **Ve a Events Manager**
2. **Revisa la pestaña "Eventos"**
3. **Monitorea** qué eventos se disparan más
4. **Optimiza** según los datos

## 🔍 **Troubleshooting**

### **Si los eventos no aparecen:**
1. **Verifica que no hay ad blockers** activos
2. **Prueba en modo incógnito**
3. **Espera 5-10 minutos** para que aparezcan
4. **Verifica que el pixel ID** es correcto: `1515946322709140`

### **Si los eventos aparecen pero no se activan:**
1. **Asegúrate de enviar** suficientes eventos de prueba
2. **Espera 24-48 horas** para que Facebook procese
3. **Contacta soporte** de Facebook si persiste

## 📈 **Beneficios Después de Activación**

- **Optimización automática** de campañas para conversiones
- **Audiencias más precisas** basadas en comportamiento real
- **Mejor ROI** en publicidad
- **Datos más precisos** para toma de decisiones
- **Remarketing efectivo** a usuarios que han mostrado interés

**¡Tu implementación está perfecta! Solo necesitas activar los eventos en Facebook.** 🎯 