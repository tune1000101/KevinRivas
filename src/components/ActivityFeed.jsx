import { CheckCircle, Calendar, Phone, FileText, MessageSquare, Star } from 'lucide-react'

const typeConfig = {
  task: { icon: CheckCircle, color: '#10B981' },
  booking: { icon: Calendar, color: '#6366F1' },
  call: { icon: Phone, color: '#F59E0B' },
  document: { icon: FileText, color: '#8B5CF6' },
  message: { icon: MessageSquare, color: '#06B6D4' },
  milestone: { icon: Star, color: '#F59E0B' },
}

function ActivityItem({ item, isLast }) {
  const cfg = typeConfig[item.type] || typeConfig.task
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 group">
      <div className="relative flex flex-col items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
          style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
          <Icon size={13} style={{ color: cfg.color }} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: '#1E1E2E' }} />}
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug" style={{ color: '#F8F8FF' }}>{item.text}</p>
          <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#6B7280' }}>{item.time}</span>
        </div>
        {item.sub && <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{item.sub}</p>}
      </div>
    </div>
  )
}

const demoActivity = [
  { id: 1, type: 'booking', text: 'New appointment booked — Marcus Williams', sub: 'Barbershop · Fade + Beard', time: '10:15 AM' },
  { id: 2, type: 'task', text: 'VA completed: Client follow-up call logged', sub: 'Mortgage Pipeline', time: '10:02 AM' },
  { id: 3, type: 'call', text: 'Dialpad call transcription ready', sub: 'Sarah T. — 12 min conversation', time: '9:47 AM' },
  { id: 4, type: 'document', text: 'Document uploaded to mortgage file', sub: 'Chen Family · Income Verification', time: '9:30 AM' },
  { id: 5, type: 'message', text: 'New message from David Ross', sub: 'Can we schedule a sync for tomorrow?', time: '9:15 AM' },
  { id: 6, type: 'milestone', text: 'Monthly revenue target 82% complete', sub: 'Barbershop + Mortgage combined', time: 'Yesterday' },
]

export default function ActivityFeed({ items = demoActivity, profileName = 'Kevin Rivas', profileRole = 'Admin' }) {
  return (
    <div className="flex flex-col h-full">
      {/* Profile card */}
      <div className="px-5 py-4 text-center" style={{ borderBottom: '1px solid #1E1E2E' }}>
        <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }}>
          {profileName.charAt(0)}
        </div>
        <p className="font-semibold text-sm" style={{ color: '#F8F8FF' }}>{profileName}</p>
        <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{profileRole}</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          {[
            { label: '42', sub: 'Tasks' },
            { label: '28h', sub: 'Logged' },
            { label: '96%', sub: 'Done' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-bold font-mono" style={{ color: '#F8F8FF' }}>{s.label}</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#374151' }}>Recent Activity</p>
        <div>
          {items.map((item, i) => (
            <ActivityItem key={item.id} item={item} isLast={i === items.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
