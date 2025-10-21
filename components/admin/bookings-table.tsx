"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { updateBookingStatus } from "@/app/actions/admin" // ✅ fixed import

interface Booking {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  booking_date: string
  booking_time: string
  services: any[]
  total_amount: number
  deposit_amount: number
  status: string
  payment_status: string
  stripe_session_id: string | null
  created_at: string
  notes: string | null
  project_type: string
}

interface BookingsTableProps {
  bookings: Booking[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId)
    try {
      const result = await updateBookingStatus(bookingId, newStatus)
      if (!result?.success) throw new Error("Failed to update booking")

      toast.success(`Booking marked as ${newStatus}`)
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Error updating booking. Please try again.")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      completed: "outline",
      cancelled: "destructive",
    }
    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="font-serif text-2xl font-bold text-gold">All Bookings</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Client</TableHead>
              <TableHead className="text-gray-400">Date & Time</TableHead>
              <TableHead className="text-gray-400">Services</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                  No bookings yet
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell>
                    <div className="text-white font-medium">{booking.client_name}</div>
                    <div className="text-sm text-gray-400">{booking.client_email}</div>
                    <div className="text-sm text-gray-400">{booking.client_phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{formatDate(booking.booking_date)}</div>
                    <div className="text-sm text-gray-400">{booking.booking_time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-300 max-w-xs">
                      {Array.isArray(booking.services) &&
                        booking.services.map((service, idx) => (
                          <div key={idx} className="mb-1">
                            {service.name}
                            {service.quantity > 1 && ` (${service.quantity})`}
                            {service.hours && ` - ${service.hours}h`}
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white font-medium">${booking.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Deposit: ${booking.deposit_amount.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            disabled={updatingId === booking.id || isPending}
                            className="bg-gold hover:bg-gold/90 text-black"
                          >
                            {updatingId === booking.id ? "Confirming..." : "Confirm"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            disabled={updatingId === booking.id || isPending}
                          >
                            {updatingId === booking.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            disabled={updatingId === booking.id || isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {updatingId === booking.id ? "Completing..." : "Complete"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            disabled={updatingId === booking.id || isPending}
                          >
                            {updatingId === booking.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
