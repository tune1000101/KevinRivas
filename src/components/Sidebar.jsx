import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, CheckSquare, Scissors, Users, Tag,
  TrendingUp, Briefcase, FileText, Phone, MessageSquare, Bell,
  DollarSign, BookOpen, Zap, Settings, UserCheck, LogOut, Cpu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const sections = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/calendar', icon: Calendar, label: 'Calendar', badge: 'Sync' },
      { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    ],
  },
  {
    label: 'Barbershop',
    items: [
      { to: '/bookings', icon: Scissors, label: 'Bookings', badge: 'Square' },
      { to: '/staff', icon: Users, label: 'Staff' },
      { to: '/services', icon: Tag, label: 'Services' },
    ],
  },
  {
    label: 'Mortgage',
    items: [
      { to: '/pipeline', icon: TrendingUp, label: 'Pipeline' },
      { to: '/clients', icon: Briefcase, label: 'Clients' },
      { to: '/documents', icon: FileText, label: 'Documents' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { to: '/phone', icon: Phone, label: 'Phone', badge: 'Dialpad' },
      { to: '/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/financial', icon: DollarSign, label: 'Financial Tracker' },
      { to: '/sop', icon: BookOpen, label: 'SOP Library' },
      { to: '/automations', icon: Zap, label: 'Automations', badge: 'Zapier' },
    ],
  },
]

const adminSections = [
  {
    label: 'Admin',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
      { to: '/va-management', icon: UserCheck, label: 'VA Management' },
    ],
  },
]

function NavItem({ to, icon: Icon, label, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group relative
        ${isActive
          ? 'nav-active text-white bg-indigo-500/10'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`
      }
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs px-1.5 py-0.5 rounded font-medium"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1', fontSize: '10px' }}>
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, profile, role, signOut } = useAuth()
  const navigate = useNavigate()
  const name = profile?.name || user?.name || user?.email?.split('@')[0] || 'Kevin'
  const allSections = role === 'admin' ? [...sections, ...adminSections] : sections

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{ width: '260px', background: '#0D0D14', borderRight: '1px solid #1E1E2E' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1E1E2E' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
          <Cpu size={16} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight" style={{ color: '#F8F8FF' }}>Kevin OS</span>
          <p className="text-xs" style={{ color: '#6B7280' }}>Personal Operating System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {allSections.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#374151' }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid #1E1E2E', paddingTop: '12px' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#111118' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#F8F8FF' }}>{name}</p>
            <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="transition-opacity hover:opacity-70 p-1 rounded"
            style={{ color: '#6B7280' }}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
