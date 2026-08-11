import { useEffect, useState } from 'react'
import './index.css'
import { createOrder, listOrders, type CreateOrderInput, type Order } from './api/orders'
import { OrderForm } from './components/OrderForm'
import { OrderList } from './components/OrderList'

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  async function refreshOrders(silent = false) {
    if (!silent) setLoading(true)
    setLoadError(null)
    try {
      const page = await listOrders()
      setOrders(page.content)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    refreshOrders()
  }, [])

  async function handleCreate(input: CreateOrderInput) {
    await createOrder(input)
    await refreshOrders(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        <header className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            R
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">RotaHub</h1>
            <p className="text-sm text-slate-500">Painel do Operador</p>
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
            Novo pedido
          </h2>
          <OrderForm onSubmit={handleCreate} />
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Pedidos
            </h2>
            {!loading && !loadError && (
              <span className="text-sm text-slate-400 tabular-nums">{orders.length} no total</span>
            )}
          </div>

          {loading && <p className="text-sm text-slate-500">Carregando...</p>}
          {loadError && <p className="text-sm text-rose-600">{loadError}</p>}
          {!loading && !loadError && (
            <OrderList orders={orders} onOrderChanged={() => refreshOrders(true)} />
          )}
        </section>
      </div>
    </div>
  )
}

export default App
