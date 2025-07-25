import Stripe from "npm:stripe@14.15.0";
import { createClient } from "jsr:@supabase/supabase-js@^2";
// Configuración segura de variables de entorno
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
// Inicializar clientes
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10"
});
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Tipos de eventos a procesar
const RELEVANT_EVENTS = [
  "checkout.session.completed",
  "payment_intent.succeeded",
  "invoice.payment_succeeded"
];
Deno.serve(async (req)=>{
  // Validar método POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405
    });
  }
  // Obtener firma y cuerpo
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event;
  try {
    // Verificar firma del webhook (ahora asíncrono)
    event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400
    });
  }
  // Procesar solo eventos relevantes
  if (!RELEVANT_EVENTS.includes(event.type)) {
    console.log(`Evento ignorado: ${event.type}`);
    return new Response("Evento no procesado", {
      status: 200
    });
  }
  try {
    console.log("Webhook event type:", event.type);
    const session = event.data.object;
    console.log("Session object:", session);
    const referenceId = session.client_reference_id || session.metadata?.user_id || session.customer;
    console.log("referenceId:", referenceId);
    if (!referenceId) {
      console.warn("No se encontró reference_id");
      return new Response("No reference_id", {
        status: 400
      });
    }
    // Actualizar tablas de usuario
    const { data: profileData, error: profileError } = await supabase.from("profiles").update({
      is_premium: true,
      last_payment_date: new Date().toISOString()
    }).eq("user_id", referenceId);
    console.log("Profile update:", profileData, profileError);
    const { data: userData, error: userError } = await supabase.from("users").update({
      is_premium: true
    }).eq("id", referenceId);
    console.log("User update:", userData, userError);
    if (profileError || userError) {
      console.error("Error updating user to premium:", profileError, userError);
      return new Response("DB error", { status: 500 });
    }
    console.log(`Premium activado para usuario: ${referenceId}`);
    return new Response("Premium activado", {
      status: 200
    });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return new Response("Error interno", {
      status: 500
    });
  }
});
// Exportar para compatibilidad con Deno Deploy
export default Deno.serve; 