const DODO_API_URL = '/api/create-checkout';

export const STARTER_PRODUCT_ID = "pdt_0Nb6EcfrQg4B1SfyyFa92";
export const PRO_PRODUCT_ID = "pdt_0Nb6EjTvRMfVq1TJaFBFl";
export const ANNUAL_PRODUCT_ID = "pdt_0Nb6ErquQK1L8HupsT3XF";

export async function createDodoCheckout(productId: string, customerEmail: string, customerName: string): Promise<string> {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      customerEmail,
      customerName,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Checkout API error:', data);
    throw new Error(data.message || data.error || 'Failed to create checkout session');
  }

  if (data.payment_link) {
    return data.payment_link;
  }

  // Some APIs return the link in a different field
  const link = data.payment_link || data.url || data.checkout_url;
  if (link) {
    return link;
  }

  console.error('No payment link in response:', data);
  throw new Error('No payment link received from payment provider');
}