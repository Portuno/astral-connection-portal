Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_SANDBOX_ACCESS_TOKEN') ?? "";
  const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_SANDBOX_LOCATION_ID') ?? "";

  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
    return new Response(JSON.stringify({ error: "Faltan variables de entorno" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "Falta user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response, data;
    try {
      response = await fetch("https://connect.squareupsandbox.com/v2/online-checkout/payment-links", {
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
            reference_id: user_id, // <-- Asocia el pago al usuario
            line_items: [
              {
                name: "Suscripción Premium AstroTarot",
                quantity: "1",
                base_price_money: { amount: 2990, currency: "EUR" }
              }
            ]
          },
          checkout_options: {
            redirect_url: "https://astral-connection-portal.vercel.app/payment-success"
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      data = await response.json();
    } catch (e) {
      clearTimeout(timeout);
      return new Response(JSON.stringify({ error: "Timeout o error al llamar a Square" }), {
        status: 504,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const checkoutUrl = data.payment_link?.url || data.checkout_page_url || data.url || data.checkout_session?.checkout_url;
    return new Response(JSON.stringify({ checkout_url: checkoutUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});
