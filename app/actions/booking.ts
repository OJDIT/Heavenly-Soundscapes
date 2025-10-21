"use server"

import { createClient } from "@/lib/supabase/server"
import { sendBookingConfirmationEmail } from "@/lib/email"

interface BookingData {
  customerName: string
  customerEmail: string
  customerPhone: string
  bookingDate: string
  bookingTime: string
  projectType: string
  selectedServices: any[]
  subtotal: number
  depositAmount: number
  totalAmount: number
  specialRequests: string
}

export async function createBooking(data: BookingData) {
  try {
    const supabase = await createClient()

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        booking_date: data.bookingDate,
        booking_time: data.bookingTime,
        project_type: data.projectType,
        selected_services: data.selectedServices,
        subtotal: data.subtotal,
        deposit_amount: data.depositAmount,
        total_amount: data.totalAmount,
        special_requests: data.specialRequests,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Booking creation error:", error)
      return { success: false, error: error.message }
    }

    try {
      await sendBookingConfirmationEmail({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        services: data.selectedServices,
        totalAmount: data.totalAmount,
        depositAmount: data.depositAmount,
        bookingId: booking.id,
      })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the booking if email fails
    }

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Booking error:", error)
    return { success: false, error: "Failed to create booking" }
  }
}
