const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, guestName, message, experience } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum contribution is $1' });
    }

    // The base URL of your deployed site (set in Vercel environment variables)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: experience || 'Honeymoon Fund',
              description: `Contribution from ${guestName}`,
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/thank-you.html?name=${encodeURIComponent(guestName)}`,
      cancel_url: baseUrl,
      metadata: {
        guest_name: guestName,
        message: message || '',
        experience: experience || 'General Fund',
      },
      // This lets guests pay from any country
      billing_address_collection: 'auto',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
