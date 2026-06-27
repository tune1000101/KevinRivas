import { useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

const barbershopData = [
  { day: 'Mon', active: 12, passive: 8 },
  { day: 'Tue', active: 19, passive: 11 },
  { day: 'Wed', active: 15, passive: 9 },
  { day: 'Thu', active: 22, passive: 14 },
  { day: 'Fri', active: 28, passive: 16 },
  { day: 'Sat', active: 35, passive: 20 },
  { day: 'Sun', active: 18, passive: 10 },
]

const mortgageData = [
  { day: 'Mon', active: 3, passive: 1 },
  { day: 'Tue', active: 5, passive: 2 },
  { day: 'Wed', active: 4, passive: 3 },
  { day: 'Thu', active: 7, passive: 2 },
  { day: 'Fri', active: 6, passive: 4 },
  { day: 'Sat', active: 2, passive: 1 },
  { day: 'Sun', active: 1, passive: 0 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: '#16161F', border: '1px solid #1E1E2E' }}>
      <p className="font-medium mb-1.5" style={{ color: '#F8F8FF' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: '#6B7280' }}>{p.name}:</span>
          <span className="font-mono font-medium" style={{ color: '#F8F8FF' }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsChart({ loading = false }) {
  const [mode, setMode] = useState('barbershop')
  const data = mode === 'barbershop' ? barbershopData : mortgageData

  if (loading) {
    return <div className="skeleton w-full h-48 rounded-lg" />
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {['barbershop', 'mortgage'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: mode === m ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: mode === m ? '#6366F1' : '#6B7280',
              border: `1px solid ${mode === m ? 'rgba(99,102,241,0.4)' : '#1E1E2E'}`,
            }}
          >
            {m}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-4 text-xs" style={{ color: '#6B7280' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#1E1E2E' }} />
            Passive
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="passiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#374151" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#374151" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1E1E2E' }} />
          <Area type="monotone" dataKey="active" name="Active" stroke="#6366F1" strokeWidth={2} fill="url(#activeGrad)" dot={false} activeDot={{ r: 4, fill: '#6366F1' }} />
          <Area type="monotone" dataKey="passive" name="Passive" stroke="#374151" strokeWidth={2} fill="url(#passiveGrad)" dot={false} activeDot={{ r: 4, fill: '#374151' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
