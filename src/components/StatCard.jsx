import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, change, changeLabel, color = '#6366F1', loading = false }) {
  if (loading) {
    return (
      <div className="card-hover rounded-xl p-5 flex flex-col gap-4"
        style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
        <div className="skeleton h-8 w-8 rounded-lg" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-7 w-16" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    )
  }

  const positive = change >= 0

  return (
    <div className="card-hover rounded-xl p-5 flex flex-col gap-3"
      style={{ background: '#111118', border: '1px solid #1E1E2E' }}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: positive ? '#10B981' : '#EF4444',
          }}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </span>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6B7280' }}>{label}</p>
        <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: '#F8F8FF' }}>{value}</p>
        {changeLabel && (
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{changeLabel}</p>
        )}
      </div>
    </div>
  )
}
