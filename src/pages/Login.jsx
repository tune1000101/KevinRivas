import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Loader, Calendar, Phone, TrendingUp } from 'lucide-react'
import ColorBends from '../components/ColorBends'

const features = [
  { icon: Calendar,   title: 'Unified Calendar',   sub: 'Never double book again'    },
  { icon: Phone,      title: 'AI Receptionist',     sub: 'Answers calls 24/7'         },
  { icon: TrendingUp, title: 'Mortgage Pipeline',   sub: 'Automate your workflow'     },
]

const inputBase = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #2A2A35',
  borderRadius: '8px',
  color: '#F8F8FF',
  fontSize: '14px',
  lineHeight: '1.5',
  padding: '0 14px',
  height: '48px',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

export default function Login({ toast }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { signIn }  = useAuth()
  const navigate    = useNavigate()

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
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Layer 0: animated WebGL background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <ColorBends
          colors={['#6366F1', '#4F46E5', '#1a1040', '#0D0D1A', '#7C3AED']}
          rotation={90}
          speed={0.15}
          scale={1.2}
          frequency={0.8}
          warpStrength={0.8}
          mouseInfluence={0.3}
          noise={0.08}
          parallax={0.3}
          iterations={2}
          intensity={1.2}
          bandWidth={5}
        />
      </div>

      {/* ── Layer 1: dark overlay ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(5,5,15,0.65)' }} />

      {/* ── Layer 2: page content ── */}
      <div
        className="login-layout"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          padding: '48px',
          gap: '48px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Left: headline content ── */}
        <div className="login-left-content" style={{ flex: '0 0 45%', maxWidth: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100%' }}>
          {/* Wordmark */}
          <div style={{ marginBottom: 'auto', paddingTop: '0' }}>
            <p style={{ color: '#F8F8FF', fontSize: '18px', fontWeight: 700, lineHeight: '1.4', letterSpacing: '-0.3px' }}>
              Kevin Nexus
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: '1.5', marginTop: '2px' }}>
              Powered by Creative Binary
            </p>
          </div>

          {/* Main headline */}
          <div style={{ marginTop: '48px' }}>
            <h1 style={{
              color: '#F8F8FF',
              fontSize: '52px',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-2px',
              maxWidth: '420px',
              marginBottom: '16px',
            }}>
              Run your entire life from one place.
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.6', marginBottom: '48px' }}>
              Barbershop. Mortgage. Family. Cars.
            </p>

            {/* Feature items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="#6366F1" />
                  </div>
                  <div>
                    <p style={{ color: '#F8F8FF', fontSize: '14px', fontWeight: 600, lineHeight: '1.4' }}>{title}</p>
                    <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.4', marginTop: '2px' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: floating login card ── */}
        <div className="login-card" style={{
          flex: '0 0 55%',
          maxWidth: '55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#111118',
            border: '1px solid #2A2A35',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            width: '100%',
            maxWidth: '440px',
            boxSizing: 'border-box',
          }}>
            <h2 style={{ color: '#F8F8FF', fontSize: '28px', fontWeight: 700, lineHeight: '1.2', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Welcome back, Kevin
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', marginBottom: '32px' }}>
              Sign in to Kevin Nexus
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
                  onBlur={e => e.target.style.borderColor = '#2A2A35'}
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
                    onBlur={e => e.target.style.borderColor = '#2A2A35'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 0, display: 'flex' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#EF4444', fontSize: '13px', lineHeight: '1.5' }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', height: '48px',
                  background: loading ? '#4F46E5' : '#6366F1',
                  color: '#fff', fontWeight: 700, fontSize: '14px',
                  borderRadius: '10px', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
              <span style={{ color: '#6B7280', fontSize: '12px', whiteSpace: 'nowrap' }}>or continue as</span>
              <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
            </div>

            {/* Demo pills */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { label: 'Kevin (Admin)', type: 'admin' },
                { label: 'VA Assistant', type: 'va' },
              ].map(({ label, type }) => (
                <button
                  key={type}
                  onClick={() => fillDemo(type)}
                  style={{
                    flex: 1, height: '40px',
                    background: 'transparent',
                    border: '1px solid #2A2A35',
                    borderRadius: '999px',
                    color: '#9CA3AF', fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                    lineHeight: '1.5',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A35'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Card footer */}
            <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '32px', lineHeight: '1.5' }}>
              Powered by Creative Binary
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-layout {
            flex-direction: column !important;
            padding: 32px 24px !important;
            justify-content: flex-start !important;
            align-items: stretch !important;
          }
          .login-left-content {
            flex: none !important;
            max-width: 100% !important;
            min-height: unset !important;
          }
          .login-left-content h1 {
            font-size: 36px !important;
            letter-spacing: -1px !important;
          }
          .login-left-content > div:first-child {
            margin-bottom: 0 !important;
          }
          .login-left-content > div:last-child {
            margin-top: 32px !important;
          }
          .login-card {
            flex: none !important;
            max-width: 100% !important;
            margin-top: 32px !important;
          }
          .login-card > div {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
