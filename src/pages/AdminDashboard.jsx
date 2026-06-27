import { Scissors, CheckSquare, MessageSquare, DollarSign, Plus } from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import AnalyticsChart from '../components/AnalyticsChart'
import TaskList from '../components/TaskList'
import ActivityFeed from '../components/ActivityFeed'

export default function AdminDashboard({ toast }) {
  const stats = [
    { icon: Scissors, label: "Today's Appointments", value: '8', change: 14, changeLabel: '+2 vs yesterday', color: '#6366F1' },
    { icon: CheckSquare, label: 'Pending Tasks', value: '12', change: -5, changeLabel: '3 high priority', color: '#F59E0B' },
    { icon: MessageSquare, label: 'Unread Messages', value: '5', change: 8, changeLabel: 'Across all channels', color: '#10B981' },
    { icon: DollarSign, label: 'Monthly Revenue', value: '$18.4K', change: 4.2, changeLabel: '+$740 vs last month', color: '#8B5CF6' },
  ]

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={['Dashboard']} />

      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable center */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Stat cards */}
          <section>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          {/* Analytics */}
          <section className="rounded-xl p-6" style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Analytics</h2>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Weekly performance overview</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#16161F', color: '#6B7280', border: '1px solid #1E1E2E' }}>
                20–26 Jun
              </span>
            </div>
            <AnalyticsChart />
          </section>

          {/* Active Tasks */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#F8F8FF' }}>Active Tasks</h2>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>4 remaining this week</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#111118', color: '#6B7280', border: '1px solid #1E1E2E' }}>
                  This Week
                </span>
                <button
                  onClick={() => toast?.({ title: 'New Task', description: 'Task creation coming soon', type: 'info' })}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  <Plus size={13} /> Add Task
                </button>
              </div>
            </div>
            <TaskList />
          </section>
        </main>

        {/* Right sidebar — activity feed */}
        <aside
          className="hidden xl:flex flex-col overflow-y-auto"
          style={{ width: '300px', background: '#0D0D14', borderLeft: '1px solid #1E1E2E' }}
        >
          <ActivityFeed profileName="Kevin Rivas" profileRole="Admin" />
        </aside>
      </div>
    </div>
  )
}
