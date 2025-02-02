import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "../../contexts/CartContext"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/header"
import Footer from "./components/footer"


const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <Header />
            {children}
            <Footer />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  )
}

