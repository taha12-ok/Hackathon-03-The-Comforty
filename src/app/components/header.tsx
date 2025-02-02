"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "../../../contexts/CartContext"
import { FaShoppingCart, FaUserCircle } from "react-icons/fa"
import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount } = useCart()
  const { signOut } = useClerk()

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Help', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <header className={`bg-white fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="w-full bg-[#272343] text-sm text-[#F0F2F3] py-2">
          <div className="flex justify-center items-center text-center mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs sm:text-sm">✓ Free Shipping On All Orders Over $50</p>
          </div>
        </div>

        <div className="bg-[#F0F2F3]">
          <div className="flex flex-wrap justify-between items-center py-2 sm:py-4 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Updated Logo Section with Link */}
            <Link href="/home" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="sm:w-[40px] sm:h-[40px]" />
              <span className="text-xl sm:text-2xl font-bold ml-2 text-gray-800">Comforty</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignedIn>
                <button
                  onClick={() => signOut()}
                  className="flex items-center bg-[#00B4B4] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#009999] transition-colors text-sm sm:text-base"
                >
                  <FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <button className="flex items-center bg-[#00B4B4] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#009999] transition-colors text-sm sm:text-base">
                    <FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                </Link>
              </SignedOut>
              <Link href="/cart">
                <button className="flex items-center bg-white text-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base">
                  <FaShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-black mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-1 sm:ml-2 bg-[#007580] text-white rounded-full px-1.5 sm:px-2 py-0.5 text-xs">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex justify-between items-center py-3 sm:py-5">
            <nav className="relative w-full">
              <button 
                className="md:hidden text-gray-800 focus:outline-none p-2" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {menuOpen ? (
                  <Image src="/closemenu.png" alt="Close Menu" width={20} height={20} className="sm:w-[24px] sm:h-[24px]" />
                ) : (
                  <Image src="/openmenu.png" alt="Open Menu" width={20} height={20} className="sm:w-[24px] sm:h-[24px]" />
                )}
              </button>

              <ul className="hidden md:flex items-center space-x-8">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      className="text-gray-500 hover:text-[#007580] font-semibold transition-colors" 
                      href={item.path}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {menuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
              )}

              <div
                className={`
                  fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out
                  ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:hidden
                `}
              >
                <div className="h-full overflow-y-auto">
                  <div className="px-4 py-4">
                    <div className="flex justify-between items-center mb-8">
                      {/* Updated Mobile Logo Section with Link */}
                      <Link href="/home" className="flex items-center">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} className="sm:w-[40px] sm:h-[40px]" />
                        <span className="text-xl sm:text-2xl font-bold ml-2 text-gray-800">Comforty</span>
                      </Link>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="p-2 text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        <Image src="/closemenu.png" alt="Close Menu" width={20} height={20} className="sm:w-[24px] sm:h-[24px]" />
                      </button>
                    </div>

                    <nav className="flex flex-col space-y-6">
                      {navLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="text-lg font-semibold text-gray-800 hover:text-[#007580] transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </nav>
            
            <div className="hidden sm:flex items-center text-gray-400 hover:text-[#007580] whitespace-nowrap transition-colors">
              Contact: 0306-0484798
            </div>
          </div>
        </div>
      </header>
      <div className="h-[140px] sm:h-[180px]"></div>
    </>
  )
}