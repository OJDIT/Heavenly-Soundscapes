"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(bookingId: string) {
  try {
    const supabase = await createClient()

    // ✅ 1. Fetch booking details from Supabase
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (error || !booking) {
      console.error("Booking fetch error:", error)
      return null
    }

    // ✅ 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Studio Booking - ${booking.project_type}`,
              description: `Deposit for ${booking.customer_name}'s session on ${booking.booking_date}`,
            },
            unit_amount: Math.round(booking.deposit_amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },

      // ✅ 3. Use localhost URLs during development
      success_url: `http://localhost:3000/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/book`,
    })

    // ✅ 4. Save session ID in Supabase
    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", bookingId)

    // ✅ 5. Return redirect URL for client-side redirect
    return session.url
  } catch (error) {
    console.error("Stripe session error:", error)
    return null
  }
}
