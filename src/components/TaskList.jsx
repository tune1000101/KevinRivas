import { Clock, MoreHorizontal, Circle, Loader, CheckCircle2 } from 'lucide-react'

const statusConfig = {
  'In Progress': { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', icon: Loader },
  'Pending':     { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: Circle },
  'Done':        { color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2 },
  'Reviewing':   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', icon: Circle },
}

const categoryColors = {
  Barbershop: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  Mortgage:   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  Personal:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
}

const priorityColors = {
  High:   '#EF4444',
  Medium: '#F59E0B',
  Low:    '#10B981',
}

function TaskRow({ task }) {
  const status = statusConfig[task.status] || statusConfig['Pending']
  const StatusIcon = status.icon
  const cat = categoryColors[task.category] || categoryColors.Personal

  return (
    <div
      className="flex items-center group transition-colors hover:bg-white/[0.02] cursor-pointer"
      style={{
        gap: '16px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(30,30,46,0.8)',
        lineHeight: '1.5',
      }}
    >
      {/* Priority dot */}
      <div
        className="flex-shrink-0"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: priorityColors[task.priority] || '#6B7280',
        }}
      />

      {/* Title + sub */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ color: '#F8F8FF', fontSize: '13px' }}>{task.title}</p>
        {task.sub && (
          <p className="truncate" style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px' }}>{task.sub}</p>
        )}
      </div>

      {/* Category tag */}
      <span
        className="hidden sm:block flex-shrink-0"
        style={{
          background: cat.bg,
          color: cat.color,
          borderRadius: '999px',
          fontSize: '11px',
          padding: '3px 10px',
          lineHeight: '1.5',
        }}
      >
        {task.category}
      </span>

      {/* Status badge */}
      <span
        className="flex items-center flex-shrink-0"
        style={{
          background: status.bg,
          color: status.color,
          borderRadius: '999px',
          fontSize: '11px',
          padding: '4px 10px',
          lineHeight: '1.5',
          gap: '5px',
        }}
      >
        <StatusIcon size={10} />
        {task.status}
      </span>

      {/* Time — rightmost data element */}
      <span
        className="hidden md:flex items-center flex-shrink-0"
        style={{ color: '#6B7280', fontSize: '11px', gap: '4px' }}
      >
        <Clock size={11} />
        {task.time}
      </span>

      {/* Overflow menu — reveal on hover */}
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        style={{ color: '#6B7280', padding: '4px' }}
      >
        <MoreHorizontal size={14} />
      </button>
    </div>
  )
}

const demoTasks = [
  { id: 1, title: 'Q3 Financial Report Design', sub: 'Review revenue breakdown', category: 'Mortgage', status: 'In Progress', priority: 'High', time: '3h 20m' },
  { id: 2, title: 'Competitor Analysis', sub: 'Market research for expansion', category: 'Barbershop', status: 'Reviewing', priority: 'Medium', time: '6h' },
  { id: 3, title: 'Dashboard Implementation', sub: 'VA portal setup', category: 'Personal', status: 'Done', priority: 'Low', time: '12h' },
  { id: 4, title: 'Follow up: Chen Family Pre-Approval', sub: 'Send updated loan estimate', category: 'Mortgage', status: 'Pending', priority: 'High', time: '30m' },
  { id: 5, title: 'Schedule staff meeting', sub: 'Jordan & Marcus availability', category: 'Barbershop', status: 'Pending', priority: 'Medium', time: '1h' },
]

export default function TaskList({ tasks = demoTasks, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center"
            style={{ gap: '16px', padding: '16px 20px', borderBottom: '1px solid #1E1E2E' }}
          >
            <div className="skeleton rounded-full" style={{ width: '6px', height: '6px', flexShrink: 0 }} />
            <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton rounded" style={{ height: '12px', width: '192px' }} />
              <div className="skeleton rounded" style={{ height: '10px', width: '128px' }} />
            </div>
            <div className="skeleton rounded-full" style={{ height: '22px', width: '80px' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>
      {tasks.map(task => <TaskRow key={task.id} task={task} />)}
      {tasks.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>No tasks yet — enjoy the quiet.</p>
        </div>
      )}
    </div>
  )
}
