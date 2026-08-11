import { useState } from 'react'
import { addTrackingEvent } from '../api/orders'
import type { Tracking, TrackingStatus } from '../api/orders'

const TRACKING_STATUSES: TrackingStatus[] = [
  'AWAITING_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED_ATTEMPT',
]

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

  return (
    <div className="space-y-3 border-t border-gray-100 bg-gray-50 p-4 text-sm">
      {tracking ? (
        <>
          <p className="font-medium text-gray-700">Status atual do rastreio: {tracking.status}</p>
          <ol className="space-y-1">
            {tracking.history.length === 0 && (
              <li className="text-gray-500">Nenhum evento registrado ainda.</li>
            )}
            {tracking.history.map((event, index) => (
              <li key={index} className="text-gray-600">
                <span className="font-mono">{new Date(event.timestamp).toLocaleString()}</span>{' '}
                — {event.status}
                {event.note ? ` (${event.note})` : ''}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="text-gray-500">Sem rastreio associado a este pedido.</p>
      )}

      <div className="flex items-center gap-2">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value as TrackingStatus)}
          className="rounded border border-gray-300 px-2 py-1"
        >
          {TRACKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdvance}
          disabled={submitting}
          className="rounded bg-gray-900 px-3 py-1 text-white disabled:opacity-50"
        >
          {submitting ? 'Registrando...' : 'Registrar evento'}
        </button>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </div>
  )
}
