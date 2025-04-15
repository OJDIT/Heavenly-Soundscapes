import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/database"
import User from "@/models/User"

// Get current admin user
export async function GET() {
  try {
    // This is just for compatibility, doesn't actually connect
    await connectToDatabase()

    // Get the first admin user (using our stub)
    const user = await User.findOne({ role: "admin" })

    if (!user) {
      return NextResponse.json({ error: "No admin user found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error fetching admin user:", error)
    return NextResponse.json({ error: "Failed to fetch admin user" }, { status: 500 })
  }
}

// Update admin user
export async function PUT(request: Request) {
  try {
    const { userId, name, email, currentPassword, newPassword } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // This is just for compatibility, doesn't actually connect
    await connectToDatabase()

    // In a real app, we would update the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      data: {
        id: userId,
        name: name || "Admin User",
        email: email || "admin@heavenlysoundscapes.com",
        role: "admin",
      },
    })
  } catch (error) {
    console.error("Error updating admin user:", error)
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 })
  }
}

// Initialize admin user if none exists
export async function POST() {
  try {
    // This is just for compatibility, doesn't actually connect
    await connectToDatabase()

    // In a real app, we would create a user in the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Default admin user created successfully",
      data: {
        id: "admin-1",
        email: "admin@heavenlysoundscapes.com",
        name: "Admin User",
        role: "admin",
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}
