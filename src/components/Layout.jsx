import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#0A0A0F' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '260px' }}>
        {children}
      </div>
    </div>
  )
}
