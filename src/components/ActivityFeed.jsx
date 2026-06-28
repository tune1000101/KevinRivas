import { CheckCircle, Calendar, Phone, FileText, MessageSquare, Star } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const categoryConfig = {
  barbershop: { icon: Calendar,      color: '#C9A227' },
  mortgage:   { icon: FileText,      color: '#C9A227' },
  personal:   { icon: Star,          color: '#F59E0B' },
  message:    { icon: MessageSquare, color: '#06B6D4' },
  call:       { icon: Phone,         color: '#F59E0B' },
  default:    { icon: CheckCircle,   color: '#10B981' },
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ActivityItem({ item, isLast }) {
  const cfg = categoryConfig[item.category] || categoryConfig.default
  const Icon = cfg.icon

  return (
    <div className="flex" style={{ gap: '12px' }}>
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex items-center justify-center z-10" style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, flexShrink: 0 }}>
          <Icon size={13} style={{ color: cfg.color }} />
        </div>
        {!isLast && <div style={{ width: '1px', flex: 1, marginTop: '4px', background: '#1E1E2E' }} />}
      </div>

      <div style={{ paddingBottom: isLast ? '0' : '16px', flex: 1, minWidth: 0, paddingTop: '4px' }}>
        <div className="flex items-start justify-between" style={{ gap: '8px' }}>
          <p style={{ color: '#F8F8FF', fontSize: '12px', lineHeight: '1.5', flex: 1 }}>{item.action}</p>
          <span className="flex-shrink-0" style={{ color: '#6B7280', fontSize: '10px', lineHeight: '1.5', paddingTop: '1px' }}>
            {relativeTime(item.created_at)}
          </span>
        </div>
        {item.description && (
          <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px', lineHeight: '1.5' }}>{item.description}</p>
        )}
      </div>
    </div>
  )
}

async function fetchActivity() {
  if (!supabaseConfigured) return null
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)
  if (error) throw error
  return data
}

async function fetchProfileStats() {
  if (!supabaseConfigured) return null
  const [taskCount, doneCount] = await Promise.all([
    supabase.from('tasks').select('id', { count: 'exact', head: true }),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'done'),
  ])
  const total = taskCount.count ?? 0
  const done  = doneCount.count  ?? 0
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, pct }
}

const demoActivity = [
  { id: 1, action: 'Booked appointment for Marcus Williams', description: 'Barbershop · Fade + Beard',           category: 'barbershop', created_at: new Date(Date.now() - 15*60000).toISOString() },
  { id: 2, action: 'Logged follow-up call — Sarah Thompson', description: 'Mortgage Pipeline',                   category: 'mortgage',   created_at: new Date(Date.now() - 30*60000).toISOString() },
  { id: 3, action: 'Document uploaded to Chen file',         description: 'Income Verification',                 category: 'mortgage',   created_at: new Date(Date.now() - 60*60000).toISOString() },
  { id: 4, action: 'New message from David Ross',            description: 'Can we schedule a sync?',            category: 'message',    created_at: new Date(Date.now() - 90*60000).toISOString() },
  { id: 5, action: 'Monthly revenue target 82% complete',    description: 'Barbershop + Mortgage combined',     category: 'personal',   created_at: new Date(Date.now() - 86400000).toISOString() },
]

export default function ActivityFeed({ profileName = 'Kevin Rivas', profileRole = 'Admin' }) {
  const { data: activity, loading: actLoading } = useQuery(fetchActivity)
  const { data: stats } = useQuery(fetchProfileStats)

  const items = activity ?? (supabaseConfigured ? [] : demoActivity)
  const taskTotal = stats?.total ?? 42
  const taskPct   = stats?.pct   ?? 96

  return (
    <div className="flex flex-col h-full">
      {/* Profile card */}
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1E1E2E', flexShrink: 0 }}>
        <div className="flex items-center justify-center font-bold mx-auto" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A227, #A8891F)', color: '#0A0A0F', fontSize: '18px', marginBottom: '12px' }}>
          {profileName.charAt(0)}
        </div>
        <p className="font-semibold" style={{ color: '#F8F8FF', fontSize: '13px', lineHeight: '1.5' }}>{profileName}</p>
        <p className="capitalize" style={{ color: '#6B7280', fontSize: '11px', lineHeight: '1.5', marginTop: '2px' }}>{profileRole}</p>

        <div className="flex items-center justify-center" style={{ gap: '24px', marginTop: '16px' }}>
          {[
            { label: String(taskTotal), sub: 'Tasks'  },
            { label: `${taskPct}%`,     sub: 'Done'   },
          ].map(s => (
            <div key={s.sub} style={{ textAlign: 'center' }}>
              <p className="font-bold font-mono" style={{ color: '#F8F8FF', fontSize: '14px', lineHeight: '1.5' }}>{s.label}</p>
              <p style={{ color: '#6B7280', fontSize: '10px', lineHeight: '1.5' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px 16px' }}>
        <p className="font-semibold uppercase tracking-widest" style={{ color: '#374151', fontSize: '10px', lineHeight: '1.5', marginBottom: '16px' }}>
          Recent Activity
        </p>
        {actLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex" style={{ gap: '12px' }}>
                <div className="skeleton rounded-full flex-shrink-0" style={{ width: '28px', height: '28px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                  <div className="skeleton rounded" style={{ height: '12px', width: '80%' }} />
                  <div className="skeleton rounded" style={{ height: '10px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {items.map((item, i) => (
              <ActivityItem key={item.id} item={item} isLast={i === items.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
