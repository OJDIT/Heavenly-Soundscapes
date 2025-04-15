interface IUser {
  _id: string
  email: string
  name: string
  role: string
  comparePassword: (password: string) => Promise<boolean>
}

// Mock User model
const User = {
  findOne: async (query: any) => {
    // Return a mock user if querying for admin role
    if (query.role === "admin") {
      return {
        _id: "admin-1",
        email: "admin@heavenlysoundscapes.com",
        name: "Admin User",
        role: "admin",
        comparePassword: async (password: string) => password === "admin123",
      }
    }
    return null
  },
  findById: async (id: string) => {
    if (id === "admin-1") {
      return {
        _id: "admin-1",
        email: "admin@heavenlysoundscapes.com",
        name: "Admin User",
        role: "admin",
        select: () => ({
          _id: "admin-1",
          email: "admin@heavenlysoundscapes.com",
          name: "Admin User",
          role: "admin",
        }),
        comparePassword: async (password: string) => password === "admin123",
      }
    }
    return null
  },
}

export default User
