import { Scissors, CheckSquare, MessageSquare, DollarSign, Plus } from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import AnalyticsChart from '../components/AnalyticsChart'
import TaskList from '../components/TaskList'
import ActivityFeed from '../components/ActivityFeed'
import { useIsMobile } from '../hooks/useIsMobile'

export default function AdminDashboard({ toast }) {
  const isMobile = useIsMobile()
  const stats = [
    { icon: Scissors,      label: "Today's Appointments", value: '8',      change: 14,  changeLabel: '+2 vs yesterday',    color: '#C9A227' },
    { icon: CheckSquare,   label: 'Pending Tasks',         value: '12',     change: -5,  changeLabel: '3 high priority',    color: '#F59E0B' },
    { icon: MessageSquare, label: 'Unread Messages',       value: '5',      change: 8,   changeLabel: 'Across all channels', color: '#10B981' },
    { icon: DollarSign,    label: 'Monthly Revenue',       value: '$18.4K', change: 4.2, changeLabel: '+$740 vs last month', color: '#C9A227' },
  ]

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={['Dashboard']} />

      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: isMobile ? '16px' : '32px' }}>

          {/* Stat cards — 4-col desktop, 2-col mobile */}
          <section>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '12px',
              }}
            >
              {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          {/* Analytics — 24px gap from stat cards */}
          <section
            className="rounded-xl"
            style={{
              background: '#111118',
              border: '1px solid #1E1E2E',
              padding: '24px',
              marginTop: '24px',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div style={{ lineHeight: '1.5' }}>
                <h2 className="font-semibold" style={{ color: '#F8F8FF', fontSize: '14px' }}>Analytics</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>Weekly performance overview</p>
              </div>
              <span
                style={{
                  background: '#16161F',
                  color: '#6B7280',
                  border: '1px solid #1E1E2E',
                  borderRadius: '999px',
                  fontSize: '11px',
                  padding: '4px 12px',
                  lineHeight: '1.5',
                }}
              >
                20–26 Jun
              </span>
            </div>
            <AnalyticsChart />
          </section>

          {/* Active Tasks — 24px gap from analytics */}
          <section style={{ marginTop: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div style={{ lineHeight: '1.5' }}>
                <h2 className="font-semibold" style={{ color: '#F8F8FF', fontSize: '14px' }}>Active Tasks</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>4 remaining this week</p>
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                {!isMobile && (
                  <span
                    style={{
                      background: '#0D0D14',
                      color: '#6B7280',
                      border: '1px solid #1E1E2E',
                      borderRadius: '8px',
                      fontSize: '11px',
                      padding: '6px 12px',
                      lineHeight: '1.5',
                    }}
                  >
                    This Week
                  </span>
                )}
                <button
                  onClick={() => toast?.({ title: 'New Task', description: 'Task creation coming soon', type: 'info' })}
                  className="flex items-center font-medium transition-all hover:opacity-80"
                  style={{
                    background: 'rgba(201,162,39,0.2)',
                    color: '#C9A227',
                    border: '1px solid rgba(201,162,39,0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    padding: '6px 12px',
                    lineHeight: '1.5',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} /> Add Task
                </button>
              </div>
            </div>
            <TaskList />
          </section>

          {/* Bottom breathing room */}
          <div style={{ height: '32px' }} />
        </main>

        {/* Right sidebar — activity feed, exactly 280px */}
        <aside
          className="hidden xl:flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: '280px',
            background: '#0D0D14',
            borderLeft: '1px solid #1E1E2E',
          }}
        >
          <ActivityFeed profileName="Kevin Rivas" profileRole="Admin" />
        </aside>
      </div>
    </div>
  )
}
