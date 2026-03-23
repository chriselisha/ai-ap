const DODO_API_URL = '/api/create-checkout';

export const STARTER_PRODUCT_ID = "pdt_0Nb6EcfrQg4B1SfyyFa92";
export const PRO_PRODUCT_ID = "pdt_0Nb6EjTvRMfVq1TJaFBFl";
export const ANNUAL_PRODUCT_ID = "pdt_0Nb6ErquQK1L8HupsT3XF";

export async function createDodoCheckout(productId: string, customerEmail: string, customerName: string): Promise<string> {
  const response = await fetch(DODO_API_URL, {
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

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data.payment_link;
}