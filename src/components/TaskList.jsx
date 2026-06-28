import { Clock, MoreHorizontal, Circle, Loader, CheckCircle2 } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { supabase, supabaseConfigured } from '../lib/supabase'

const statusConfig = {
  'in_progress': { label: 'In Progress', color: '#C9A227',  bg: 'rgba(201,162,39,0.12)',  icon: Loader       },
  'pending':     { label: 'Pending',     color: '#F59E0B',  bg: 'rgba(245,158,11,0.12)',  icon: Circle       },
  'done':        { label: 'Done',        color: '#10B981',  bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2 },
}

const categoryColors = {
  barbershop: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'  },
  mortgage:   { color: '#C9A227', bg: 'rgba(201,162,39,0.1)' },
  personal:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  cars:       { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
}

const priorityColors = {
  urgent: '#EF4444',
  high:   '#EF4444',
  medium: '#F59E0B',
  low:    '#10B981',
}

async function fetchTasks() {
  if (!supabaseConfigured) return null
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .neq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}

function TaskRow({ task }) {
  const status = statusConfig[task.status] || statusConfig['pending']
  const StatusIcon = status.icon
  const cat = categoryColors[task.category] || categoryColors.personal

  return (
    <div
      className="flex items-center group transition-colors hover:bg-white/[0.02] cursor-pointer"
      style={{ gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(30,30,46,0.8)', lineHeight: '1.5' }}
    >
      <div className="flex-shrink-0" style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityColors[task.priority] || '#6B7280' }} />

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ color: '#F8F8FF', fontSize: '13px' }}>{task.title}</p>
        {task.description && (
          <p className="truncate" style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px' }}>{task.description}</p>
        )}
      </div>

      <span className="hidden sm:block flex-shrink-0" style={{ background: cat.bg, color: cat.color, borderRadius: '999px', fontSize: '11px', padding: '3px 10px', lineHeight: '1.5', textTransform: 'capitalize' }}>
        {task.category}
      </span>

      <span className="flex items-center flex-shrink-0" style={{ background: status.bg, color: status.color, borderRadius: '999px', fontSize: '11px', padding: '4px 10px', lineHeight: '1.5', gap: '5px' }}>
        <StatusIcon size={10} />
        {status.label}
      </span>

      {task.due_date && (
        <span className="hidden md:flex items-center flex-shrink-0" style={{ color: '#6B7280', fontSize: '11px', gap: '4px' }}>
          <Clock size={11} />
          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}

      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: '#6B7280', padding: '4px' }}>
        <MoreHorizontal size={14} />
      </button>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center" style={{ gap: '16px', padding: '16px 20px', borderBottom: '1px solid #1E1E2E' }}>
      <div className="skeleton rounded-full" style={{ width: '6px', height: '6px', flexShrink: 0 }} />
      <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="skeleton rounded" style={{ height: '12px', width: '192px' }} />
        <div className="skeleton rounded" style={{ height: '10px', width: '128px' }} />
      </div>
      <div className="skeleton rounded-full" style={{ height: '22px', width: '80px' }} />
    </div>
  )
}

const demoTasks = [
  { id: 1, title: 'Follow up: Chen Family Pre-Approval', description: 'Send updated loan estimate', category: 'mortgage',   status: 'pending',     priority: 'high',   due_date: null },
  { id: 2, title: 'Review Q3 Financial Report',          description: 'Revenue breakdown',          category: 'personal',   status: 'in_progress', priority: 'high',   due_date: null },
  { id: 3, title: 'Update Square service menu',          description: 'Add new fade pricing',       category: 'barbershop', status: 'pending',     priority: 'medium', due_date: null },
  { id: 4, title: 'Submit David Ross application',       description: 'Complete 1003 form',         category: 'mortgage',   status: 'in_progress', priority: 'urgent', due_date: null },
  { id: 5, title: 'Staff schedule: July',                description: 'Jordan & Marcus',            category: 'barbershop', status: 'pending',     priority: 'medium', due_date: null },
]

export default function TaskList() {
  const { data, loading } = useQuery(fetchTasks)
  const tasks = data ?? (supabaseConfigured ? [] : demoTasks)

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>
      {loading ? (
        [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
      ) : tasks.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>No active tasks — enjoy the quiet.</p>
        </div>
      ) : (
        tasks.map(task => <TaskRow key={task.id} task={task} />)
      )}
    </div>
  )
}
