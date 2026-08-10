import type { Order } from '../api/orders'

type OrderListProps = {
  orders: Order[]
}

const statusColors: Record<Order['status'], string> = {
  CREATED: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-700',
}

export function OrderList({ orders }: OrderListProps) {
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
          <tr key={order.id} className="border-b border-gray-100">
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
        ))}
      </tbody>
    </table>
  )
}
