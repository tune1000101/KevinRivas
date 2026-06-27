import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, change, changeLabel, color = '#C9A227', loading = false }) {
  if (loading) {
    return (
      <div
        className="card-hover rounded-xl flex flex-col"
        style={{
          background: '#111118',
          border: '1px solid #1E1E2E',
          padding: '20px',
          minHeight: '120px',
          gap: '16px',
        }}
      >
        <div className="skeleton rounded-lg" style={{ width: '36px', height: '36px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="skeleton rounded" style={{ height: '10px', width: '96px' }} />
          <div className="skeleton rounded" style={{ height: '24px', width: '64px' }} />
          <div className="skeleton rounded" style={{ height: '10px', width: '80px' }} />
        </div>
      </div>
    )
  }

  const positive = change >= 0

  return (
    <div
      className="card-hover rounded-xl flex flex-col"
      style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        padding: '20px',
        minHeight: '120px',
        gap: '16px',
      }}
    >
      {/* Icon row + badge top-right */}
      <div className="flex items-start justify-between">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: `${color}18`,
          }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        <span
          className="flex items-center font-medium"
          style={{
            background: positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: positive ? '#10B981' : '#EF4444',
            borderRadius: '999px',
            fontSize: '11px',
            lineHeight: '1.5',
            padding: '3px 8px',
            gap: '4px',
            display: 'flex',
          }}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </span>
      </div>

      {/* Label + value + sub */}
      <div style={{ lineHeight: '1.5' }}>
        <p
          className="font-medium uppercase tracking-wider"
          style={{ color: '#6B7280', fontSize: '10px', marginBottom: '4px' }}
        >
          {label}
        </p>
        <p
          className="font-bold font-mono tracking-tight"
          style={{ color: '#F8F8FF', fontSize: '24px', lineHeight: '1.2' }}
        >
          {value}
        </p>
        {changeLabel && (
          <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{changeLabel}</p>
        )}
      </div>
    </div>
  )
}
