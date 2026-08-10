import { useState } from 'react'
import type { CreateOrderInput } from '../api/orders'

type OrderFormProps = {
  onSubmit: (input: CreateOrderInput) => Promise<void>
}

const emptyForm: CreateOrderInput = {
  sender: { name: '', address: '' },
  recipient: { name: '', address: '' },
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [form, setForm] = useState<CreateOrderInput>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(form)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-4">
      <fieldset className="space-y-2">
        <legend className="font-semibold text-gray-700">Sender</legend>
        <input
          required
          placeholder="Name"
          value={form.sender.name}
          onChange={(e) => setForm({ ...form, sender: { ...form.sender, name: e.target.value } })}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          required
          placeholder="Address"
          value={form.sender.address}
          onChange={(e) => setForm({ ...form, sender: { ...form.sender, address: e.target.value } })}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-semibold text-gray-700">Recipient</legend>
        <input
          required
          placeholder="Name"
          value={form.recipient.name}
          onChange={(e) => setForm({ ...form, recipient: { ...form.recipient, name: e.target.value } })}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          required
          placeholder="Address"
          value={form.recipient.address}
          onChange={(e) => setForm({ ...form, recipient: { ...form.recipient, address: e.target.value } })}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </fieldset>

      <div className="col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create order'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </form>
  )
}
