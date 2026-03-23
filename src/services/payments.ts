export const STARTER_PRODUCT_ID = "pdt_0Nb6EcfrQg4B1SfyyFa92";
export const PRO_PRODUCT_ID = "pdt_0Nb6EjTvRMfVq1TJaFBFl";
export const ANNUAL_PRODUCT_ID = "pdt_0Nb6ErquQK1L8HupsT3XF";

export async function createDodoCheckout(productId: string, customerEmail: string, customerName: string): Promise<string> {
  const response = await fetch("https://api.dodopayments.com/subscriptions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ckPsylCeyU_verhz.H3F86r29ABX8m_bAbQEy7jdb4Mj5l96dK1DDWcGOw5qc2guU",
      "Content-Type": "application/json"
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
        name: customerName || "Customer"
      },
      payment_link: true,
      product_id: productId,
      quantity: 1,
      return_url: "https://www.listingpilot.online/payment-success"
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create checkout session");
  }

  const data = await response.json();
  return data.payment_link;
}