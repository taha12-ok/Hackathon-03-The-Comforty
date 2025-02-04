"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "../../../contexts/CartContext"
import { FaShoppingCart } from "react-icons/fa"
import type { Product } from "../../../types/product"
import { useState, useEffect } from "react"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart()
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")

  const handleAddToCart = (product: Product) => {
    const imageUrl = product.image?.asset?.url || product.imageUrl || ""

    addToCart({
      ...product,
      quantity: 1,
      image: imageUrl,
    })

    setPopupMessage(`${product.title} successfully added to cart`)
    setShowPopup(true)
  }

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showPopup])

  return (
    <div className="flex flex-col relative">
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {popupMessage}
        </div>
      )}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleAddToCart(product)}
            className="bg-white rounded-lg mb-4 xs:mb-6 flex flex-col transform transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            <div className="relative aspect-square xs:aspect-[4/5] w-full overflow-hidden rounded-lg">
              <Image
                src={product.image?.asset?.url || product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority
              />
              {product.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-medium text-black hover:text-[#00B4B4] transition-colors duration-300 line-clamp-2">
                {product.title}
              </h3>

              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mt-2">
                <p className="text-[#00B4B4] font-bold text-sm sm:text-base">${product.price}</p>
                <button
                  className="w-full xs:w-auto bg-white text-gray-500 px-2 py-1.5 rounded text-xs sm:text-sm flex items-center justify-center hover:bg-[#009999] hover:text-white transition-all duration-300 border border-gray-200"
                >
                  <FaShoppingCart className="mr-1.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full mt-6 sm:mt-8 mb-8 sm:mb-12 flex justify-center px-4">
        <Link href="/cart" className="w-full max-w-xl">
          <button className="w-full bg-[#00B4B4] text-white py-3 sm:py-4 rounded-md flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#009999] transition-all duration-300 text-base sm:text-lg font-medium">
            <FaShoppingCart size={20} />
            <span>Proceed to Cart</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
