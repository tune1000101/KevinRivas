import { Scissors, CheckSquare, MessageSquare, DollarSign, Plus } from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import AnalyticsChart from '../components/AnalyticsChart'
import TaskList from '../components/TaskList'
import ActivityFeed from '../components/ActivityFeed'
import { useIsMobile } from '../hooks/useIsMobile'
import { useQuery } from '../hooks/useQuery'
import { supabase, supabaseConfigured } from '../lib/supabase'

function todayRange() {
  const start = new Date(); start.setHours(0,0,0,0)
  const end   = new Date(); end.setHours(23,59,59,999)
  return { start: start.toISOString(), end: end.toISOString() }
}

function startOfMonth() {
  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0)
  return d.toISOString()
}

async function fetchStats() {
  if (!supabaseConfigured) return null
  const { start, end } = todayRange()

  const [appts, tasks, msgs, revenue] = await Promise.all([
    supabase.from('appointments').select('id', { count: 'exact', head: true })
      .gte('start_time', start).lte('start_time', end),
    supabase.from('tasks').select('id', { count: 'exact', head: true })
      .neq('status', 'done'),
    supabase.from('messages').select('id', { count: 'exact', head: true })
      .eq('read', false),
    supabase.from('financial_entries').select('amount')
      .eq('type', 'income').gte('date', startOfMonth()),
  ])

  const monthlyRevenue = (revenue.data || []).reduce((sum, r) => sum + Number(r.amount), 0)

  return {
    appointments: appts.count ?? 0,
    tasks:        tasks.count ?? 0,
    messages:     msgs.count  ?? 0,
    revenue:      monthlyRevenue,
  }
}

export default function AdminDashboard({ toast }) {
  const isMobile = useIsMobile()
  const { data: stats, loading: statsLoading } = useQuery(fetchStats)

  const statCards = [
    {
      icon: Scissors,
      label: "Today's Appointments",
      value: statsLoading ? '—' : String(stats?.appointments ?? 0),
      change: 14,
      changeLabel: '+2 vs yesterday',
      color: '#C9A227',
    },
    {
      icon: CheckSquare,
      label: 'Pending Tasks',
      value: statsLoading ? '—' : String(stats?.tasks ?? 0),
      change: -5,
      changeLabel: 'by priority',
      color: '#F59E0B',
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: statsLoading ? '—' : String(stats?.messages ?? 0),
      change: 8,
      changeLabel: 'Across all channels',
      color: '#10B981',
    },
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: statsLoading ? '—' : `$${(stats?.revenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      change: 4.2,
      changeLabel: 'vs last month',
      color: '#C9A227',
    },
  ]

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={['Dashboard']} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto" style={{ padding: isMobile ? '16px' : '32px' }}>

          {/* Stat cards */}
          <section>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '12px',
            }}>
              {statCards.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          {/* Analytics */}
          <section className="rounded-xl" style={{ background: '#111118', border: '1px solid #1E1E2E', padding: '24px', marginTop: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div style={{ lineHeight: '1.5' }}>
                <h2 className="font-semibold" style={{ color: '#F8F8FF', fontSize: '14px' }}>Analytics</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>Weekly performance overview</p>
              </div>
              <span style={{ background: '#16161F', color: '#6B7280', border: '1px solid #1E1E2E', borderRadius: '999px', fontSize: '11px', padding: '4px 12px', lineHeight: '1.5' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <AnalyticsChart />
          </section>

          {/* Tasks */}
          <section style={{ marginTop: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div style={{ lineHeight: '1.5' }}>
                <h2 className="font-semibold" style={{ color: '#F8F8FF', fontSize: '14px' }}>Active Tasks</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>
                  {statsLoading ? '—' : `${stats?.tasks ?? 0} remaining`}
                </p>
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                {!isMobile && (
                  <span style={{ background: '#0D0D14', color: '#6B7280', border: '1px solid #1E1E2E', borderRadius: '8px', fontSize: '11px', padding: '6px 12px', lineHeight: '1.5' }}>
                    This Week
                  </span>
                )}
                <button
                  onClick={() => toast?.({ title: 'New Task', description: 'Task creation coming soon', type: 'info' })}
                  className="flex items-center font-medium transition-all hover:opacity-80"
                  style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '8px', fontSize: '11px', padding: '6px 12px', lineHeight: '1.5', gap: '6px', cursor: 'pointer' }}
                >
                  <Plus size={13} /> Add Task
                </button>
              </div>
            </div>
            <TaskList />
          </section>

          <div style={{ height: '32px' }} />
        </main>

        {/* Activity feed sidebar */}
        <aside className="hidden xl:flex flex-col flex-shrink-0 overflow-hidden" style={{ width: '280px', background: '#0D0D14', borderLeft: '1px solid #1E1E2E' }}>
          <ActivityFeed profileName="Kevin Rivas" profileRole="Admin" />
        </aside>
      </div>
    </div>
  )
}
