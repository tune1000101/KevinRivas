import { Bell, Search, ChevronRight, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
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
  const { open, toggle } = useSidebar()
  const now = useLiveTime()
  const name = profile?.name || user?.name || 'Kevin'

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 sticky top-0 z-30"
      style={{
        height: '64px',
        paddingLeft: '24px',
        paddingRight: '24px',
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E1E2E',
      }}
    >
      {/* Left: hamburger + breadcrumb + greeting */}
      <div className="flex items-center" style={{ gap: '16px' }}>
        {/* Hamburger toggle */}
        <button
          onClick={toggle}
          className="flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid #1E1E2E',
            color: '#6B7280',
          }}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        <div style={{ lineHeight: '1.5' }}>
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2" style={{ color: '#6B7280', fontSize: '11px', marginBottom: '2px' }}>
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight size={11} />}
                  <span style={{ color: i === breadcrumbs.length - 1 ? '#F8F8FF' : '#6B7280' }}>{b}</span>
                </span>
              ))}
            </div>
          )}
          <h1 className="font-semibold" style={{ color: '#F8F8FF', fontSize: '15px', lineHeight: '1.5' }}>
            {greeting}, {name.split(' ')[0]}
            <span className="font-normal" style={{ color: '#6B7280', fontSize: '13px' }}>
              {' '}— {dateStr} · {timeStr}
            </span>
          </h1>
        </div>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center" style={{ gap: '12px' }}>
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute" style={{ color: '#6B7280', left: '12px', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="outline-none transition-all"
            style={{
              background: '#111118',
              border: '1px solid #1E1E2E',
              borderRadius: '8px',
              color: '#F8F8FF',
              fontSize: '13px',
              lineHeight: '1.5',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: '36px',
              paddingRight: '16px',
              width: '280px',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#1E1E2E'}
          />
        </div>

        <button
          className="relative flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/5"
          style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #1E1E2E' }}
        >
          <Bell size={16} style={{ color: '#6B7280' }} />
          <span className="absolute" style={{
            top: '6px', right: '6px',
            width: '7px', height: '7px',
            borderRadius: '50%',
            background: '#6366F1',
            boxShadow: '0 0 6px rgba(99,102,241,0.8)',
          }} />
        </button>

        <div
          className="flex items-center justify-center font-semibold cursor-pointer flex-shrink-0"
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: '#fff', fontSize: '14px',
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
