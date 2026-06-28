import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'kevin@kevinos.com': { password: 'kevin123', role: 'admin', name: 'Kevin Rivas' },
  'va@kevinos.com':    { password: 'va123',    role: 'va',    name: 'Jordan VA'   },
}

async function fetchProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data || null
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore demo session without waiting for Supabase
    const saved = sessionStorage.getItem('kevin-nexus-user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setProfile(parsed)
      } catch (_) {}
    }

    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    // Check for existing Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    // Keep in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else if (!sessionStorage.getItem('kevin-nexus-user')) {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const normalised = email.toLowerCase().trim()

    // Demo accounts — always available
    const demo = DEMO_USERS[normalised]
    if (demo && demo.password === password) {
      const demoUser = { id: 'demo-' + demo.role, email: normalised, role: demo.role, name: demo.name, isDemo: true }
      sessionStorage.setItem('kevin-nexus-user', JSON.stringify(demoUser))
      setUser(demoUser)
      setProfile(demoUser)
      return { error: null, role: demo.role }
    }

    if (!supabaseConfigured) {
      return { error: { message: 'No Supabase credentials. Use the demo accounts below.' } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalised, password })
      if (error) return { error }
      // Fetch profile immediately so role is available for redirect
      const p = await fetchProfile(data.user.id)
      setProfile(p)
      return { error: null, role: p?.role || 'va' }
    } catch (_) {
      return { error: { message: 'Connection failed. Use the demo accounts below.' } }
    }
  }

  async function signOut() {
    sessionStorage.removeItem('kevin-nexus-user')
    setUser(null)
    setProfile(null)
    if (supabaseConfigured) {
      await supabase.auth.signOut().catch(() => {})
    }
  }

  const role = profile?.role || user?.role || 'va'

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
