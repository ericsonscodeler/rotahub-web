import { useEffect, useState } from 'react'
import { getNotifications } from '../api/notifications'
import type { Notification } from '../api/notifications'

type NotificationsPanelProps = {
  orderId: string
  refreshKey?: number
}

export function NotificationsPanel({ orderId, refreshKey }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getNotifications(orderId)
      .then((result) => {
        if (!cancelled) setNotifications(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load notifications')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orderId, refreshKey])

  return (
    <div className="border-t border-slate-100 bg-slate-50/60 p-5">
      <h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Notificações enviadas
      </h3>

      {loading && <p className="text-sm text-slate-400">Carregando...</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-sm text-slate-400">Nenhuma notificação ainda.</p>
      )}

      {notifications.length > 0 && (
        <ol className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="relative flex gap-3">
              <span className="relative flex w-2.5 shrink-0 flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
              </span>
              <div className="pb-1">
                <p className="text-sm font-medium text-slate-700">{notification.subject}</p>
                <p className="text-xs text-slate-500">{notification.body}</p>
                <p className="text-xs text-slate-400 tabular-nums">
                  {new Date(notification.createdAt).toLocaleString()} · para{' '}
                  {notification.recipientEmail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
