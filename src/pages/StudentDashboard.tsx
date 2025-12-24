import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Award, DollarSign, Bell, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  due_date: string;
  attachment_url: string;
}

interface ExamResult {
  id: string;
  marks_obtained: number;
  exam: {
    name: string;
    subject: string;
    total_marks: number;
    exam_date: string;
  };
}

interface Attendance {
  date: string;
  status: string;
}

interface Fee {
  amount: number;
  fee_type: string;
  due_date: string;
  status: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, total: 0 });

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    const { data: studentData } = await supabase
      .from('students')
      .select('class_id')
      .eq('id', user?.id)
      .maybeSingle();

    if (studentData?.class_id) {
      const { data: homeworkData } = await supabase
        .from('homework')
        .select('*')
        .eq('class_id', studentData.class_id)
        .gte('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true })
        .limit(5);

      if (homeworkData) setHomework(homeworkData);
    }

    const { data: resultsData } = await supabase
      .from('exam_results')
      .select(`
        id,
        marks_obtained,
        exam:exams (
          name,
          subject,
          total_marks,
          exam_date
        )
      `)
      .eq('student_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (resultsData) setResults(resultsData as unknown as ExamResult[]);

    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('date, status')
      .eq('student_id', user?.id)
      .order('date', { ascending: false })
      .limit(30);

    if (attendanceData) {
      setAttendance(attendanceData);
      const present = attendanceData.filter(a => a.status === 'present').length;
      setAttendanceStats({ present, total: attendanceData.length });
    }

    const { data: feesData } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', user?.id)
      .order('due_date', { ascending: false });

    if (feesData) setFees(feesData);

    const { data: notificationsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (notificationsData) setNotifications(notificationsData);
  };

  const markNotificationRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Pending Homework"
            value={homework.length.toString()}
            color="blue"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="Attendance"
            value={`${attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%`}
            color="green"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Latest Result"
            value={results[0] ? `${results[0].marks_obtained}/${results[0].exam.total_marks}` : 'N/A'}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Fee Status"
            value={fees.filter(f => f.status === 'paid').length + '/' + fees.length}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Homework
              </h2>
              <div className="space-y-3">
                {homework.length > 0 ? (
                  homework.map((hw) => (
                    <div key={hw.id} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{hw.subject}</h3>
                          <p className="text-sm text-gray-600">{hw.title}</p>
                        </div>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          Due: {new Date(hw.due_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{hw.description}</p>
                      {hw.attachment_url && (
                        <a href={hw.attachment_url} className="text-sm text-blue-600 hover:underline">
                          View Attachment
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending homework</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Recent Exam Results
              </h2>
              <div className="space-y-3">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div key={result.id} className="p-4 bg-purple-50 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{result.exam.name}</h3>
                        <p className="text-sm text-gray-600">{result.exam.subject}</p>
                        <p className="text-xs text-gray-500">{new Date(result.exam.exam_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {result.marks_obtained}/{result.exam.total_marks}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Math.round((result.marks_obtained / result.exam.total_marks) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No results available</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Attendance Record
              </h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Last 30 Days</span>
                  <span className="font-semibold text-green-600">
                    {attendanceStats.present} / {attendanceStats.total} Days
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${attendanceStats.total > 0 ? (attendanceStats.present / attendanceStats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {attendance.slice(0, 28).map((att, index) => (
                  <div
                    key={index}
                    className={`w-full aspect-square rounded flex items-center justify-center text-xs ${
                      att.status === 'present' ? 'bg-green-100 text-green-700' :
                      att.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                    title={`${att.date}: ${att.status}`}
                  >
                    {att.status === 'present' ? <CheckCircle className="w-4 h-4" /> :
                     att.status === 'absent' ? <XCircle className="w-4 h-4" /> : 'L'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notif.read ? 'bg-gray-50' : 'bg-orange-50'
                      }`}
                      onClick={() => !notif.read && markNotificationRead(notif.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                        {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{notif.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No notifications</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Fee Status
              </h2>
              <div className="space-y-3">
                {fees.length > 0 ? (
                  fees.map((fee, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-gray-900 capitalize">{fee.fee_type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-700' :
                          fee.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">${fee.amount}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                      {fee.paid_date && (
                        <p className="text-xs text-green-600">Paid: {new Date(fee.paid_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No fee records</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${colors} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">{title}</span>
          {icon}
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
