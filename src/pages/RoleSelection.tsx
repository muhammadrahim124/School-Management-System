"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import { Shield, Users, GraduationCap } from "lucide-react"

export function RoleSelection() {
  const navigate = useNavigate()

  const handleRoleSelect = (role: "admin" | "teacher" | "student") => {
    navigate(`/login?role=${role}`)
    window.scrollTo(0, 0) // optional: scroll to top after navigation
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Select Your Role</h1>
          <p className="text-lg text-gray-600">Choose your role to continue to the login page</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            icon={<Shield className="w-16 h-16" />}
            title="Admin"
            description="Manage school operations, users, and settings"
            color="from-purple-500 to-purple-600"
            onClick={() => handleRoleSelect("admin")}
          />

          <RoleCard
            icon={<Users className="w-16 h-16" />}
            title="Teacher"
            description="Manage classes, students, and assignments"
            color="from-blue-500 to-blue-600"
            onClick={() => handleRoleSelect("teacher")}
          />

          <RoleCard
            icon={<GraduationCap className="w-16 h-16" />}
            title="Student"
            description="Access courses, assignments, and grades"
            color="from-green-500 to-green-600"
            onClick={() => handleRoleSelect("student")}
          />
        </div>
      </div>
    </div>
  )
}

interface RoleCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  onClick: () => void
}

function RoleCard({ icon, title, description, color, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden group text-left w-full"
    >
      <div className={`bg-gradient-to-br ${color} p-8 text-white`}>
        <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <div className="p-6 bg-gray-50">
        <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
          Continue as {title} →
        </span>
      </div>
    </button>
  )
}
