import { Construction } from 'lucide-react'
import Header from '../components/Header'

export default function Placeholder({ title, breadcrumb, description, badge }) {
  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header breadcrumbs={[breadcrumb || title]} />
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-8">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)' }}>
            <Construction size={28} style={{ color: '#C9A227' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#F8F8FF' }}>{title}</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
            {description || `${title} integration is planned for an upcoming phase. The navigation is live — the data pipeline is in progress.`}
          </p>
          {badge && (
            <span className="inline-block text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}>
              Integration: {badge}
            </span>
          )}
        </div>
      </main>
    </div>
  )
}
