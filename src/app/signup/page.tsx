"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { Header } from "@/components/Header"
import { Eye, EyeOff, Users, GraduationCap, ArrowLeft, Shield } from "lucide-react"

type UserRole = "admin" | "teacher" | "student"

interface SignupForm {
  email: string
  password: string
  full_name: string
  role: UserRole | ""
}

const VALID_ROLES: UserRole[] = ["admin", "teacher", "student"]

export default function SignupPage() {
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get("role") as UserRole | null

  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    full_name: "",
    role: (roleFromUrl && VALID_ROLES.includes(roleFromUrl)) ? roleFromUrl : "",
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const { user, signUp } = useAuth()

  useEffect(() => {
    if (user) {
      router.push(`/${user.role}-dashboard`)
    }
  }, [user, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!form.role) {
        throw new Error("Please select a role")
      }
      await signUp(form.email, form.password, form.full_name, form.role)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const roleInfo =
    form.role === "admin"
      ? {
          title: "Admin",
          icon: <Shield className="w-12 h-12" />,
          color: "from-purple-500 to-purple-600",
        }
      : form.role === "teacher"
      ? {
          title: "Teacher",
          icon: <Users className="w-12 h-12" />,
          color: "from-blue-500 to-blue-600",
        }
      : form.role === "student"
      ? {
          title: "Student",
          icon: <GraduationCap className="w-12 h-12" />,
          color: "from-green-500 to-green-600",
        }
      : {
          title: "Sign Up",
          icon: <Users className="w-12 h-12" />,
          color: "from-gray-500 to-gray-600",
        }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() =>
            router.push(`/login${roleFromUrl ? `?role=${roleFromUrl}` : ""}`)
          }
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div
            className={`bg-gradient-to-br ${roleInfo.color} text-white rounded-xl p-6 mb-6 text-center`}
          >
            <div className="mb-3 inline-block">{roleInfo.icon}</div>
            <h2 className="text-2xl font-bold">Sign up as {roleInfo.title}</h2>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              Account created successfully! Redirecting…
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <a
                href={`/login${roleFromUrl ? `?role=${roleFromUrl}` : ""}`}
                className="text-blue-600 font-semibold"
              >
                Login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

