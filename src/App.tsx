import { useEffect, useState } from 'react'
import { createOrder, listOrders, type CreateOrderInput, type Order } from './api/orders'
import { OrderForm } from './components/OrderForm'
import { OrderList } from './components/OrderList'

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  async function refreshOrders() {
    setLoading(true)
    setLoadError(null)
    try {
      const page = await listOrders()
      setOrders(page.content)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshOrders()
  }, [])

  async function handleCreate(input: CreateOrderInput) {
    await createOrder(input)
    await refreshOrders()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">RotaHub — Operator Panel</h1>
        <p className="text-gray-500">Create and track orders across the delivery network.</p>
      </header>

      <OrderForm onSubmit={handleCreate} />

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Orders</h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {!loading && !loadError && <OrderList orders={orders} />}
      </section>
    </div>
  )
}

export default App
