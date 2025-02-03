import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = "2024-02-02" // Use the latest API version
const token = process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN

if (!projectId || !dataset) {
  throw new Error("Missing Sanity project ID or dataset. Check your environment variables.")
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false, // Set to true for production to enable the Sanity CDN
})

export async function getProducts() {
  try {
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
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function getOrderById(orderId: string) {
  try {
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
      { orderId },
    )
    return order
  } catch (error) {
    console.error("Error fetching order:", error)
    throw new Error("Failed to fetch order")
  }
}

export { createClient }

