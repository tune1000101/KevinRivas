import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-indigo-400" />,
}

export default function Toast({ toasts, dismiss }) {
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast-enter flex items-start gap-3 px-4 py-3 rounded-xl border min-w-[300px] max-w-[400px]"
          style={{ background: '#16161F', borderColor: '#1E1E2E', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          <div className="mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-medium" style={{ color: '#F8F8FF' }}>{t.title}</p>}
            {t.description && <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="transition-opacity hover:opacity-70 mt-0.5"
            style={{ color: '#6B7280' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
