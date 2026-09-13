
import { z } from 'zod';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  console.warn('Shopify Storefront credentials missing from environment variables.');
}

const StorefrontResponseSchema = z.object({
  data: z.any().optional(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});

/**
 * Executes a GraphQL mutation/query against the Shopify Storefront API.
 */
async function shopifyFetch(query: string, variables = {}) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  const parsed = StorefrontResponseSchema.parse(json);

  if (parsed.errors) {
    throw new Error(`Shopify API Error: ${parsed.errors[0].message}`);
  }

  return parsed.data;
}

/**
 * Appends a custom designed product to a Shopify cart session.
 * Injects hidden line item properties for database linking.
 */
export async function addCustomBoxToCart({
  cartId,
  variantId,
  quantity,
  designId,
  previewUrl,
  boxTier
}: {
  cartId?: string;
  variantId: string;
  quantity: number;
  designId: string;
  previewUrl: string;
  boxTier: string;
}) {
  const mutation = cartId 
    ? `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { id, checkoutUrl }
        }
      }`
    : `mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { id, checkoutUrl }
        }
      }`;

  const lines = [{
    merchandiseId: variantId.startsWith('gid://') ? variantId : `gid://shopify/ProductVariant/${variantId}`,
    quantity,
    attributes: [
      { key: '_design_id', value: designId },
      { key: '_preview_url', value: previewUrl },
      { key: 'Box Tier Selection', value: boxTier.toUpperCase() }
    ]
  }];

  const variables = cartId ? { cartId, lines } : { input: { lines } };
  const data = await shopifyFetch(mutation, variables);
  
  return cartId ? data.cartLinesAdd.cart : data.cartCreate.cart;
}
