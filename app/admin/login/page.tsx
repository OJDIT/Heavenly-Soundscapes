import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to access the admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
