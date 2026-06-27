import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Loader } from 'lucide-react'
import ColorBends from '../components/ColorBends'

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
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ColorBends
          colors={['#C9A227', '#0A0A0F', '#1a1200', '#C9A227', '#0D0D00', '#8a6a00', '#0A0A0F', '#C9A227']}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={3}
          intensity={1.5}
          bandWidth={6}
          transparent={false}
        />
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(5,5,10,0.72)' }} />

      {/* Centered card */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%',
        padding: '24px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: 'rgba(17,17,24,0.95)',
          border: '1px solid #2A2A35',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,162,39,0.06)',
          width: '100%',
          maxWidth: '420px',
          boxSizing: 'border-box',
        }}>
          {/* Wordmark */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ color: '#C9A227', fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: '1.5' }}>
              Kevin Nexus
            </p>
          </div>

          <h2 style={{ color: '#F8F8FF', fontSize: '26px', fontWeight: 700, lineHeight: '1.2', letterSpacing: '-0.5px', marginBottom: '6px', textAlign: 'center' }}>
            Welcome back, Kevin
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', marginBottom: '32px', textAlign: 'center' }}>
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
                onFocus={e => e.target.style.borderColor = '#C9A227'}
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
                  onFocus={e => e.target.style.borderColor = '#C9A227'}
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
                background: loading ? '#A8891F' : '#C9A227',
                color: '#0A0A0F', fontWeight: 700, fontSize: '14px',
                borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#A8891F' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#C9A227' }}
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
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { label: 'Kevin (Admin)', type: 'admin' },
              { label: 'VA Assistant',  type: 'va'    },
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
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A227'; e.currentTarget.style.color = '#C9A227'; e.currentTarget.style.background = 'rgba(201,162,39,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A35'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent' }}
              >
                {label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '28px', lineHeight: '1.5' }}>
            Powered by Creative Binary
          </p>
        </div>
      </div>
    </div>
  )
}
