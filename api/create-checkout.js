export default async function handler(req, res) {
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

    if (!productId || !customerEmail) {
      return res.status(400).json({ error: 'Missing productId or customerEmail', received: { productId, customerEmail, customerName } });
    }

    const requestBody = {
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
    };

    const response = await fetch('https://api.dodopayments.com/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ckPsylCeyU_verhz.H3F86r29ABX8m_bAbQEy7jdb4Mj5l96dK1DDWcGOw5qc2guU',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid response from payment provider', raw: responseText.substring(0, 500) });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Payment provider error', 
        status: response.status,
        details: data 
      });
    }

    if (data.payment_link) {
      return res.status(200).json({ payment_link: data.payment_link });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      stack: error.stack 
    });
  }
}
