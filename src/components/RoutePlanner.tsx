import { useState } from 'react'
import type { Order } from '../api/orders'
import { createRoute, type OptimizedRoute } from '../api/routes'

type RoutePlannerProps = {
  orders: Order[]
}

type Coords = { lat: string; lng: string }

export function RoutePlanner({ orders }: RoutePlannerProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [coords, setCoords] = useState<Record<string, Coords>>({})
  const [route, setRoute] = useState<OptimizedRoute | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pendingOrders = orders.filter((o) => o.status === 'CREATED')
  const selectedCount = Object.values(selected).filter(Boolean).length

  function toggleSelected(orderId: string) {
    setSelected((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  function updateCoord(orderId: string, field: keyof Coords, value: string) {
    setCoords((prev) => ({ ...prev, [orderId]: { ...prev[orderId], [field]: value } }))
  }

  async function handleGenerate() {
    setSubmitting(true)
    setError(null)
    setRoute(null)
    try {
      const stops = pendingOrders
        .filter((order) => selected[order.id])
        .map((order) => {
          const c = coords[order.id] ?? { lat: '', lng: '' }
          return {
            orderId: order.id,
            address: order.recipient.address,
            lat: Number(c.lat),
            lng: Number(c.lng),
          }
        })
      setRoute(await createRoute({ stops }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate route')
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
        Nenhum pedido pendente pra rotear.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="w-8 px-4 py-3" />
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Destinatário</th>
              <th className="px-4 py-3">Latitude</th>
              <th className="px-4 py-3">Longitude</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={!!selected[order.id]}
                    onChange={() => toggleSelected(order.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600">{order.trackingCode}</td>
                <td className="px-4 py-2 text-slate-700">{order.recipient.name}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="-23.55"
                    disabled={!selected[order.id]}
                    value={coords[order.id]?.lat ?? ''}
                    onChange={(e) => updateCoord(order.id, 'lat', e.target.value)}
                    className="w-28 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="-46.63"
                    disabled={!selected[order.id]}
                    value={coords[order.id]?.lng ?? ''}
                    onChange={(e) => updateCoord(order.id, 'lng', e.target.value)}
                    className="w-28 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={submitting || selectedCount < 2}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Gerando...' : `Gerar rota otimizada (${selectedCount})`}
        </button>
        {selectedCount > 0 && selectedCount < 2 && (
          <span className="text-sm text-slate-400">Selecione pelo menos 2 pedidos.</span>
        )}
        {error && <span className="text-sm text-rose-600">{error}</span>}
      </div>

      {route && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Rota otimizada</h3>
            <span className="text-sm text-slate-500 tabular-nums">
              {route.totalDistanceKm.toFixed(2)} km em linha reta
            </span>
          </div>
          <ol className="space-y-3">
            {route.stops.map((stop, index) => (
              <li key={stop.orderId} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-700">{stop.address}</p>
                  <p className="text-xs text-slate-400 tabular-nums">
                    {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
