"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import { submitOrderToSanity } from "./actions"

interface OrderDetails {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    postalCode: string
    paymentMethod: string
  }
  items: Array<{
    _id: string
    title: string
    quantity: number
    price: number
  }>
  total: number
  status: string
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      const parsedData = JSON.parse(decodeURIComponent(data))
      setOrderDetails({
        ...parsedData,
        id: orderId as string,
      })
    }
  }, [orderId, searchParams])

  const generatePDF = async () => {
    if (!orderDetails) return

    const doc = new jsPDF()
    
    // Add Comforty branding
    doc.setFontSize(24)
    doc.setTextColor(2, 159, 174)
    doc.text("COMFORTY", 105, 15, { align: "center" })
    
    // Add decorative line
    doc.setDrawColor(2, 159, 174)
    doc.setLineWidth(0.5)
    doc.line(20, 20, 190, 20)

    // Add order confirmation title
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("ORDER CONFIRMATION", 105, 30, { align: "center" })

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(`https://comforty.com/order/${orderDetails.id}`)
    doc.addImage(qrCodeDataUrl, "PNG", 160, 35, 30, 30)

    // Add order details
    doc.setFontSize(11)
    doc.text("ORDER INFORMATION", 20, 45)
    doc.setFontSize(10)
    doc.text(`Order ID: ${orderDetails.id}`, 20, 55)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 62)

    // Customer details
    doc.setFontSize(11)
    doc.text("CUSTOMER DETAILS", 20, 75)
    doc.setFontSize(10)
    doc.text(`${orderDetails.customer.name}`, 20, 85)
    doc.text(`${orderDetails.customer.email}`, 20, 92)
    doc.text(`${orderDetails.customer.phone}`, 20, 99)
    doc.text(`${orderDetails.customer.address}`, 20, 106)
    doc.text(`${orderDetails.customer.city}, ${orderDetails.customer.country} ${orderDetails.customer.postalCode}`, 20, 113)
    doc.text(`Payment Method: ${orderDetails.customer.paymentMethod}`, 20, 123)

    // Items section
    doc.setFontSize(11)
    doc.text("ORDER ITEMS", 20, 140)
    doc.setFontSize(10)
    
    // Table header
    doc.text("Item", 20, 150)
    doc.text("Qty", 130, 150)
    doc.text("Price", 160, 150)
    
    // Table content
    orderDetails.items.forEach((item, index) => {
      const y = 160 + (index * 10)
      doc.text(item.title, 20, y)
      doc.text(item.quantity.toString(), 130, y)
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y)
    })

    // Total
    const totalY = 170 + (orderDetails.items.length * 10)
    doc.line(20, totalY - 5, 190, totalY - 5)
    doc.setFontSize(11)
    doc.text(`Total Amount: $${orderDetails.total.toFixed(2)}`, 160, totalY, { align: "right" })

    // Footer
    doc.setFontSize(8)
    doc.text("Thank you for shopping with Comforty!", 105, 285, { align: "center" })
    doc.text("For any queries, please contact support@comforty.com", 105, 290, { align: "center" })

    doc.save(`comforty-order-${orderDetails.id}.pdf`)
  }

  const handleSubmit = async () => {
    if (!orderDetails) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await submitOrderToSanity(orderDetails)
      if (response) {
        // Wait for a small delay to ensure the order is processed
        await new Promise(resolve => setTimeout(resolve, 100))
        // Use replace instead of push to prevent going back to the confirmation page
        router.replace('/order-success')
      }
    } catch (error: unknown) {
      console.error("Error submitting order to Sanity:", error)
      if (error instanceof Error) {
        setError(error.message || "An error occurred while submitting the order. Please try again.")
      } else {
        setError("An error occurred while submitting the order. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!orderDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#029FAE]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#029FAE]">COMFORTY</h1>
            <p className="text-sm sm:text-base text-gray-600">Your Comfort, Our Priority</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Order Status Banner */}
          <div className="bg-[#029FAE] text-white px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Order Confirmation</h2>
                <p className="text-sm mt-1 text-white/90">Order ID: {orderDetails.id}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p><span className="text-gray-600">Name:</span> {orderDetails.customer.name}</p>
                  <p><span className="text-gray-600">Email:</span> {orderDetails.customer.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {orderDetails.customer.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p>{orderDetails.customer.address}</p>
                  <p>{orderDetails.customer.city}, {orderDetails.customer.country}</p>
                  <p>{orderDetails.customer.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Item</th>
                      <th className="text-center py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-3 px-4">{item.title}</td>
                        <td className="text-center py-3 px-4">{item.quantity}</td>
                        <td className="text-right py-3 px-4">${item.price.toFixed(2)}</td>
                        <td className="text-right py-3 px-4">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right py-4 px-4 font-semibold">Total Amount:</td>
                      <td className="text-right py-4 px-4 font-semibold">${orderDetails.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
              <p className="text-sm sm:text-base">Payment Method: {orderDetails.customer.paymentMethod}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generatePDF}
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 bg-[#029FAE] text-white rounded-lg hover:bg-teal-600 transition-colors gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Order Slip</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors gap-2
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Order</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                <div className="flex">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            Thank you for shopping with Comforty. For support, contact us at support@comforty.com
          </p>
        </div>
      </footer>
    </div>
  )
}