"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../../contexts/CartContext"
import { useRouter } from "next/navigation"
import { placeOrder } from "./actions"
import { useUser } from "@clerk/nextjs"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    paymentMethod: "credit_card",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const orderDetails = {
        customer: formData,
        items: cart,
        total: cartTotal,
        status: "pending",
      }

      const orderId = await placeOrder(orderDetails)
      clearCart()
      router.push(`/order-confirmation/${orderId}?data=${encodeURIComponent(JSON.stringify(orderDetails))}`)
    } catch (error) {
      console.error("Error placing order:", error)
      setError("An error occurred while placing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isLoaded || !isSignedIn) {
    return null // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#029FAE] text-white py-3 rounded-md transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between py-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <p>Total</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

