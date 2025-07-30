-- Actualización del precio de Stripe de 29,90€ a 9,90€
-- Este archivo documenta los cambios necesarios para actualizar el precio

-- PASOS PARA ACTUALIZAR EL PRECIO EN STRIPE:

-- 1. Ir a https://dashboard.stripe.com/products
-- 2. Crear un nuevo producto o actualizar el existente
-- 3. Configurar el precio a 9,90€ por mes
-- 4. Copiar el nuevo Price ID (empieza con 'price_')
-- 5. Actualizar la variable de entorno STRIPE_PRICE_ID en Supabase Dashboard

-- CAMBIOS REALIZADOS EN EL CÓDIGO:
-- ✅ src/pages/Premium.tsx: Cambiado tracking de Facebook Pixel de '29.90' a '9.90'
-- ✅ src/pages/Premium.tsx: Cambiado texto del botón de "29,90€" a "9,90€"

-- PRÓXIMOS PASOS:
-- 1. Crear nuevo Price ID en Stripe para 9,90€
-- 2. Actualizar STRIPE_PRICE_ID en Supabase Dashboard
-- 3. Redesplegar la función stripe-checkout
-- 4. Probar el flujo de pago

-- NOTA: El Price ID actual (price_1RqhsZKFpEkYKp6HFlANUEEa) debe ser reemplazado
-- por el nuevo Price ID correspondiente a 9,90€ 