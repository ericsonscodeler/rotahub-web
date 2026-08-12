const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export type Party = {
  name: string
  address: string
  email: string
}

export type OrderStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

export type TrackingStatus =
  | 'AWAITING_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_ATTEMPT'

export type Position = {
  lat: number
  lng: number
}

export type TrackingEvent = {
  status: TrackingStatus
  position: Position | null
  timestamp: string
  note: string | null
}

export type Tracking = {
  id: string
  orderId: string
  status: TrackingStatus
  position: Position | null
  history: TrackingEvent[]
  createdAt: string
}

export type Order = {
  id: string
  trackingCode: string
  sender: Party
  recipient: Party
  status: OrderStatus
  createdAt: string
  updatedAt: string
  tracking?: Tracking | null
}

export type OrderPage = {
  content: Order[]
  totalElements: number
}

export type CreateOrderInput = {
  sender: Party
  recipient: Party
}

export type AddTrackingEventInput = {
  status: TrackingStatus
  timestamp: string
  note?: string
}

async function parseOrThrow<T>(response: Response, failureMessage: string): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `${failureMessage}: ${response.status}`)
  }
  return response.json()
}

export async function listOrders(): Promise<OrderPage> {
  const response = await fetch(`${API_BASE_URL}/orders`)
  return parseOrThrow(response, 'Failed to list orders')
}

export async function getOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`)
  return parseOrThrow(response, 'Failed to load order')
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseOrThrow(response, 'Failed to create order')
}

export async function addTrackingEvent(orderId: string, input: AddTrackingEventInput): Promise<Tracking> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseOrThrow(response, 'Failed to add tracking event')
}
