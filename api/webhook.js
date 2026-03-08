// api/webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata.uid;

    if (uid) {
      await db.collection('users').doc(uid).set({
        isPremium: true,
        premiumSince: new Date(),
        plan: session.metadata.plan || 'Mensual',
        stripeSessionId: session.id,
      }, { merge: true });

      console.log(`✅ Premium activado automáticamente para usuario: ${uid}`);
    }
  }

  res.json({ received: true });
};
