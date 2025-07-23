const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Application-Name, apikey'
};

const handler = async (req) => {
  // --- ¡NO HAGAS NADA ANTES DE ESTE BLOQUE! ---
  if (req.method === "OPTIONS") {
    return new Response(undefined, {
      status: 204,
      headers: corsHeaders
    });
  }
  // --- FIN BLOQUE OPTIONS ---

  console.log("Edge function: inicio");

  if (req.method !== "POST") {
    console.log("Edge function: método no permitido");
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  // Variables de entorno
  const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_SANDBOX_ACCESS_TOKEN') ?? "";
  const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_SANDBOX_LOCATION_ID') ?? "";
  console.log("Edge function: variables de entorno", {
    SQUARE_ACCESS_TOKEN,
    SQUARE_LOCATION_ID
  });

  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
    console.log("Edge function: faltan variables de entorno");
    return new Response(JSON.stringify({
      error: "Faltan variables de entorno de Square. Verifica SQUARE_SANDBOX_ACCESS_TOKEN y SQUARE_SANDBOX_LOCATION_ID."
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  try {
    const { user_id } = await req.json();
    console.log("Edge function: user_id recibido", user_id);
    if (!user_id) {
      console.log("Edge function: falta user_id");
      return new Response(JSON.stringify({
        error: "Falta user_id"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Llamada a Square para crear el link de pago
    console.log("Edge function: llamando a Square");
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
    const data = await response.json();
    console.log("Respuesta cruda de Square:", data);
    if (!response.ok) {
      console.error("Square error:", data);
      return new Response(JSON.stringify({
        error: data
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Devuelve solo la URL de pago en un campo claro
    const checkoutUrl =
      data.checkout_page_url ||
      data.url ||
      data.payment_link?.url ||
      data.checkout_session?.checkout_url;
    return new Response(JSON.stringify({
      checkout_url: checkoutUrl
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({
      error: e.message || "Internal error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
};

export default handler; 