import { Fragment, useState } from 'react'
import { getOrder } from '../api/orders'
import type { Order } from '../api/orders'
import { NotificationsPanel } from './NotificationsPanel'
import { StatusPill } from './StatusPill'
import { TrackingPanel } from './TrackingPanel'

type OrderListProps = {
  orders: Order[]
  onOrderChanged: () => void
}

export function OrderList({ orders, onOrderChanged }: OrderListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<Order | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  async function toggleExpand(orderId: string) {
    if (expandedId === orderId) {
      setExpandedId(null)
      setDetail(null)
      return
    }
    setExpandedId(orderId)
    setDetail(null)
    setLoadingDetail(true)
    try {
      setDetail(await getOrder(orderId))
    } finally {
      setLoadingDetail(false)
    }
  }

  async function handleEventAdded() {
    if (!expandedId) return
    setDetail(await getOrder(expandedId))
    onOrderChanged()
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
        Nenhum pedido ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <th className="px-4 py-3 font-semibold">Código</th>
            <th className="px-4 py-3 font-semibold">Remetente</th>
            <th className="px-4 py-3 font-semibold">Destinatário</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Criado em</th>
            <th className="w-8 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isExpanded = expandedId === order.id
            return (
              <Fragment key={order.id}>
                <tr
                  onClick={() => toggleExpand(order.id)}
                  className={`cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 tabular-nums">
                    {order.trackingCode}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{order.sender.name}</td>
                  <td className="px-4 py-3 text-slate-700">{order.recipient.name}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 tabular-nums">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    <span
                      className={`inline-block transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    >
                      ›
                    </span>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      {loadingDetail ? (
                        <p className="bg-slate-50/60 p-4 text-sm text-slate-400">
                          Carregando rastreio...
                        </p>
                      ) : (
                        <>
                          <TrackingPanel
                            orderId={order.id}
                            tracking={detail?.tracking ?? null}
                            onEventAdded={handleEventAdded}
                          />
                          <NotificationsPanel
                            orderId={order.id}
                            refreshKey={detail?.tracking?.history.length}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
