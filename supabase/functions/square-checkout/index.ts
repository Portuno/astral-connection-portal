const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Application-Name, apikey"
};

const handler = async (req)=>{
  console.log("INICIO: Entró a la función");
  if (req.method === "OPTIONS") {
    console.log("INICIO: OPTIONS recibido");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  console.log("INICIO: Método POST recibido");
  // Variables de entorno
  const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_SANDBOX_ACCESS_TOKEN') ?? "";
  const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_SANDBOX_LOCATION_ID') ?? "";
  console.log("Variables de entorno:", {
    SQUARE_ACCESS_TOKEN,
    SQUARE_LOCATION_ID
  });
  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
    console.log("ERROR: Faltan variables de entorno");
    return new Response(JSON.stringify({
      error: "Faltan variables de entorno de Square. Verifica SQUARE_SANDBOX_ACCESS_TOKEN y SQUARE_SANDBOX_LOCATION_ID."
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
  try {
    const { user_id } = await req.json();
    console.log("POST: user_id recibido", user_id);
    if (!user_id) {
      console.log("ERROR: Falta user_id");
      return new Response(JSON.stringify({
        error: "Falta user_id"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    // LOG ANTES DEL FETCH
    console.log("ANTES DEL FETCH: Llamando a Square...");
    const response = await fetch(`https://connect.squareupsandbox.com/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: SQUARE_LOCATION_ID,
          line_items: [
            {
              name: "Suscripción Premium AstroTarot",
              quantity: "1",
              base_price_money: {
                amount: 2990,
                currency: "EUR"
              }
            }
          ]
        },
        checkout_options: {
          redirect_url: "https://astral-connection-portal.vercel.app/payment-success"
        }
      })
    });
    // LOG DESPUÉS DEL FETCH
    console.log("DESPUÉS DEL FETCH: Respuesta recibida de Square");
    const data = await response.json();
    console.log("RESPUESTA DE SQUARE:", data);
    if (!response.ok) {
      console.error("ERROR: Square error:", data);
      return new Response(JSON.stringify({
        error: data
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const checkoutUrl = data.checkout_page_url || data.url || data.payment_link?.url || data.checkout_session?.checkout_url;
    console.log("ÉXITO: checkout_url generado", checkoutUrl);
    return new Response(JSON.stringify({
      checkout_url: checkoutUrl
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    console.error("ERROR: Function error:", e);
    return new Response(JSON.stringify({
      error: e.message || "Internal error"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
