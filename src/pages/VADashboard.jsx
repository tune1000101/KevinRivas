import { Calendar, Plus, Flag, MessageSquare, ClipboardList, Scissors, CheckCircle2, Clock } from 'lucide-react'
import Header from '../components/Header'

const schedule = [
  { time: '9:00 AM', title: 'Marcus Williams — Fade + Beard', type: 'Barbershop', status: 'confirmed' },
  { time: '10:30 AM', title: 'Chen Family Pre-Approval Call', type: 'Mortgage', status: 'confirmed' },
  { time: '12:00 PM', title: 'Lunch break', type: 'Personal', status: 'blocked' },
  { time: '2:00 PM', title: 'David Ross — Mortgage Consultation', type: 'Mortgage', status: 'pending' },
  { time: '4:00 PM', title: 'Staff check-in: Jordan + Marcus', type: 'Barbershop', status: 'confirmed' },
]

const myTasks = [
  { id: 1, title: 'Confirm tomorrow\'s appointments', priority: 'High', done: true },
  { id: 2, title: 'Upload Chen income docs to pipeline', priority: 'High', done: false },
  { id: 3, title: 'Reply to David Ross email', priority: 'Medium', done: false },
  { id: 4, title: 'Update SOP library with new booking flow', priority: 'Low', done: false },
]

const activityLog = [
  { time: '10:15 AM', action: 'Booked appointment for Marcus Williams' },
  { time: '10:02 AM', action: 'Logged follow-up call — Sarah T.' },
  { time: '9:47 AM', action: 'Uploaded document to Chen file' },
  { time: '9:30 AM', action: 'Sent confirmation text via Twilio' },
]

const typeColors = {
  Barbershop: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  Mortgage: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  Personal: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

export default function VADashboard({ toast }) {
  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={['VA Dashboard']} />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Kevin's Schedule */}
            <div className="lg:col-span-2 rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
              <div className="flex items-center gap-3 mb-5">
                <Calendar size={16} style={{ color: '#6366F1' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Kevin's Schedule — Today</h2>
              </div>
              <div className="space-y-2">
                {schedule.map((s, i) => {
                  const tc = typeColors[s.type] || typeColors.Personal
                  return (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-white/[0.02]"
                      style={{ border: '1px solid #1E1E2E' }}>
                      <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: '#6B7280' }}>{s.time}</span>
                      <span className="flex-1 text-sm font-medium" style={{ color: '#F8F8FF' }}>{s.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.color }}>{s.type}</span>
                      <span className="text-xs capitalize" style={{
                        color: s.status === 'confirmed' ? '#10B981' : s.status === 'pending' ? '#F59E0B' : '#6B7280'
                      }}>{s.status}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#F8F8FF' }}>Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Scissors, label: 'Book Appointment', color: '#6366F1' },
                  { icon: Plus, label: 'Add Task', color: '#10B981' },
                  { icon: Flag, label: 'Flag for Kevin', color: '#F59E0B' },
                  { icon: MessageSquare, label: 'Send Message', color: '#8B5CF6' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => toast?.({ title: action.label, description: 'Feature coming soon', type: 'info' })}
                    className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all hover:opacity-80"
                    style={{ background: `${action.color}10`, border: `1px solid ${action.color}25` }}
                  >
                    <action.icon size={18} style={{ color: action.color }} />
                    <span className="text-xs text-center leading-tight font-medium" style={{ color: '#F8F8FF' }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* My Tasks */}
            <div className="rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList size={16} style={{ color: '#10B981' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>My Tasks</h2>
              </div>
              <div className="space-y-2">
                {myTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 py-2">
                    <CheckCircle2 size={15} style={{ color: task.done ? '#10B981' : '#1E1E2E', flexShrink: 0 }} />
                    <span className="text-sm flex-1" style={{
                      color: task.done ? '#6B7280' : '#F8F8FF',
                      textDecoration: task.done ? 'line-through' : 'none'
                    }}>{task.title}</span>
                    <span className="text-xs" style={{
                      color: task.priority === 'High' ? '#EF4444' : task.priority === 'Medium' ? '#F59E0B' : '#6B7280'
                    }}>{task.priority}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="lg:col-span-2 rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} style={{ color: '#8B5CF6' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Today's Activity Log</h2>
              </div>
              <div className="space-y-3">
                {activityLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: '#6B7280' }}>{log.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6366F1' }} />
                    <span className="text-sm" style={{ color: '#F8F8FF' }}>{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}
