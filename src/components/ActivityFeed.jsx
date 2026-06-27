import { CheckCircle, Calendar, Phone, FileText, MessageSquare, Star } from 'lucide-react'

const typeConfig = {
  task:      { icon: CheckCircle,   color: '#10B981' },
  booking:   { icon: Calendar,      color: '#C9A227' },
  call:      { icon: Phone,         color: '#F59E0B' },
  document:  { icon: FileText,      color: '#C9A227' },
  message:   { icon: MessageSquare, color: '#06B6D4' },
  milestone: { icon: Star,          color: '#F59E0B' },
}

function ActivityItem({ item, isLast }) {
  const cfg = typeConfig[item.type] || typeConfig.task
  const Icon = cfg.icon

  return (
    <div className="flex" style={{ gap: '12px' }}>
      {/* Icon column + timeline connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="flex items-center justify-center z-10"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            flexShrink: 0,
          }}
        >
          <Icon size={13} style={{ color: cfg.color }} />
        </div>
        {!isLast && (
          <div style={{ width: '1px', flex: 1, marginTop: '4px', background: '#1E1E2E' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? '0' : '16px', flex: 1, minWidth: 0, paddingTop: '4px' }}>
        <div className="flex items-start justify-between" style={{ gap: '8px' }}>
          <p style={{ color: '#F8F8FF', fontSize: '12px', lineHeight: '1.5', flex: 1 }}>
            {item.text}
          </p>
          <span
            className="flex-shrink-0"
            style={{ color: '#6B7280', fontSize: '10px', lineHeight: '1.5', paddingTop: '1px' }}
          >
            {item.time}
          </span>
        </div>
        {item.sub && (
          <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px', lineHeight: '1.5' }}>
            {item.sub}
          </p>
        )}
      </div>
    </div>
  )
}

const demoActivity = [
  { id: 1, type: 'booking',   text: 'New appointment booked — Marcus Williams', sub: 'Barbershop · Fade + Beard',              time: '10:15 AM' },
  { id: 2, type: 'task',      text: 'VA completed: Client follow-up call logged', sub: 'Mortgage Pipeline',                    time: '10:02 AM' },
  { id: 3, type: 'call',      text: 'Dialpad call transcription ready',           sub: 'Sarah T. — 12 min conversation',       time: '9:47 AM'  },
  { id: 4, type: 'document',  text: 'Document uploaded to mortgage file',         sub: 'Chen Family · Income Verification',    time: '9:30 AM'  },
  { id: 5, type: 'message',   text: 'New message from David Ross',                sub: 'Can we schedule a sync for tomorrow?', time: '9:15 AM'  },
  { id: 6, type: 'milestone', text: 'Monthly revenue target 82% complete',        sub: 'Barbershop + Mortgage combined',       time: 'Yesterday'},
]

export default function ActivityFeed({ items = demoActivity, profileName = 'Kevin Rivas', profileRole = 'Admin' }) {
  return (
    <div className="flex flex-col h-full">
      {/* Profile card — 20px padding, clear border bottom */}
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #1E1E2E',
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-center font-bold mx-auto"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A227, #C9A227)',
            color: '#fff',
            fontSize: '18px',
            marginBottom: '12px',
          }}
        >
          {profileName.charAt(0)}
        </div>
        <p className="font-semibold" style={{ color: '#F8F8FF', fontSize: '13px', lineHeight: '1.5' }}>
          {profileName}
        </p>
        <p className="capitalize" style={{ color: '#6B7280', fontSize: '11px', lineHeight: '1.5', marginTop: '2px' }}>
          {profileRole}
        </p>

        {/* Mini stats */}
        <div className="flex items-center justify-center" style={{ gap: '24px', marginTop: '16px' }}>
          {[
            { label: '42',  sub: 'Tasks'  },
            { label: '28h', sub: 'Logged' },
            { label: '96%', sub: 'Done'   },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p className="font-bold font-mono" style={{ color: '#F8F8FF', fontSize: '14px', lineHeight: '1.5' }}>{s.label}</p>
              <p style={{ color: '#6B7280', fontSize: '10px', lineHeight: '1.5' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px 16px' }}>
        <p
          className="font-semibold uppercase tracking-widest"
          style={{ color: '#374151', fontSize: '10px', lineHeight: '1.5', marginBottom: '16px' }}
        >
          Recent Activity
        </p>
        <div>
          {items.map((item, i) => (
            <ActivityItem key={item.id} item={item} isLast={i === items.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
