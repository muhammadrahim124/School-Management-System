"use client"

import { BookOpen, Calendar, FileText, Bell, GraduationCap, Users, Trophy, ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Announcement, Holiday, Exam } from "@/types"

export function PublicHome() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([])

  useEffect(() => {
    loadPublicData()
  }, [])

  const loadPublicData = async () => {
    try {
      // These will be replaced with API calls later
      // For now, just set empty arrays
      setAnnouncements([])
      setHolidays([])
      setUpcomingExams([])
    } catch (error) {
      console.error('Error loading public data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="pt-16">
        <section id="home" className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-5"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6 animate-bounce">
                <GraduationCap className="w-20 h-20 text-blue-600" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
                Welcome to <span className="text-blue-600">Sunrise Academy</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Where excellence meets opportunity. Join us in shaping tomorrow's leaders through quality education,
                innovation, and care.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => router.push("/role-selection")}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Login
                </button>
                <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-blue-600">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard
                icon={<BookOpen className="w-8 h-8" />}
                title="Today's Classes"
                description="Check your daily schedule"
                color="blue"
              />
              <InfoCard
                icon={<FileText className="w-8 h-8" />}
                title="Homework Updates"
                description="View latest assignments"
                color="green"
              />
              <InfoCard
                icon={<Calendar className="w-8 h-8" />}
                title="Exam Schedule"
                description="Upcoming exams & tests"
                color="purple"
              />
              <InfoCard
                icon={<Bell className="w-8 h-8" />}
                title="Notices"
                description="Important announcements"
                color="orange"
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      {announcement.priority === "urgent" && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Urgent</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
                    <p className="text-xs text-gray-400">{new Date(announcement.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No announcements at the moment</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="exams" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Exams</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              {upcomingExams.length > 0 ? (
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{new Date(exam.exam_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{exam.start_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming exams scheduled</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="holidays" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Holiday Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                    style={{ backgroundColor: `${holiday.color}15`, borderLeft: `4px solid ${holiday.color}` }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{holiday.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{holiday.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(holiday.start_date).toLocaleDateString()} -{" "}
                      {new Date(holiday.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming holidays</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Sunrise Academy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Users className="w-12 h-12 text-blue-600" />}
                title="Expert Faculty"
                description="Highly qualified and experienced teachers dedicated to student success"
              />
              <FeatureCard
                icon={<Trophy className="w-12 h-12 text-blue-600" />}
                title="Academic Excellence"
                description="Consistently achieving top results in board examinations"
              />
              <FeatureCard
                icon={<ImageIcon className="w-12 h-12 text-blue-600" />}
                title="Modern Facilities"
                description="State-of-the-art classrooms, labs, and sports facilities"
              />
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="mb-8 text-blue-100">Have questions? We're here to help!</p>
            <div className="space-y-4 text-left bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
              <p>
                <strong>Address:</strong> 123 Education Street, Learning City, 12345
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Email:</strong> info@sunriseacademy.edu
              </p>
              <p>
                <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-8 px-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">&copy; 2024 Sunrise Academy. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">Excellence in Education Since 1990</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function InfoCard({ icon, title, description, color }: InfoCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  }[color]

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden group">
      <div className={`bg-gradient-to-br ${colorClasses} p-6 text-white`}>
        <div className="mb-3 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <div className="p-4 bg-gray-50">
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
      <div className="inline-block mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

