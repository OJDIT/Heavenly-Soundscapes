"use client"

import { Card } from "@/components/ui/card"

interface Booking {
  id: string
  status: string
  total_amount: number
  deposit_amount: number
  created_at: string
}

interface StatsCardsProps {
  bookings: Booking[]
}

export function StatsCards({ bookings }: StatsCardsProps) {
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const completedBookings = bookings.filter((b) => b.status === "completed").length

  const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total_amount, 0)

  const depositsCollected = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.deposit_amount, 0)

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      color: "text-gold",
    },
    {
      label: "Pending",
      value: pendingBookings,
      color: "text-yellow-500",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      color: "text-blue-500",
    },
    {
      label: "Completed",
      value: completedBookings,
      color: "text-green-500",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      color: "text-gold",
    },
    {
      label: "Deposits Collected",
      value: `$${depositsCollected.toLocaleString()}`,
      color: "text-gold",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-gray-900 border-gray-800 p-6">
          <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
          <div className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</div>
        </Card>
      ))}
    </div>
  )
}
