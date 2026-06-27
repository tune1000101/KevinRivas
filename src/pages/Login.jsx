import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Loader, Calendar, Phone, TrendingUp } from 'lucide-react'

const featureCards = [
  {
    icon: Calendar,
    title: 'Unified Calendar',
    sub: 'Never double book again',
  },
  {
    icon: Phone,
    title: 'AI Receptionist',
    sub: 'Answers calls 24/7',
  },
  {
    icon: TrendingUp,
    title: 'Mortgage Pipeline',
    sub: 'Automate your workflow',
  },
]

/* ─── Shared input style ─────────────────────────────────────────── */
const inputBase = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #1E1E2E',
  borderRadius: '8px',
  color: '#F8F8FF',
  fontSize: '14px',
  lineHeight: '1.5',
  padding: '12px',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

export default function Login({ toast }) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { signIn }  = useAuth()
  const navigate    = useNavigate()

  /* ── Auth logic — untouched ── */
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err, role } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err.message || 'Invalid credentials. Try the demo accounts below.')
      return
    }
    toast?.({ title: 'Welcome back', description: 'Loading your dashboard...', type: 'success' })
    navigate(role === 'admin' ? '/dashboard' : '/va')
  }

  function fillDemo(type) {
    if (type === 'admin') { setEmail('kevin@kevinos.com'); setPassword('kevin123') }
    else                  { setEmail('va@kevinos.com');   setPassword('va123')    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
      className="login-root"
    >
      {/* ══════════════════════════════════════════
          LEFT PANEL — 45% — form
      ══════════════════════════════════════════ */}
      <div
        className="login-left"
        style={{
          width: '45%',
          flexShrink: 0,
          background: '#111118',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 48px',
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto',
        }}
      >
        {/* Top — wordmark */}
        <div>
          <p style={{ color: '#F8F8FF', fontSize: '16px', fontWeight: 700, lineHeight: '1.5', letterSpacing: '-0.3px' }}>
            Kevin Nexus
          </p>
          <p style={{ color: '#6B7280', fontSize: '11px', lineHeight: '1.5', marginTop: '2px' }}>
            Powered by Creative Binary
          </p>
        </div>

        {/* Center — form */}
        <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
          <h1 style={{
            color: '#F8F8FF',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}>
            Welcome back, Kevin
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', marginBottom: '32px' }}>
            Your personal operating system
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: '12px', fontWeight: 500, marginBottom: '6px', lineHeight: '1.5' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kevin@example.com"
                required
                style={inputBase}
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = '#1E1E2E'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: '12px', fontWeight: 500, marginBottom: '6px', lineHeight: '1.5' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputBase, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#6366F1'}
                  onBlur={e => e.target.style.borderColor = '#1E1E2E'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                color: '#EF4444',
                fontSize: '13px',
                lineHeight: '1.5',
              }}>
                {error}
              </div>
            )}

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#4F46E5' : '#6366F1',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4F46E5' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#6366F1' }}
            >
              {loading && <Loader size={15} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
            <span style={{ color: '#6B7280', fontSize: '12px', whiteSpace: 'nowrap' }}>or continue as</span>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
          </div>

          {/* Demo pills */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => fillDemo('admin')}
              style={{
                flex: 1,
                background: '#0A0A0F',
                border: '1px solid #1E1E2E',
                borderRadius: '999px',
                color: '#9CA3AF',
                fontSize: '12px',
                fontWeight: 500,
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
                lineHeight: '1.5',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9CA3AF' }}
            >
              Kevin (Admin)
            </button>
            <button
              onClick={() => fillDemo('va')}
              style={{
                flex: 1,
                background: '#0A0A0F',
                border: '1px solid #1E1E2E',
                borderRadius: '999px',
                color: '#9CA3AF',
                fontSize: '12px',
                fontWeight: 500,
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
                lineHeight: '1.5',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#10B981' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9CA3AF' }}
            >
              VA Assistant
            </button>
          </div>
        </div>

        {/* Bottom spacer to balance layout */}
        <div style={{ height: '32px' }} />
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — 55% — marketing
      ══════════════════════════════════════════ */}
      <div
        className="login-right"
        style={{
          flex: 1,
          background: 'linear-gradient(145deg, #0D0D1A 0%, #0f0a2a 50%, #1a1040 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', width: '100%' }}>
          <h2 style={{
            color: '#F8F8FF',
            fontSize: '40px',
            fontWeight: 700,
            lineHeight: '1.2',
            letterSpacing: '-1px',
            marginBottom: '16px',
          }}>
            Run your entire life from one place.
          </h2>
          <p style={{
            color: '#9CA3AF',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '48px',
          }}>
            Barbershop. Mortgage. Family. Cars. All connected in one dashboard.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {featureCards.map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                style={{
                  background: '#111118',
                  border: '1px solid #1E1E2E',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={17} color="#6366F1" />
                </div>
                <div>
                  <p style={{ color: '#F8F8FF', fontSize: '13px', fontWeight: 600, lineHeight: '1.5' }}>{title}</p>
                  <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.5', marginTop: '1px' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-right watermark */}
        <p style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          color: '#1E1E2E',
          fontSize: '11px',
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}>
          Creative Binary
        </p>
      </div>

      {/* ── Responsive styles injected via a style tag ── */}
      <style>{`
        @media (max-width: 768px) {
          .login-root {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh;
            overflow-y: auto !important;
          }
          .login-right {
            width: 100% !important;
            flex: none !important;
            padding: 40px 24px !important;
            min-height: 220px;
            justify-content: flex-start !important;
          }
          .login-right h2 {
            font-size: 26px !important;
          }
          .login-right p:first-of-type {
            display: none;
          }
          .login-right > div > div {
            display: none;
          }
          .login-left {
            width: 100% !important;
            flex-shrink: unset !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
