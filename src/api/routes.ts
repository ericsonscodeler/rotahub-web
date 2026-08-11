const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export type RouteStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'

export type Stop = {
  orderId: string
  address: string
  lat: number
  lng: number
}

export type OptimizedRoute = {
  id: string
  status: RouteStatus
  stops: Stop[]
  totalDistanceKm: number
  createdAt: string
}

export type CreateRouteInput = {
  stops: Stop[]
}

export async function createRoute(input: CreateRouteInput): Promise<OptimizedRoute> {
  const response = await fetch(`${API_BASE_URL}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Failed to create route: ${response.status}`)
  }
  return response.json()
}
