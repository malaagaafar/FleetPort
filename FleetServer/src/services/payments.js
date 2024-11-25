import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY');

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // إنشاء أو الحصول على العميل
    const customer = await stripe.customers.create();
    
    // إنشاء مفتاح مؤقت
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    // إنشاء payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // تحويل إلى سنتات
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;