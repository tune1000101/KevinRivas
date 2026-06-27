import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {
  LayoutDashboard, Calendar, CheckSquare, Scissors, Users, Tag,
  TrendingUp, Briefcase, FileText, Phone, MessageSquare, Bell,
  DollarSign, BookOpen, Zap, Settings, UserCheck, LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { useIsMobile } from '../hooks/useIsMobile'

const sections = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/calendar',  icon: Calendar,         label: 'Calendar',  badge: 'Sync'   },
      { to: '/tasks',     icon: CheckSquare,       label: 'Tasks'                      },
    ],
  },
  {
    label: 'Barbershop',
    items: [
      { to: '/bookings', icon: Scissors, label: 'Bookings', badge: 'Square' },
      { to: '/staff',    icon: Users,    label: 'Staff'                      },
      { to: '/services', icon: Tag,      label: 'Services'                   },
    ],
  },
  {
    label: 'Mortgage',
    items: [
      { to: '/pipeline',  icon: TrendingUp, label: 'Pipeline'  },
      { to: '/clients',   icon: Briefcase,  label: 'Clients'   },
      { to: '/documents', icon: FileText,   label: 'Documents' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { to: '/phone',         icon: Phone,         label: 'Phone',         badge: 'Dialpad' },
      { to: '/messages',      icon: MessageSquare, label: 'Messages'                        },
      { to: '/notifications', icon: Bell,          label: 'Notifications'                   },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/financial',   icon: DollarSign, label: 'Financial Tracker'            },
      { to: '/sop',         icon: BookOpen,   label: 'SOP Library'                  },
      { to: '/automations', icon: Zap,        label: 'Automations', badge: 'Zapier' },
    ],
  },
]

const adminSections = [
  {
    label: 'Admin',
    items: [
      { to: '/settings',      icon: Settings,  label: 'Settings'      },
      { to: '/va-management', icon: UserCheck, label: 'VA Management' },
    ],
  },
]

function NavItem({ to, icon: Icon, label, badge, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 relative
        ${isActive ? 'nav-active text-white bg-[rgba(201,162,39,0.1)]' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`
      }
      style={{ padding: '12px 12px', lineHeight: '1.5' }}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span style={{
          background: 'rgba(201,162,39,0.15)',
          color: '#C9A227',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 500,
          flexShrink: 0,
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, profile, role, signOut } = useAuth()
  const { open, close } = useSidebar()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()
  const name = profile?.name || user?.name || user?.email?.split('@')[0] || 'Kevin'
  const allSections = role === 'admin' ? [...sections, ...adminSections] : sections

  // Close on mobile when route changes
  useEffect(() => {
    if (isMobile) close()
  }, [location.pathname, isMobile]) // eslint-disable-line

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100dvh',
        width: '240px',
        background: '#0D0D14',
        borderRight: '1px solid #1E1E2E',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 12px' }}>
        {allSections.map((section, si) => (
          <div key={section.label} style={{ marginTop: si === 0 ? 0 : '24px' }}>
            <p style={{
              color: '#374151',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: '1.5',
              padding: '0 12px',
              marginBottom: '8px',
            }}>
              {section.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map(item => (
                <NavItem
                  key={item.to}
                  {...item}
                  onNavigate={isMobile ? close : undefined}
                />
              ))}
            </div>
          </div>
        ))}
        {/* Extra padding at bottom for mobile so last item isn't hidden behind bottom nav */}
        {isMobile && <div style={{ height: '80px' }} />}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid #1E1E2E', padding: '16px 12px' }}>
        <div className="flex items-center gap-3" style={{ background: '#111118', borderRadius: '10px', padding: '12px' }}>
          <div className="flex items-center justify-center flex-shrink-0 font-semibold" style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A227, #A8891F)',
            color: '#fff', fontSize: '14px',
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" style={{ color: '#F8F8FF', fontSize: '14px', lineHeight: '1.5' }}>{name}</p>
            <p className="text-xs capitalize" style={{ color: '#6B7280', lineHeight: '1.5' }}>{role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 transition-opacity hover:opacity-70"
            style={{ color: '#6B7280', padding: '4px' }}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
