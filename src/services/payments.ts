export const STARTER_PRODUCT_ID = "pdt_0Nb6EcfrQg4B1SfyyFa92";
export const PRO_PRODUCT_ID = "pdt_0Nb6EjTvRMfVq1TJaFBFl";
export const ANNUAL_PRODUCT_ID = "pdt_0Nb6ErquQK1L8HupsT3XF";

const DODO_CHECKOUT_BASE = "https://checkout.dodopayments.com/buy";

export function getDodoCheckoutUrl(productId: string, customerEmail?: string): string {
  const returnUrl = `https://www.listingpilot.online/payment-success?plan=${productId}`;
  let url = `${DODO_CHECKOUT_BASE}/${productId}`;
  const params = new URLSearchParams();
  params.set("quantity", "1");
  params.set("redirect_url", returnUrl);
  if (customerEmail) {
    params.set("customer_email", customerEmail);
  }
  return `${url}?${params.toString()}`;
}
