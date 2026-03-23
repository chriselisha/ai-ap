export default async function handler(req, res) {
  // Set CORS headers
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
    const { productId, customerEmail, customerName } = req.body;

    const response = await fetch('https://api.dodopayments.com/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ckPsylCeyU_verhz.H3F86r29ABX8m_bAbQEy7jdb4Mj5l96dK1DDWcGOw5qc2guU',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        billing: {
          city: "NA",
          country: "US",
          state: "NA",
          street: "NA",
          zipcode: "00000"
        },
        customer: {
          email: customerEmail,
          name: customerName || 'Customer'
        },
        payment_link: true,
        product_id: productId,
        quantity: 1,
        return_url: "https://www.listingpilot.online/payment-success"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
