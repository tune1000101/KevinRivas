import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth, AuthProvider } from './context/AuthContext'
import { SidebarProvider, useSidebar } from './context/SidebarContext'
import { useToast } from './hooks/useToast'
import { useIsMobile } from './hooks/useIsMobile'
import Toast from './components/Toast'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'

import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import VADashboard from './pages/VADashboard'
import Placeholder from './pages/Placeholder'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex items-center justify-center animate-spin-slow"
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          }}
        >
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <p className="text-sm" style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    </div>
  )
}

function SidebarLayout({ toast }) {
  const { user, loading } = useAuth()
  const { open, close } = useSidebar()
  const isMobile = useIsMobile()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Backdrop overlay on mobile when sidebar is open */}
      {isMobile && open && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 45,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />
      )}

      <Sidebar />

      {/* Content shifts with the sidebar on desktop; full-width on mobile */}
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: !isMobile && open ? '240px' : '0',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          paddingBottom: isMobile ? 'calc(60px + env(safe-area-inset-bottom, 0px))' : '0',
        }}
      >
        <Outlet context={{ toast }} />
      </div>

      {isMobile && <MobileNav />}
    </div>
  )
}

function AppRoutes() {
  const { toasts, toast, dismiss } = useToast()
  const { loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login toast={toast} />} />

        <Route element={<SidebarLayout toast={toast} />}>
          <Route path="/dashboard"    element={<AdminDashboard toast={toast} />} />
          <Route path="/va"           element={<VADashboard toast={toast} />} />
          <Route path="/tasks"        element={<Placeholder title="Tasks"            description="Full task management with AI prioritization via OpenAI. Drag-and-drop kanban and list views coming in Phase 2." badge="OpenAI" />} />
          <Route path="/calendar"     element={<Placeholder title="Calendar"         description="Google Calendar sync — view, create, and manage events across all of Kevin's life categories." badge="Google Calendar" />} />
          <Route path="/bookings"     element={<Placeholder title="Bookings"         description="Square Appointments integration — manage barbershop schedule, staff calendars, and service menu." badge="Square Appointments" />} />
          <Route path="/staff"        element={<Placeholder title="Staff"            description="Manage your team — schedules, performance, and availability at a glance." />} />
          <Route path="/services"     element={<Placeholder title="Services"         description="Configure service menu, pricing, and duration for Square booking sync." />} />
          <Route path="/pipeline"     element={<Placeholder title="Mortgage Pipeline" description="Track active loan files from application to close. AI-assisted document parsing via OpenAI." badge="OpenAI" />} />
          <Route path="/clients"      element={<Placeholder title="Clients"          description="Full CRM for mortgage clients — contact info, loan status, and communication history." />} />
          <Route path="/documents"    element={<Placeholder title="Documents"        description="Secure document storage and AI-powered parsing for income verification, tax returns, and more." badge="OpenAI" />} />
          <Route path="/phone"        element={<Placeholder title="Phone"            description="Dialpad integration — VOIP calls, AI transcriptions, and call logs synced automatically." badge="Dialpad" />} />
          <Route path="/messages"     element={<Placeholder title="Messages"         description="Unified inbox — SMS via Twilio, WhatsApp, and email in one thread." badge="Twilio" />} />
          <Route path="/notifications" element={<Placeholder title="Notifications"  description="Smart notification center — filter by category, priority, and source." />} />
          <Route path="/financial"    element={<Placeholder title="Financial Tracker" description="Revenue tracking across barbershop and mortgage. Monthly P&L, trends, and projections." />} />
          <Route path="/sop"          element={<Placeholder title="SOP Library"     description="Standard operating procedures for both businesses — searchable, versioned, and shareable with VA." />} />
          <Route path="/automations"  element={<Placeholder title="Automations"     description="Zapier webhook triggers — automate repetitive tasks across all tools in Kevin's stack." badge="Zapier" />} />
          <Route path="/settings"     element={<Placeholder title="Settings"        description="Account settings, notification preferences, integration keys, and role management." />} />
          <Route path="/va-management" element={<Placeholder title="VA Management"  description="Manage assistant access, task delegation rules, and activity audit log." />} />
        </Route>

        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toast toasts={toasts} dismiss={dismiss} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  )
}
