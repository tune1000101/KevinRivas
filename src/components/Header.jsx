import { Bell, Search, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

function useLiveTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function Header({ breadcrumbs = [] }) {
  const { user, profile } = useAuth()
  const now = useLiveTime()
  const name = profile?.name || user?.name || 'Kevin'

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <header
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-30"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1E1E2E' }}
    >
      {/* Left: greeting + breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: '#6B7280' }}>
          <span>Kevin OS</span>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight size={12} />
              <span style={{ color: i === breadcrumbs.length - 1 ? '#F8F8FF' : '#6B7280' }}>{b}</span>
            </span>
          ))}
        </div>
        <h1 className="text-lg font-semibold" style={{ color: '#F8F8FF' }}>
          {greeting}, {name.split(' ')[0]} <span className="text-sm font-normal" style={{ color: '#6B7280' }}>— {dateStr} · {timeStr}</span>
        </h1>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{
              background: '#111118',
              border: '1px solid #1E1E2E',
              color: '#F8F8FF',
              width: '220px',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#1E1E2E'}
          />
        </div>

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
          style={{ border: '1px solid #1E1E2E' }}
        >
          <Bell size={16} style={{ color: '#6B7280' }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#6366F1', boxShadow: '0 0 6px rgba(99,102,241,0.8)' }}
          />
        </button>

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
