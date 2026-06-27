import { Clock, MoreHorizontal, Circle, Loader, CheckCircle2 } from 'lucide-react'

const statusConfig = {
  'In Progress': { color: '#6366F1', bg: 'rgba(99,102,241,0.12)', icon: Loader },
  'Pending': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Circle },
  'Done': { color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle2 },
  'Reviewing': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', icon: Circle },
}

const categoryColors = {
  Barbershop: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  Mortgage: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  Personal: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
}

const priorityColors = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#10B981',
}

function TaskRow({ task }) {
  const status = statusConfig[task.status] || statusConfig['Pending']
  const StatusIcon = status.icon
  const cat = categoryColors[task.category] || categoryColors.Personal

  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5 group transition-colors hover:bg-white/[0.02] cursor-pointer"
      style={{ borderBottom: '1px solid #1E1E2E' }}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: priorityColors[task.priority] || '#6B7280' }} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#F8F8FF' }}>{task.title}</p>
        {task.sub && <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>{task.sub}</p>}
      </div>

      <span className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
        style={{ background: cat.bg, color: cat.color }}>
        {task.category}
      </span>

      <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
        style={{ background: status.bg, color: status.color }}>
        <StatusIcon size={11} />
        {task.status}
      </span>

      <span className="flex items-center gap-1 text-xs hidden md:flex" style={{ color: '#6B7280' }}>
        <Clock size={11} />
        {task.time}
      </span>

      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
        style={{ color: '#6B7280' }}>
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
          <div key={i} className="flex gap-4 px-5 py-4" style={{ borderBottom: '1px solid #1E1E2E' }}>
            <div className="skeleton h-3 w-3 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-48" />
              <div className="skeleton h-2 w-32" />
            </div>
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>
      {tasks.map(task => <TaskRow key={task.id} task={task} />)}
      {tasks.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: '#6B7280' }}>No tasks yet — enjoy the quiet.</p>
        </div>
      )}
    </div>
  )
}
