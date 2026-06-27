import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, CheckSquare, MessageSquare, Menu } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home'     },
  { to: '/calendar',  icon: Calendar,         label: 'Calendar' },
  { to: '/tasks',     icon: CheckSquare,       label: 'Tasks'    },
  { to: '/messages',  icon: MessageSquare,     label: 'Messages' },
]

export default function MobileNav() {
  const { toggle } = useSidebar()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(13,13,20,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E1E2E',
        display: 'flex',
        alignItems: 'center',
        /* Safe area for iPhone home indicator */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none', padding: '8px 0' }}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                style={{ color: isActive ? '#C9A227' : '#6B7280', transition: 'color 0.15s' }}
              />
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#C9A227' : '#6B7280',
                lineHeight: '1',
                transition: 'color 0.15s',
              }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {/* More — opens full sidebar drawer */}
      <button
        onClick={toggle}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 0',
        }}
      >
        <Menu size={20} style={{ color: '#6B7280' }} />
        <span style={{ fontSize: '10px', color: '#6B7280', lineHeight: '1' }}>More</span>
      </button>
    </nav>
  )
}
