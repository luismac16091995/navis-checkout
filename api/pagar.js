// api/pagar.js
const stripe = require('stripe');

module.exports = async (req, res) => {
  console.log("🔍 STRIPE_SECRET_KEY recibida:", process.env.STRIPE_SECRET_KEY ? "✅ SÍ" : "❌ NO");

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).send("❌ Error: STRIPE_SECRET_KEY no está configurada");
  }

  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

  const { plan, uid } = req.query;

  const priceIds = {
    'Mensual': 'price_1T8cLIRx24TvNZlGyoBgFaMT',
    'Anual':   'price_1T8cKRRx24TvNZlG7rzVNwtg'
  };

  const priceId = priceIds[plan];
  if (!priceId) return res.status(400).send('Plan no válido');

  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://navis.mx/success?session_id={CHECKOUT_SESSION_ID}&uid=${uid}`,
      cancel_url: `https://navis.mx/cancel`,
      metadata: { uid, plan },
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).send("Error al crear sesión de pago");
  }
};
