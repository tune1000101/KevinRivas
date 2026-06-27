import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Cpu, Loader } from 'lucide-react'

export default function Login({ toast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

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
    toast?.({ title: 'Welcome back', description: 'Your OS is loading...', type: 'success' })
    navigate(role === 'admin' ? '/dashboard' : '/va')
  }

  function fillDemo(type) {
    if (type === 'admin') { setEmail('kevin@kevinOS.com'); setPassword('kevin123') }
    else { setEmail('va@kevinOS.com'); setPassword('va123') }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 animate-gradient"
          style={{ background: 'radial-gradient(circle, #6366F1, #8B5CF6, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: '#10B981' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="glass relative z-10 w-full max-w-md mx-4 rounded-2xl p-8 animate-fade-in"
        style={{ border: '1px solid #1E1E2E', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            <Cpu size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-base tracking-tight" style={{ color: '#F8F8FF' }}>Kevin OS</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>Personal Operating System</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-1" style={{ color: '#F8F8FF' }}>Welcome back</h2>
        <p className="text-sm text-center mb-6" style={{ color: '#6B7280' }}>Sign in to your command center</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7280' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="kevin@kevinOS.com"
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
              style={{ background: '#16161F', border: '1px solid #1E1E2E', color: '#F8F8FF' }}
              onFocus={e => e.target.style.borderColor = '#6366F1'}
              onBlur={e => e.target.style.borderColor = '#1E1E2E'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7280' }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-all"
                style={{ background: '#16161F', border: '1px solid #1E1E2E', color: '#F8F8FF' }}
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = '#1E1E2E'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: '#6B7280' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? '#4F46E5' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading && <Loader size={15} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-5 p-3.5 rounded-xl" style={{ background: '#0D0D14', border: '1px solid #1E1E2E' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#6B7280' }}>Demo accounts — click to fill:</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo('admin')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              Kevin (Admin)
            </button>
            <button
              onClick={() => fillDemo('va')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              VA Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Powered by */}
      <p className="relative z-10 mt-6 text-xs" style={{ color: '#374151' }}>
        Powered by <span style={{ color: '#6B7280' }}>Creative Binary</span>
      </p>
    </div>
  )
}
