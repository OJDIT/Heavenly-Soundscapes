import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { sendAdminBookingAlert, sendBookingStatusEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature")
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      console.error("❌ No bookingId in session metadata")
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    try {
      const supabase = await createClient()

      const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single()

      if (fetchError || !booking) {
        console.error("❌ Booking not found for ID:", bookingId, fetchError)
        return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      }

      // ✅ Mark booking as paid, pending admin confirmation
      await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payment_date: new Date().toISOString(),
          admin_confirmed: false,
        })
        .eq("id", bookingId)

      // ✅ Map selected_services for email
      const services = Array.isArray(booking.selected_services)
        ? booking.selected_services.map((s: any) => ({
            name: s.name || s.service_name || "Service",
            price: s.price || 0,
            quantity: s.quantity || 1,
            hours: s.hours || null,
          }))
        : []

      // ✅ Notify admin
      await sendAdminBookingAlert({
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        services,
        totalAmount: booking.total_amount,
        depositAmount: booking.deposit_amount,
        bookingId: booking.id,
      })

      // ✅ Optional: Notify customer that payment is received (before admin confirms)
      await sendBookingStatusEmail({
        to: booking.customer_email,
        subject: "Payment Received ✅",
        message: `Hi ${booking.customer_name},\n\nWe have received your payment of £${booking.deposit_amount} for your booking on ${booking.booking_date} at ${booking.booking_time}.\n\nYour booking is now pending admin confirmation.\n\n— Heavenly Soundscapes`,
      })

      console.log("✅ Admin and customer notification sent for booking:", bookingId)
    } catch (error) {
      console.error("❌ Error handling checkout.session.completed:", error)
      return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
