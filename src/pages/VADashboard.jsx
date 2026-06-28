import { Calendar, Plus, Flag, MessageSquare, ClipboardList, Scissors, CheckCircle2, Clock } from 'lucide-react'
import Header from '../components/Header'
import { useQuery } from '../hooks/useQuery'
import { supabase, supabaseConfigured } from '../lib/supabase'

const typeColors = {
  barbershop: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'  },
  mortgage:   { color: '#C9A227', bg: 'rgba(201,162,39,0.1)' },
  personal:   { color: '#6B7280', bg: 'rgba(107,114,128,0.1)'},
  cars:       { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
}

function todayRange() {
  const start = new Date(); start.setHours(0,0,0,0)
  const end   = new Date(); end.setHours(23,59,59,999)
  return { start: start.toISOString(), end: end.toISOString() }
}

async function fetchTodaySchedule() {
  if (!supabaseConfigured) return null
  const { start, end } = todayRange()
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('start_time', start)
    .lte('start_time', end)
    .order('start_time', { ascending: true })
  if (error) throw error
  return data
}

async function fetchMyTasks() {
  if (!supabaseConfigured) return null
  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, priority, status')
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) throw error
  return data
}

async function fetchActivityLog() {
  if (!supabaseConfigured) return null
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) throw error
  return data
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function relativeTime(iso) {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Demo fallbacks
const demoSchedule = [
  { id: 1, title: 'Fade + Beard Trim',      client_name: 'Marcus Williams', start_time: new Date().setHours(9,0),    category: 'barbershop', status: 'confirmed' },
  { id: 2, title: 'Pre-Approval Call',       client_name: 'Chen Family',     start_time: new Date().setHours(10,30), category: 'mortgage',   status: 'confirmed' },
  { id: 3, title: 'Mortgage Consultation',   client_name: 'David Ross',      start_time: new Date().setHours(14,0),  category: 'mortgage',   status: 'pending'   },
  { id: 4, title: 'Staff Check-In',          client_name: 'Jordan + Marcus', start_time: new Date().setHours(16,0),  category: 'barbershop', status: 'confirmed' },
]
const demoTasks = [
  { id: 1, title: "Confirm tomorrow's appointments", priority: 'high',   status: 'done'        },
  { id: 2, title: 'Upload Chen income docs',          priority: 'high',   status: 'pending'     },
  { id: 3, title: 'Reply to David Ross email',        priority: 'medium', status: 'pending'     },
  { id: 4, title: 'Update SOP library',               priority: 'low',    status: 'in_progress' },
]
const demoActivity = [
  { id: 1, action: 'Booked appointment for Marcus Williams', category: 'barbershop', created_at: new Date(Date.now() - 15*60000).toISOString() },
  { id: 2, action: 'Logged follow-up call — Sarah T.',       category: 'mortgage',   created_at: new Date(Date.now() - 60*60000).toISOString() },
  { id: 3, action: 'Uploaded docs to Chen file',             category: 'mortgage',   created_at: new Date(Date.now() - 90*60000).toISOString() },
  { id: 4, action: 'Sent confirmation text via Twilio',      category: 'barbershop', created_at: new Date(Date.now() - 2*3600000).toISOString() },
]

export default function VADashboard({ toast }) {
  const { data: scheduleData, loading: schedLoading } = useQuery(fetchTodaySchedule)
  const { data: tasksData,    loading: tasksLoading  } = useQuery(fetchMyTasks)
  const { data: activityData, loading: actLoading    } = useQuery(fetchActivityLog)

  const schedule = scheduleData ?? (supabaseConfigured ? [] : demoSchedule)
  const tasks    = tasksData    ?? (supabaseConfigured ? [] : demoTasks)
  const activity = activityData ?? (supabaseConfigured ? [] : demoActivity)

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={['VA Dashboard']} />
      <main className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Kevin's Schedule */}
          <div className="lg:col-span-2 rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
            <div className="flex items-center gap-3 mb-5">
              <Calendar size={16} style={{ color: '#C9A227' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Kevin's Schedule — Today</h2>
            </div>
            {schedLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded-lg" style={{ height: '52px' }} />)}
              </div>
            ) : schedule.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No appointments today.</p>
            ) : (
              <div className="space-y-2">
                {schedule.map(s => {
                  const tc = typeColors[s.category] || typeColors.personal
                  return (
                    <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-white/[0.02]" style={{ border: '1px solid #1E1E2E' }}>
                      <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: '#6B7280' }}>
                        {formatTime(s.start_time)}
                      </span>
                      <span className="flex-1 text-sm font-medium truncate" style={{ color: '#F8F8FF' }}>
                        {s.client_name ? `${s.client_name} — ${s.title}` : s.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: tc.bg, color: tc.color, flexShrink: 0 }}>{s.category}</span>
                      <span className="text-xs capitalize flex-shrink-0" style={{ color: s.status === 'confirmed' ? '#10B981' : s.status === 'pending' ? '#F59E0B' : '#6B7280' }}>{s.status}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#F8F8FF' }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Scissors,     label: 'Book Appointment', color: '#C9A227' },
                { icon: Plus,         label: 'Add Task',         color: '#10B981' },
                { icon: Flag,         label: 'Flag for Kevin',   color: '#F59E0B' },
                { icon: MessageSquare,label: 'Send Message',     color: '#C9A227' },
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
            {tasksLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded" style={{ height: '20px' }} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 py-2">
                    <CheckCircle2 size={15} style={{ color: task.status === 'done' ? '#10B981' : '#1E1E2E', flexShrink: 0 }} />
                    <span className="text-sm flex-1 truncate" style={{ color: task.status === 'done' ? '#6B7280' : '#F8F8FF', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                    <span className="text-xs capitalize flex-shrink-0" style={{ color: task.priority === 'high' || task.priority === 'urgent' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#6B7280' }}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-2 rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
            <div className="flex items-center gap-3 mb-4">
              <Clock size={16} style={{ color: '#C9A227' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Today's Activity Log</h2>
            </div>
            {actLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded" style={{ height: '20px' }} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map(log => (
                  <div key={log.id} className="flex items-center gap-4">
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: '#6B7280', minWidth: '60px' }}>{relativeTime(log.created_at)}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A227' }} />
                    <span className="text-sm" style={{ color: '#F8F8FF' }}>{log.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
