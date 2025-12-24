"use client"

import { useEffect, useState } from 'react'
import { Users, BookOpen, Calendar, Bell, Plus, Edit, Trash2, X } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

interface Stats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalAnnouncements: number
}

interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  target_audience: string
  created_at: string
  expires_at?: string | null
  creator?: {
    full_name: string
  }
}

interface Holiday {
  id: string
  title: string
  start_date: string
  end_date: string
  color: string
  description?: string | null
  created_at: string
}

interface Class {
  id: string
  name: string
  grade_level: number
  section: string
  academic_year: string
  created_at: string
  _count?: {
    students: number
  }
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAnnouncements: 0,
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'holidays' | 'classes'>('overview')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [showHolidayModal, setShowHolidayModal] = useState(false)
  const [showClassModal, setShowClassModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target_audience: 'all',
  })
  const [holidayForm, setHolidayForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    color: '#3B82F6',
    description: '',
  })
  const [classForm, setClassForm] = useState({
    name: '',
    grade_level: '',
    section: '',
    academic_year: '2024-2025',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection')
    } else if (user && user.role !== 'admin') {
      router.push(`/${user.role}-dashboard`)
    }
  }, [user, authLoading, router])

  useEffect(() => {
    loadStats()
    if (activeTab === 'announcements') loadAnnouncements()
    if (activeTab === 'holidays') loadHolidays()
    if (activeTab === 'classes') loadClasses()
  }, [activeTab])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    }
  }

  const loadHolidays = async () => {
    try {
      const response = await fetch('/api/admin/holidays')
      if (response.ok) {
        const data = await response.json()
        setHolidays(data.holidays)
      }
    } catch (error) {
      console.error('Error loading holidays:', error)
    }
  }

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes)
      }
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      alert('Please fill all required fields')
      return
    }

    try {
      const url = editingAnnouncement 
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements'
      const method = editingAnnouncement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save announcement')
      }

      alert(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!')
      setShowAnnouncementModal(false)
      setEditingAnnouncement(null)
      setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' })
      loadStats()
      loadAnnouncements()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save announcement')
    }
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      target_audience: announcement.target_audience,
    })
    setShowAnnouncementModal(true)
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete announcement')
      }

      alert('Announcement deleted successfully!')
      loadStats()
      loadAnnouncements()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete announcement')
    }
  }

  const handleCreateHoliday = async () => {
    if (!holidayForm.title || !holidayForm.start_date || !holidayForm.end_date) {
      alert('Please fill all required fields')
      return
    }

    try {
      const url = editingHoliday 
        ? `/api/admin/holidays/${editingHoliday.id}`
        : '/api/admin/holidays'
      const method = editingHoliday ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holidayForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save holiday')
      }

      alert(editingHoliday ? 'Holiday updated successfully!' : 'Holiday created successfully!')
      setShowHolidayModal(false)
      setEditingHoliday(null)
      setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' })
      loadHolidays()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save holiday')
    }
  }

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setHolidayForm({
      title: holiday.title,
      start_date: holiday.start_date.split('T')[0],
      end_date: holiday.end_date.split('T')[0],
      color: holiday.color,
      description: holiday.description || '',
    })
    setShowHolidayModal(true)
  }

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return

    try {
      const response = await fetch(`/api/admin/holidays/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete holiday')
      }

      alert('Holiday deleted successfully!')
      loadHolidays()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete holiday')
    }
  }

  const handleCreateClass = async () => {
    if (!classForm.name || !classForm.grade_level || !classForm.section) {
      alert('Please fill all required fields')
      return
    }

    try {
      const url = editingClass 
        ? `/api/admin/classes/${editingClass.id}`
        : '/api/admin/classes'
      const method = editingClass ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save class')
      }

      alert(editingClass ? 'Class updated successfully!' : 'Class created successfully!')
      setShowClassModal(false)
      setEditingClass(null)
      setClassForm({ name: '', grade_level: '', section: '', academic_year: '2024-2025' })
      loadStats()
      loadClasses()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save class')
    }
  }

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData)
    setClassForm({
      name: classData.name,
      grade_level: classData.grade_level.toString(),
      section: classData.section,
      academic_year: classData.academic_year,
    })
    setShowClassModal(true)
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? This will also remove all associated students.')) return

    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete class')
      }

      alert('Class deleted successfully!')
      loadStats()
      loadClasses()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete class')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Users className="w-8 h-8" />}
            title="Total Students"
            value={stats.totalStudents}
            color="blue"
          />
          <StatsCard
            icon={<Users className="w-8 h-8" />}
            title="Total Teachers"
            value={stats.totalTeachers}
            color="green"
          />
          <StatsCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Total Classes"
            value={stats.totalClasses}
            color="purple"
          />
          <StatsCard
            icon={<Bell className="w-8 h-8" />}
            title="Announcements"
            value={stats.totalAnnouncements}
            color="orange"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {['overview', 'announcements', 'holidays', 'classes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickActionButton
                    icon={<Bell className="w-6 h-6" />}
                    label="Create Announcement"
                    onClick={() => {
                      setEditingAnnouncement(null)
                      setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' })
                      setShowAnnouncementModal(true)
                    }}
                    color="blue"
                  />
                  <QuickActionButton
                    icon={<Calendar className="w-6 h-6" />}
                    label="Add Holiday"
                    onClick={() => {
                      setEditingHoliday(null)
                      setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' })
                      setShowHolidayModal(true)
                    }}
                    color="green"
                  />
                  <QuickActionButton
                    icon={<BookOpen className="w-6 h-6" />}
                    label="Manage Classes"
                    onClick={() => setActiveTab('classes')}
                    color="purple"
                  />
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Announcements</h2>
                  <button
                    onClick={() => {
                      setEditingAnnouncement(null)
                      setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' })
                      setShowAnnouncementModal(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Announcement</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                              {announcement.priority === 'urgent' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Urgent</span>
                              )}
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                                {announcement.target_audience}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(announcement.created_at).toLocaleDateString()}
                              {announcement.creator && ` by ${announcement.creator.full_name}`}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No announcements yet. Create your first announcement!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'holidays' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Holidays</h2>
                  <button
                    onClick={() => {
                      setEditingHoliday(null)
                      setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' })
                      setShowHolidayModal(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Holiday</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {holidays.length > 0 ? (
                    holidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        style={{ borderLeft: `4px solid ${holiday.color}` }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{holiday.title}</h3>
                            {holiday.description && (
                              <p className="text-sm text-gray-600 mb-2">{holiday.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(holiday.start_date).toLocaleDateString()} - {new Date(holiday.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleEditHoliday(holiday)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHoliday(holiday.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No holidays yet. Add your first holiday!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'classes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Classes</h2>
                  <button
                    onClick={() => {
                      setEditingClass(null)
                      setClassForm({ name: '', grade_level: '', section: '', academic_year: '2024-2025' })
                      setShowClassModal(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Class</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {classes.length > 0 ? (
                        classes.map((classItem) => (
                          <tr key={classItem.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{classItem.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{classItem.grade_level}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{classItem.section}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{classItem.academic_year}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{classItem._count?.students || 0}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClass(classItem)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(classItem.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No classes yet. Add your first class!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAnnouncementModal && (
        <Modal onClose={() => {
          setShowAnnouncementModal(false)
          setEditingAnnouncement(null)
          setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' })
        }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                rows={4}
                placeholder="Announcement content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={announcementForm.priority}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select
                value={announcementForm.target_audience}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, target_audience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateAnnouncement}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
              </button>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false)
                  setEditingAnnouncement(null)
                  setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' })
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showHolidayModal && (
        <Modal onClose={() => {
          setShowHolidayModal(false)
          setEditingHoliday(null)
          setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' })
        }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={holidayForm.title}
                onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Holiday name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={holidayForm.start_date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={holidayForm.end_date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={holidayForm.color}
                onChange={(e) => setHolidayForm({ ...holidayForm, color: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={holidayForm.description}
                onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateHoliday}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
              </button>
              <button
                onClick={() => {
                  setShowHolidayModal(false)
                  setEditingHoliday(null)
                  setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' })
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showClassModal && (
        <Modal onClose={() => {
          setShowClassModal(false)
          setEditingClass(null)
          setClassForm({ name: '', grade_level: '', section: '', academic_year: '2024-2025' })
        }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingClass ? 'Edit Class' : 'Add Class'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Name *</label>
              <input
                type="text"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., Class 10-A"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={classForm.grade_level}
                  onChange={(e) => setClassForm({ ...classForm, grade_level: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="1-12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                <input
                  type="text"
                  value={classForm.section}
                  onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="A, B, C, etc."
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                value={classForm.academic_year}
                onChange={(e) => setClassForm({ ...classForm, academic_year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="2024-2025"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateClass}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                {editingClass ? 'Update Class' : 'Add Class'}
              </button>
              <button
                onClick={() => {
                  setShowClassModal(false)
                  setEditingClass(null)
                  setClassForm({ name: '', grade_level: '', section: '', academic_year: '2024-2025' })
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    </>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: number
  color: string
}

function StatsCard({ icon, title, value, color }: StatsCardProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }[color]

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${colors} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          {icon}
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <p className="text-sm font-medium opacity-90">{title}</p>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color: string
}

function QuickActionButton({ icon, label, onClick, color }: QuickActionButtonProps) {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  }[color]

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-3 px-6 py-4 ${colors} text-white rounded-lg transition-colors font-semibold`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

