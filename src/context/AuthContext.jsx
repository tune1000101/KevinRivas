import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Demo users for local dev without Supabase credentials
const DEMO_USERS = {
  'kevin@kevinOS.com': { password: 'kevin123', role: 'admin', name: 'Kevin Rivas' },
  'va@kevinOS.com': { password: 'va123', role: 'va', name: 'Jordan VA' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check persisted demo session
    const saved = sessionStorage.getItem('kevin-os-user')
    if (saved) {
      const parsed = JSON.parse(saved)
      setUser(parsed)
      setProfile(parsed)
    }
    setLoading(false)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
    })

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
    // Demo mode
    const demo = DEMO_USERS[email.toLowerCase()]
    if (demo && demo.password === password) {
      const demoUser = { id: 'demo-' + demo.role, email, role: demo.role, name: demo.name, isDemo: true }
      sessionStorage.setItem('kevin-os-user', JSON.stringify(demoUser))
      setUser(demoUser)
      setProfile(demoUser)
      return { error: null, role: demo.role }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }
    await fetchProfile(data.user.id)
    return { error: null, role: profile?.role || 'va' }
  }

  async function signOut() {
    sessionStorage.removeItem('kevin-os-user')
    setUser(null)
    setProfile(null)
    await supabase.auth.signOut()
  }

  const role = profile?.role || user?.role || 'va'

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
