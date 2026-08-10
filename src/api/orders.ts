const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export type Party = {
  name: string
  address: string
}

export type OrderStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

export type Order = {
  id: string
  trackingCode: string
  sender: Party
  recipient: Party
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export type OrderPage = {
  content: Order[]
  totalElements: number
}

export type CreateOrderInput = {
  sender: Party
  recipient: Party
}

export async function listOrders(): Promise<OrderPage> {
  const response = await fetch(`${API_BASE_URL}/orders`)
  if (!response.ok) {
    throw new Error(`Failed to list orders: ${response.status}`)
  }
  return response.json()
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Failed to create order: ${response.status}`)
  }
  return response.json()
}
