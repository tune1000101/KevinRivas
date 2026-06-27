import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'kevin@kevinos.com': { password: 'kevin123', role: 'admin', name: 'Kevin Rivas' },
  'va@kevinos.com': { password: 'va123', role: 'va', name: 'Jordan VA' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore persisted demo session immediately
    const saved = sessionStorage.getItem('kevin-os-user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setProfile(parsed)
      } catch (_) {}
    }
    setLoading(false)

    // Only touch Supabase when real credentials exist
    if (!supabaseConfigured) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
    }).catch(() => {})

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else if (!sessionStorage.getItem('kevin-os-user')) {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
    } catch (_) {}
  }

  async function signIn(email, password) {
    const normalised = email.toLowerCase().trim()

    // Demo mode — always checked first
    const demo = DEMO_USERS[normalised]
    if (demo && demo.password === password) {
      const demoUser = { id: 'demo-' + demo.role, email: normalised, role: demo.role, name: demo.name, isDemo: true }
      sessionStorage.setItem('kevin-os-user', JSON.stringify(demoUser))
      setUser(demoUser)
      setProfile(demoUser)
      return { error: null, role: demo.role }
    }

    // Real Supabase auth — only when configured
    if (!supabaseConfigured) {
      return { error: { message: 'No Supabase credentials. Use the demo accounts below.' } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalised, password })
      if (error) return { error }
      await fetchProfile(data.user.id)
      return { error: null, role: profile?.role || 'va' }
    } catch (_) {
      return { error: { message: 'Connection failed. Use the demo accounts below.' } }
    }
  }

  async function signOut() {
    sessionStorage.removeItem('kevin-os-user')
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
