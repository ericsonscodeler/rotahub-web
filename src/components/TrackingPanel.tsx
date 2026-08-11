import { useState } from 'react'
import { addTrackingEvent } from '../api/orders'
import type { Tracking, TrackingStatus } from '../api/orders'
import { StatusPill } from './StatusPill'

const TRACKING_STATUSES: TrackingStatus[] = [
  'AWAITING_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED_ATTEMPT',
]

const statusLabels: Record<TrackingStatus, string> = {
  AWAITING_PICKUP: 'Aguardando coleta',
  PICKED_UP: 'Coletado',
  IN_TRANSIT: 'Em trânsito',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  FAILED_ATTEMPT: 'Tentativa falhou',
}

const dotColors: Record<TrackingStatus, string> = {
  AWAITING_PICKUP: 'bg-slate-400',
  PICKED_UP: 'bg-amber-500',
  IN_TRANSIT: 'bg-amber-500',
  OUT_FOR_DELIVERY: 'bg-amber-500',
  DELIVERED: 'bg-emerald-500',
  FAILED_ATTEMPT: 'bg-rose-500',
}

type TrackingPanelProps = {
  orderId: string
  tracking: Tracking | null
  onEventAdded: () => void
}

export function TrackingPanel({ orderId, tracking, onEventAdded }: TrackingPanelProps) {
  const [nextStatus, setNextStatus] = useState<TrackingStatus>('PICKED_UP')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdvance() {
    setSubmitting(true)
    setError(null)
    try {
      await addTrackingEvent(orderId, { status: nextStatus, timestamp: new Date().toISOString() })
      onEventAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tracking event')
    } finally {
      setSubmitting(false)
    }
  }

  const history = tracking ? [...tracking.history].reverse() : []

  return (
    <div className="border-t border-slate-100 bg-slate-50/60 p-5">
      {tracking ? (
        <div className="mb-5 flex items-center gap-2">
          <span className="text-sm text-slate-500">Rastreio</span>
          <StatusPill status={tracking.status} label={statusLabels[tracking.status]} />
        </div>
      ) : (
        <p className="mb-5 text-sm text-slate-400">Sem rastreio associado a este pedido.</p>
      )}

      {history.length > 0 && (
        <ol className="mb-6 space-y-4">
          {history.map((event, index) => (
            <li key={index} className="relative flex gap-3">
              <span className="relative flex w-2.5 shrink-0 flex-col items-center">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotColors[event.status]}`} />
                {index < history.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-slate-200" />
                )}
              </span>
              <div className="pb-1">
                <p className="text-sm font-medium text-slate-700">
                  {statusLabels[event.status] ?? event.status}
                </p>
                <p className="text-xs text-slate-400 tabular-nums">
                  {new Date(event.timestamp).toLocaleString()}
                  {event.note ? ` · ${event.note}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value as TrackingStatus)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          {TRACKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdvance}
          disabled={submitting}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Registrando...' : 'Registrar evento'}
        </button>
        {error && <span className="text-sm text-rose-600">{error}</span>}
      </div>
    </div>
  )
}
