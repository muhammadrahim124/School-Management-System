"use client"

import { useEffect, useState } from 'react'
import { BookOpen, Users, CheckSquare, FileText, Plus, X } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Class, Student } from '@/types'

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [showHomeworkModal, setShowHomeworkModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [homeworkForm, setHomeworkForm] = useState({
    subject: '',
    title: '',
    description: '',
    due_date: '',
  })
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [currentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection')
    } else if (user && user.role !== 'teacher') {
      router.push(`/${user.role}-dashboard`)
    }
  }, [user, authLoading, router])

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass])

  const loadClasses = async () => {
    // TODO: Replace with API call
    setClasses([])
  }

  const loadStudents = async () => {
    // TODO: Replace with API call
    setStudents([])
  }

  const handleCreateHomework = async () => {
    if (!selectedClass || !homeworkForm.subject || !homeworkForm.title || !homeworkForm.due_date) {
      alert('Please fill all required fields')
      return
    }

    // TODO: API call to create homework
    alert('Homework created successfully!')
    setShowHomeworkModal(false)
    setHomeworkForm({ subject: '', title: '', description: '', due_date: '' })
  }

  const handleMarkAttendance = async () => {
    // TODO: API call to mark attendance
    alert('Attendance marked successfully!')
    setShowAttendanceModal(false)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Upload Homework"
            description="Create new assignments"
            color="blue"
            onClick={() => setShowHomeworkModal(true)}
          />
          <ActionCard
            icon={<CheckSquare className="w-8 h-8" />}
            title="Mark Attendance"
            description="Take daily attendance"
            color="green"
            onClick={() => setShowAttendanceModal(true)}
          />
          <ActionCard
            icon={<FileText className="w-8 h-8" />}
            title="Enter Results"
            description="Update exam marks"
            color="purple"
            onClick={() => setShowResultsModal(true)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Class</h2>
          <div className="flex flex-wrap gap-3">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedClass === cls.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Students in {classes.find(c => c.id === selectedClass)?.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{student.roll_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{student.profiles.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <p className="text-center text-gray-500 py-8">No students in this class</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showHomeworkModal && (
        <Modal onClose={() => setShowHomeworkModal(false)}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Homework</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                value={homeworkForm.subject}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={homeworkForm.title}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Chapter 5 Exercises"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={homeworkForm.description}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Detailed instructions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={homeworkForm.due_date}
                onChange={(e) => setHomeworkForm({ ...homeworkForm, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateHomework}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Homework
              </button>
              <button
                onClick={() => setShowHomeworkModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAttendanceModal && (
        <Modal onClose={() => setShowAttendanceModal(false)}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mark Attendance</h2>
          <p className="text-gray-600 mb-6">Date: {new Date(currentDate).toLocaleDateString()}</p>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.profiles.full_name}</p>
                  <p className="text-sm text-gray-500">Roll No: {student.roll_number}</p>
                </div>
                <div className="flex space-x-2">
                  {['present', 'absent', 'late'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendance({ ...attendance, [student.id]: status })}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        attendance[student.id] === status
                          ? status === 'present' ? 'bg-green-600 text-white' :
                            status === 'absent' ? 'bg-red-600 text-white' :
                            'bg-yellow-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleMarkAttendance}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Submit Attendance
            </button>
            <button
              onClick={() => setShowAttendanceModal(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {showResultsModal && (
        <Modal onClose={() => setShowResultsModal(false)}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Exam Results</h2>
          <p className="text-gray-600">This feature requires exam selection and individual student result entry.</p>
          <button
            onClick={() => setShowResultsModal(false)}
            className="mt-4 w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
    </>
  )
}

interface ActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  onClick: () => void
}

function ActionCard({ icon, title, description, color, onClick }: ActionCardProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }[color]

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden text-left"
    >
      <div className={`bg-gradient-to-br ${colors} p-6 text-white`}>
        <div className="mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <div className="p-4 bg-gray-50">
        <span className="text-sm font-semibold text-blue-600 flex items-center">
          <Plus className="w-4 h-4 mr-1" />
          Click to start
        </span>
      </div>
    </button>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="float-right p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

