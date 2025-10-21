"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { sendBookingStatusEmail, sendAdminBookingAlert } from "@/lib/email"

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    },
  )

  // Authenticate admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Fetch booking
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single()
  if (fetchError || !booking) throw new Error(fetchError?.message || "Booking not found")

  // Update status
  const { error } = await supabase
    .from("bookings")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      admin_confirmed: newStatus === "confirmed",
    })
    .eq("id", bookingId)
  if (error) throw new Error(error.message)

  // Send emails
  try {
    if (newStatus === "confirmed") {
      await sendBookingStatusEmail({
        to: booking.customer_email,
        subject: "Your Booking Has Been Confirmed 🎵",
        message: `Hi ${booking.customer_name},\n\nYour booking for ${booking.project_type} on ${booking.booking_date} has been confirmed.\n\nWe look forward to seeing you!\n\n— Heavenly Soundscapes`
      })

      await sendAdminBookingAlert({
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        services: booking.selected_services,
        totalAmount: booking.total_amount,
        depositAmount: booking.deposit_amount,
        bookingId: booking.id,
      })
    }

    if (newStatus === "completed") {
      await sendBookingStatusEmail({
        to: booking.customer_email,
        subject: "Your Session is Completed ✅",
        message: `Hi ${booking.customer_name},\n\nYour session for ${booking.project_type} has been successfully completed.\n\nThank you for choosing Heavenly Soundscapes Production!\n\n— Heavenly Soundscapes`
      })
    }
  } catch (emailError) {
    console.error("❌ Email sending error:", emailError)
  }

  revalidatePath("/admin")
  return { success: true }
}
