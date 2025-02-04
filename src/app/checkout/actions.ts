"use server"

import { v4 as uuidv4 } from "uuid"
import { sendOrderConfirmationEmail } from "../../utils/email"

// Define the types if they're not already imported
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
  id?: string
  customer: CustomerDetails
  items: OrderItem[]
  total: number
}

export async function placeOrder(orderDetails: OrderDetails) {
  console.log("placeOrder called with:", JSON.stringify(orderDetails, null, 2))

  try {
    const orderId = uuidv4()
    console.log("Generated orderId:", orderId)

    // In a real application, you would save the order to a database here

    // Send confirmation email
    console.log("Attempting to send confirmation email...")
    await sendOrderConfirmationEmail(orderDetails.customer.email, orderId, orderDetails)
    console.log("Email sent successfully")

    return orderId
  } catch (error) {
    console.error("Error in placeOrder server action:", error)
    throw error
  }
}