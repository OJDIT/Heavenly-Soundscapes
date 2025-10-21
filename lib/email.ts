// lib/email.ts
import nodemailer from "nodemailer"

interface BookingEmailData {
  customerName: string
  customerEmail: string
  bookingDate: string
  bookingTime: string
  services: any[]
  totalAmount: number
  depositAmount: number
  bookingId: string
}

/**
 * Create and verify a Nodemailer transporter configured for Hostinger.
 * - Uses environment variables, falls back to Hostinger defaults.
 * - verify() is wrapped in try/catch so a failed verify doesn't crash your app at import time.
 */
async function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com"
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set in environment variables")
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      // Hostinger sometimes requires relaxed TLS settings in dev environments.
      // Keep false in production if you prefer strict verification.
      rejectUnauthorized: false,
    },
  })

  try {
    await transporter.verify()
    console.log("✅ SMTP transporter verified")
  } catch (err) {
    // Don't throw here — caller will get errors when attempting to send.
    console.warn("⚠️ SMTP transporter verification failed:", err)
  }

  return transporter
}

/**
 * sendBookingConfirmationEmail
 * Sends a detailed HTML email to the customer (and a copy to admin) when a booking is created.
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const transporter = await getTransporter()

  const customerHtml = `
    <html><body style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>Booking Received — Heavenly Soundscapes Production</h2>
      <p>Hi ${data.customerName},</p>
      <p>Thank you — we've received your booking. Details below:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${data.bookingId}</li>
        <li><strong>Date:</strong> ${new Date(data.bookingDate).toLocaleDateString("en-GB")}</li>
        <li><strong>Time:</strong> ${data.bookingTime}</li>
      </ul>
      <h4>Services</h4>
      <ul>
        ${data.services
          .map(
            (s) =>
              `<li>${s.name}${s.quantity ? ` (${s.quantity})` : ""}${
                s.hours ? ` - ${s.hours}h` : ""
              } - £${s.price}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> £${data.totalAmount}</p>
      <p><strong>Deposit:</strong> £${data.depositAmount}</p>
      <p>You'll receive another email after payment and once the booking is confirmed by the studio.</p>
      <p>— Heavenly Soundscapes</p>
    </body></html>
  `

  const adminHtml = `
    <html><body style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>New Booking Created</h2>
      <p><strong>${data.customerName}</strong> (${data.customerEmail}) created a booking (ID: ${data.bookingId}).</p>
      <p>Date: ${new Date(data.bookingDate).toLocaleDateString("en-GB")} - ${data.bookingTime}</p>
      <h4>Services</h4>
      <ul>
        ${data.services
          .map(
            (s) =>
              `<li>${s.name}${s.quantity ? ` (${s.quantity})` : ""}${s.hours ? ` - ${s.hours}h` : ""} - £${s.price}</li>`
          )
          .join("")}
      </ul>
      <p>Total: £${data.totalAmount} — Deposit: £${data.depositAmount}</p>
      <p>Please confirm the booking in the admin dashboard.</p>
    </body></html>
  `

  // send to customer
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Heavenly Soundscapes" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: "Heavenly Soundscapes — Booking Received",
    html: customerHtml,
  })

  // notify admin
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Heavenly Soundscapes" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `New booking received — ${data.customerName}`,
    html: adminHtml,
  })

  console.log("✅ sendBookingConfirmationEmail: customer + admin emails sent")
}

/**
 * sendAdminBookingAlert
 * Use this when payment succeeds (e.g., in your Stripe webhook). Short HTML notification to admin.
 */
export async function sendAdminBookingAlert(data: BookingEmailData) {
  const transporter = await getTransporter()

  const html = `
    <html><body style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>Payment Received — New Booking</h2>
      <p><strong>Name:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Date:</strong> ${new Date(data.bookingDate).toLocaleDateString("en-GB")}</p>
      <p><strong>Time:</strong> ${data.bookingTime}</p>
      <h4>Services</h4>
      <ul>
        ${data.services
          .map((s) => `<li>${s.name} - £${s.price}${s.quantity ? ` (${s.quantity})` : ""}</li>`)
          .join("")}
      </ul>
      <p><strong>Total:</strong> £${data.totalAmount}</p>
      <p><strong>Deposit paid:</strong> £${data.depositAmount}</p>
      <p>Action required: Please confirm the booking in the admin dashboard.</p>
    </body></html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Heavenly Soundscapes" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || "benamobeda@heavenlysoundscape.com",
    subject: `Payment received — ${data.customerName}`,
    html,
  })

  console.log("✅ sendAdminBookingAlert: admin notified")
}

/**
 * sendBookingStatusEmail
 * Use this to send a text email to a customer when admin confirms/completes the booking.
 * Accepts { to, subject, message }.
 */
export async function sendBookingStatusEmail(data: { to: string; subject: string; message: string }) {
  const transporter = await getTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Heavenly Soundscapes" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: data.subject,
    text: data.message,
  })

  console.log("✅ sendBookingStatusEmail: sent to", data.to)
}
