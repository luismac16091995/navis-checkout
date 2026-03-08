// api/pagar.js
export default async function handler(req, res) {
  console.log("🔍 Request recibido:", req.query);
  console.log("🔑 STRIPE_SECRET_KEY existe?", !!process.env.STRIPE_SECRET_KEY);
  console.log("Valor de la clave:", process.env.STRIPE_SECRET_KEY ? "✅ Presente" : "❌ VACÍA");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ ERROR: STRIPE_SECRET_KEY no está configurada en Vercel");
    return res.status(500).send("Error: La clave de Stripe no está configurada en el servidor. Revisa las variables de entorno.");
  }

  const { plan, uid } = req.query;

  if (!plan || !uid) {
    return res.status(400).send("Faltan parámetros: plan y uid");
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const priceIds = {
      'Mensual': 'price_1T8cLIRx24TvNZlGyoBgFaMT',
      'Anual':   'price_1T8cKRRx24TvNZlG7rzVNwtg'
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return res.status(400).send('Plan no válido');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://navis.mx/success?session_id={CHECKOUT_SESSION_ID}&uid=${uid}`,
      cancel_url: `https://navis.mx/cancel`,
      metadata: { uid, plan },
      allow_promotion_codes: true,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("❌ Error en Stripe:", error.message);
    res.status(500).send("Error interno al crear sesión de pago");
  }
}
