import { createClient } from "../../../../sanity/lib/client"

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  postalCode: string
  paymentMethod: string
}

interface OrderItem {
  _id: string
  title: string
  quantity: number
  price: number
}

interface OrderDetails {
  id: string
  customer: CustomerDetails
  items: OrderItem[]
  total: number
}

interface SanityOrderItem {
  _type: "orderItem"
  productId: string
  title: string
  quantity: number
  price: number
}

interface SanityOrder {
  _type: "order"
  orderId: string
  customer: CustomerDetails
  items: SanityOrderItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: string
}

const client = createClient({
  projectId: "ms9xwjo9",
  dataset: "production",
  apiVersion: "2024-02-02",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
})

export async function submitOrderToSanity(orderDetails: OrderDetails) {
  console.log("Submitting order to Sanity...")
  console.log("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  console.log("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET)
  console.log("API Version:", client.config().apiVersion)
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN) {
      throw new Error("Sanity token is not configured")
    }

    const order: SanityOrder = {
      _type: "order",
      orderId: orderDetails.id,
      customer: {
        name: orderDetails.customer.name,
        email: orderDetails.customer.email,
        phone: orderDetails.customer.phone,
        address: orderDetails.customer.address,
        city: orderDetails.customer.city,
        country: orderDetails.customer.country,
        postalCode: orderDetails.customer.postalCode,
        paymentMethod: orderDetails.customer.paymentMethod,
      },
      items: orderDetails.items.map((item) => ({
        _type: "orderItem",
        productId: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      total: orderDetails.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const response = await client.create(order)

    if (!response) {
      throw new Error("Failed to create order in Sanity")
    }

    return response
  } catch (error: unknown) {
    console.error("Detailed Sanity Error:", error)
    interface SanityError extends Error {
      statusCode?: number
    }
    if (error instanceof Error && "statusCode" in error && (error as SanityError).statusCode === 403) {
      throw new Error("Authentication failed. Please check your Sanity token.")
    }

    if (error instanceof Error) {
      throw new Error(error.message || "Failed to submit order to Sanity")
    } else {
      throw new Error("Failed to submit order to Sanity")
    }
  }
}

