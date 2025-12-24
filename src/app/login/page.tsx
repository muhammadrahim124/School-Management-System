"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { Header } from "@/components/Header"
import { Eye, EyeOff, Shield, Users, GraduationCap, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") as "admin" | "teacher" | "student" | null
  const { user, signIn } = useAuth()

  useEffect(() => {
    if (user) {
      const dashboardRoute = `/${user.role}-dashboard`
      router.push(dashboardRoute)
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!form.email || !form.password) {
        throw new Error("Email and password are required.")
      }

      await signIn(form.email, form.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const getRoleInfo = () => {
    switch (role) {
      case "admin":
        return {
          icon: <Shield className="w-12 h-12" />,
          title: "Admin",
          color: "from-purple-500 to-purple-600",
        }
      case "teacher":
        return {
          icon: <Users className="w-12 h-12" />,
          title: "Teacher",
          color: "from-blue-500 to-blue-600",
        }
      case "student":
        return {
          icon: <GraduationCap className="w-12 h-12" />,
          title: "Student",
          color: "from-green-500 to-green-600",
        }
      default:
        return null
    }
  }

  const roleInfo = getRoleInfo()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/role-selection")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {roleInfo && (
            <div
              className={`bg-gradient-to-br ${roleInfo.color} text-white rounded-xl p-6 mb-6 text-center`}
            >
              <div className="inline-block mb-3">{roleInfo.icon}</div>
              <h2 className="text-2xl font-bold">Login as {roleInfo.title}</h2>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 top-6 right-3 flex items-center px-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {role !== "admin" && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href={`/signup${role ? `?role=${role}` : ""}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign up
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

