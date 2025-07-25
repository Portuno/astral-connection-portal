import Stripe from 'npm:stripe@14.15.0';

Deno.serve(async (req) => {
  // CORS Preflight Handler
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

  // Environment Variables Check
  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_PRICE_ID = Deno.env.get("STRIPE_PRICE_ID");
  const APP_URL = Deno.env.get("APP_URL") || "https://www.amorastral.com";

  // DEBUG: Log env status
  console.log("DEBUG ENV", {
    STRIPE_SECRET_KEY: STRIPE_SECRET_KEY ? "OK" : "MISSING",
    STRIPE_PRICE_ID: STRIPE_PRICE_ID ? "OK" : "MISSING",
    APP_URL
  });

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    console.error("Missing Stripe environment variables", {
      STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID
    });
    return new Response(JSON.stringify({
      error: "Missing Stripe configuration"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    // Validate incoming request
    const { user_id } = await req.json();
    if (!user_id) {
      console.error("Missing user_id in request body");
      return new Response(JSON.stringify({
        error: "User ID is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Stripe client
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true
    });

    // Create Stripe Checkout Session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1
          }
        ],
        mode: "subscription", // <-- ahora es recurring
        success_url: `${APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/premium`,
        client_reference_id: user_id,
        metadata: { user_id }
      });
    } catch (stripeError) {
      console.error("Stripe API Error:", stripeError);
      return new Response(JSON.stringify({
        error: "Failed to create Stripe checkout session",
        details: stripeError.message || JSON.stringify(stripeError)
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (!session.url) {
      console.error("No checkout URL returned by Stripe", session);
      return new Response(JSON.stringify({
        error: "No checkout URL returned by Stripe"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response(JSON.stringify({
      checkout_url: session.url,
      user_id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}); 