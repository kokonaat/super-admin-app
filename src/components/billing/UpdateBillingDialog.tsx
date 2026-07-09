import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useUpdateBilling } from '@/hooks/useBilling'
import type { BillingRecord, BillingStatus } from '@/types'
import { BillingStatusBadge } from '@/components/customers/StatusBadge'

const STATUSES: BillingStatus[] = ['PENDING', 'PAID', 'OVERDUE']

export default function UpdateBillingDialog({
  record,
  customerId,
}: {
  record: BillingRecord
  customerId: string
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<BillingStatus>(record.status)
  const update = useUpdateBilling()

  const save = () => {
    update.mutate(
      { billingId: record.id, customerId, data: { status } },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        title="Update status"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Update Billing Status</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Invoice <strong>{record.no}</strong> — {record.amount}
            </p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-primary"
                  />
                  <BillingStatusBadge status={s} />
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={update.isPending}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
