import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AdminHeader } from "@/components/admin/admin-header"
import { BookingsTable } from "@/components/admin/bookings-table"
import { StatsCards } from "@/components/admin/stats-cards"

async function getBookings() {
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
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return bookings
}

export default async function AdminDashboard() {
  const bookings = await getBookings()

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your studio bookings and sessions</p>
        </div>

        <StatsCards bookings={bookings} />

        <div className="mt-8">
          <BookingsTable bookings={bookings} />
        </div>
      </main>
    </div>
  )
}
