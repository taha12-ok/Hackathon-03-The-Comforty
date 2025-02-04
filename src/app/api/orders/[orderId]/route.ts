// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server"
import { client } from "../../../../../lib/sanity"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId

  try {
    const order = await client.fetch(`*[_type == "order" && orderId == $orderId][0]`, { orderId })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}