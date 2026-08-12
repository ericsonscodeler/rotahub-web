const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export type Notification = {
  id: string
  orderId: string
  recipientEmail: string
  trackingStatus: string
  subject: string
  body: string
  createdAt: string
}

export async function getNotifications(orderId: string): Promise<Notification[]> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/notifications`)
  if (!response.ok) {
    throw new Error(`Failed to load notifications: ${response.status}`)
  }
  return response.json()
}
