import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  // Start closed on mobile, open on desktop
  const [open, setOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )

  // Keep default in sync when window resizes across the breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => {
      // When crossing to mobile, close. When crossing to desktop, open.
      setOpen(!e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setOpen(o => !o)
  const close  = () => setOpen(false)

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
