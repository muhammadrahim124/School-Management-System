import { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, Bell, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAnnouncements: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAnnouncements: 0,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'holidays' | 'classes'>('overview');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target_audience: 'all',
  });
  const [holidayForm, setHolidayForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    color: '#3B82F6',
    description: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: studentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    const { count: teachersCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true });

    const { count: classesCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

    const { count: announcementsCount } = await supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalStudents: studentsCount || 0,
      totalTeachers: teachersCount || 0,
      totalClasses: classesCount || 0,
      totalAnnouncements: announcementsCount || 0,
    });
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      alert('Please fill all required fields');
      return;
    }

    const { error } = await supabase
      .from('announcements')
      .insert([{
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority,
        target_audience: announcementForm.target_audience,
      }]);

    if (error) {
      alert('Error creating announcement: ' + error.message);
    } else {
      alert('Announcement created successfully!');
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '', priority: 'normal', target_audience: 'all' });
      loadStats();
    }
  };

  const handleCreateHoliday = async () => {
    if (!holidayForm.title || !holidayForm.start_date || !holidayForm.end_date) {
      alert('Please fill all required fields');
      return;
    }

    const { error } = await supabase
      .from('holidays')
      .insert([holidayForm]);

    if (error) {
      alert('Error creating holiday: ' + error.message);
    } else {
      alert('Holiday created successfully!');
      setShowHolidayModal(false);
      setHolidayForm({ title: '', start_date: '', end_date: '', color: '#3B82F6', description: '' });
    }
  };

  return (
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
                    onClick={() => setShowAnnouncementModal(true)}
                    color="blue"
                  />
                  <QuickActionButton
                    icon={<Calendar className="w-6 h-6" />}
                    label="Add Holiday"
                    onClick={() => setShowHolidayModal(true)}
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
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Announcement</span>
                  </button>
                </div>
                <p className="text-gray-600">View and manage all school announcements here.</p>
              </div>
            )}

            {activeTab === 'holidays' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Holidays</h2>
                  <button
                    onClick={() => setShowHolidayModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Holiday</span>
                  </button>
                </div>
                <p className="text-gray-600">View and manage school holiday calendar.</p>
              </div>
            )}

            {activeTab === 'classes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Classes</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Class</span>
                  </button>
                </div>
                <p className="text-gray-600">View and manage all classes and sections.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAnnouncementModal && (
        <Modal onClose={() => setShowAnnouncementModal(false)}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Announcement content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={announcementForm.priority}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Create Announcement
              </button>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showHolidayModal && (
        <Modal onClose={() => setShowHolidayModal(false)}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Holiday</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={holidayForm.title}
                onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={holidayForm.end_date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateHoliday}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Add Holiday
              </button>
              <button
                onClick={() => setShowHolidayModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

function StatsCard({ icon, title, value, color }: StatsCardProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }[color];

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
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

function QuickActionButton({ icon, label, onClick, color }: QuickActionButtonProps) {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-3 px-6 py-4 ${colors} text-white rounded-lg transition-colors font-semibold`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
