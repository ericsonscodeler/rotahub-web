import { useState } from 'react'
import type { CreateOrderInput } from '../api/orders'

type OrderFormProps = {
  onSubmit: (input: CreateOrderInput) => Promise<void>
}

const emptyForm: CreateOrderInput = {
  sender: { name: '', address: '', email: '' },
  recipient: { name: '', address: '', email: '' },
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </label>
  )
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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-semibold text-slate-700">Remetente</legend>
          <Field
            label="Nome"
            value={form.sender.name}
            onChange={(v) => setForm({ ...form, sender: { ...form.sender, name: v } })}
          />
          <Field
            label="Endereço"
            value={form.sender.address}
            onChange={(v) => setForm({ ...form, sender: { ...form.sender, address: v } })}
          />
          <Field
            label="E-mail"
            type="email"
            value={form.sender.email}
            onChange={(v) => setForm({ ...form, sender: { ...form.sender, email: v } })}
          />
        </fieldset>

        <fieldset className="space-y-3 sm:border-l sm:border-slate-100 sm:pl-6">
          <legend className="mb-1 text-sm font-semibold text-slate-700">Destinatário</legend>
          <Field
            label="Nome"
            value={form.recipient.name}
            onChange={(v) => setForm({ ...form, recipient: { ...form.recipient, name: v } })}
          />
          <Field
            label="Endereço"
            value={form.recipient.address}
            onChange={(v) => setForm({ ...form, recipient: { ...form.recipient, address: v } })}
          />
          <Field
            label="E-mail"
            type="email"
            value={form.recipient.email}
            onChange={(v) => setForm({ ...form, recipient: { ...form.recipient, email: v } })}
          />
        </fieldset>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Criando...' : 'Criar pedido'}
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    </form>
  )
}
