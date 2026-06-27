import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true)
  const toggle = () => setOpen(o => !o)
  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
