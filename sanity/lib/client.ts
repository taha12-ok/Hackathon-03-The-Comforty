// sanity/lib/client.ts
import { createClient } from '@sanity/client'

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Set to false since we'll be querying draft content
  apiVersion: '2024-01-30',
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN // Include token for write operations
})

export async function getProducts() {
  const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      title,
      price,
      badge,
      "imageUrl": image.asset->url,
      inventory,
      priceWithoutDiscount
    }
  `)
  return products
}

export async function getOrderById(orderId: string) {
  const order = await client.fetch(
    `*[_type == "order" && orderId == $orderId][0]{
      orderId,
      customer {
        name,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        paymentMethod
      },
      items[] {
        _key,
        title,
        quantity,
        price
      },
      total,
      status
    }`,
    { orderId }
  )
  return order
}

export { createClient }
