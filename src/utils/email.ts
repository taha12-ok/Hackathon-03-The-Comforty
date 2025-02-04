import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

interface OrderDetails {
  items: { title: string; quantity: number; price: number }[];
  total: number;
  customer: { address: string; city: string; country: string; postalCode: string };
}

export async function sendOrderConfirmationEmail(to: string, orderId: string, orderDetails: OrderDetails) {
  console.log("Sending email to:", to)

  const mailOptions = {
    from: "tahashabbir321@gmail.com",
    to: to,
    subject: `Order Confirmation - Order ID: ${orderId}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order. Your order ID is: ${orderId}</p>
      <h2>Order Details:</h2>
      <ul>
        ${orderDetails.items
          .map(
            (item: { title: string; quantity: number; price: number }) => `
          <li>${item.title} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
        `,
          )
          .join("")}
      </ul>
      <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
      <p>Shipping Address: ${orderDetails.customer.address}, ${orderDetails.customer.city}, ${orderDetails.customer.country} ${orderDetails.customer.postalCode}</p>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.response)
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    throw error
  }
}

