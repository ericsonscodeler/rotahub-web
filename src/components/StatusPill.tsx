const styles: Record<string, string> = {
  CREATED: 'bg-slate-100 text-slate-700',
  AWAITING_PICKUP: 'bg-slate-100 text-slate-700',
  PICKED_UP: 'bg-amber-100 text-amber-800',
  IN_TRANSIT: 'bg-amber-100 text-amber-800',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-700',
  FAILED_ATTEMPT: 'bg-rose-100 text-rose-700',
}

const dotStyles: Record<string, string> = {
  CREATED: 'bg-slate-400',
  AWAITING_PICKUP: 'bg-slate-400',
  PICKED_UP: 'bg-amber-500',
  IN_TRANSIT: 'bg-amber-500',
  OUT_FOR_DELIVERY: 'bg-amber-500',
  DELIVERED: 'bg-emerald-500',
  CANCELLED: 'bg-rose-500',
  FAILED_ATTEMPT: 'bg-rose-500',
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] ?? 'bg-slate-400'}`} />
      {label ?? status}
    </span>
  )
}
