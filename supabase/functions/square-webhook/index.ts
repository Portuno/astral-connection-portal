import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  let event;
  try {
    event = await req.json();
    console.log("Payload recibido:", JSON.stringify(event));
  } catch (e) {
    console.log("Error parsing JSON:", e);
    return new Response("Bad Request", { status: 400 });
  }

  // Intenta obtener referenceId directo (caso payment.updated)
  const payment = event.data?.object?.payment;
  const order = event.data?.object?.order;
  let referenceId = payment?.order?.reference_id || order?.reference_id;

  // Si no hay referenceId y es order.updated, intenta buscarlo vía API de Square
  if (!referenceId && event.type === "order.updated") {
    const orderId = event.data?.object?.order_updated?.order_id;
    console.log("order.updated recibido, orderId:", orderId);
    if (orderId) {
      const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
      if (!SQUARE_ACCESS_TOKEN) {
        console.log("Missing Square access token");
        return new Response("Missing Square access token", { status: 500 });
      }
      try {
        const orderRes = await fetch(
          `https://connect.squareupsandbox.com/v2/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const orderData = await orderRes.json();
        console.log("Respuesta de Square Orders API:", JSON.stringify(orderData));
        referenceId = orderData.order?.reference_id;
      } catch (fetchErr) {
        console.log("Error fetching order from Square:", fetchErr);
        return new Response("Error fetching order from Square", { status: 500 });
      }
    }
  }

  if (!referenceId) {
    console.log("No reference_id found");
    return new Response("No reference_id found", { status: 400 });
  }

  // Verifica que el pago esté COMPLETED o que sea order.updated (ya que el estado se chequea en el fetch)
  if (
    (payment?.status === "COMPLETED" || event.type === "payment.updated") ||
    (event.type === "order.updated" && referenceId)
  ) {
    try {
      const { error: userError } = await supabase
        .from("users")
        .update({ is_premium: true })
        .eq("id", referenceId);
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("user_id", referenceId);
      if (userError || profileError) {
        console.log("DB error:", userError, profileError);
        return new Response("DB error", { status: 500 });
      }
      console.log("Premium activated for user:", referenceId);
      return new Response("Premium activated", { status: 200 });
    } catch (dbErr) {
      console.log("DB exception:", dbErr);
      return new Response("DB exception", { status: 500 });
    }
  }

  console.log("No action taken");
  return new Response("No action taken", { status: 200 });
}); 