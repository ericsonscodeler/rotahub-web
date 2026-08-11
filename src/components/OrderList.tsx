import { Fragment, useState } from 'react'
import { getOrder } from '../api/orders'
import type { Order } from '../api/orders'
import { TrackingPanel } from './TrackingPanel'

type OrderListProps = {
  orders: Order[]
  onOrderChanged: () => void
}

const statusColors: Record<Order['status'], string> = {
  CREATED: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-700',
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
    return <p className="text-gray-500">No orders yet.</p>
  }

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500">
          <th className="py-2">Tracking code</th>
          <th className="py-2">Sender</th>
          <th className="py-2">Recipient</th>
          <th className="py-2">Status</th>
          <th className="py-2">Created at</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <Fragment key={order.id}>
            <tr
              onClick={() => toggleExpand(order.id)}
              className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-2 font-mono">{order.trackingCode}</td>
              <td className="py-2">{order.sender.name}</td>
              <td className="py-2">{order.recipient.name}</td>
              <td className="py-2">
                <span className={`rounded px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
            {expandedId === order.id && (
              <tr>
                <td colSpan={5} className="p-0">
                  {loadingDetail ? (
                    <p className="p-4 text-gray-500">Carregando rastreio...</p>
                  ) : (
                    <TrackingPanel
                      orderId={order.id}
                      tracking={detail?.tracking ?? null}
                      onEventAdded={handleEventAdded}
                    />
                  )}
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  )
}
