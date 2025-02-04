import { createClient } from '../../sanity/lib/client'

// Define interfaces for type safety
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
  _type: 'orderItem'
  productId: string
  title: string
  quantity: number
  price: number
}

interface SanityOrder {
  _type: 'order'
  orderId: string
  customer: CustomerDetails
  items: SanityOrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
}

const client = createClient({
  projectId: 'ms9xwjo9',
  dataset: 'production',
  apiVersion: '2024-02-02',
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false
})

export async function submitOrderToSanity(orderDetails: OrderDetails) {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_TOKEN) {
      throw new Error('Sanity token is not configured')
    }

    const order: SanityOrder = {
      _type: 'order',
      orderId: orderDetails.id,
      customer: orderDetails.customer,
      items: orderDetails.items.map((item) => ({
        _type: 'orderItem',
        productId: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderDetails.total,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const response = await client.create(order)
    return response

  } catch (error) {
    console.error('Detailed Sanity Error:', error)
    
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 403) {
      throw new Error('Authentication failed. Please check your Sanity token.')
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to submit order to Sanity')
  }
}