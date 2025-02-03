import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "../../contexts/CartContext"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/header"
import Footer from "./components/footer"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Comforty",
  description: "Your Comfort, Our Priority",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
