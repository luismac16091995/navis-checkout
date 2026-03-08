// api/pagar.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Método no permitido');
  }

  const { plan, price, uid } = req.query;

  if (!plan || !uid) {
    return res.status(400).send('Faltan parámetros');
  }

  const priceIds = {
    'Mensual': 'price_1T8cLIRx24TvNZlGyoBgFaMT',
    'Anual':   'price_1T8cKRRx24TvNZlG7rzVNwtg'
  };

  const priceId = priceIds[plan];
  if (!priceId) {
    return res.status(400).send('Plan no válido');
  }

  try {
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
    res.status(500).send('Error al crear sesión de pago');
  }
};
