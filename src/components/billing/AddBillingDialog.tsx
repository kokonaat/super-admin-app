import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { useCreateBilling } from '@/hooks/useBilling'

const schema = z.object({
  amount: z.number().positive('Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function AddBillingDialog({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false)
  const create = useCreateBilling()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    create.mutate(
      { customerId, data },
      { onSuccess: () => { setOpen(false); reset() } },
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add Invoice
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Add Billing Record</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Amount</label>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="700"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Due Date</label>
                <input
                  {...register('dueDate')}
                  type="date"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.dueDate && (
                  <p className="mt-1 text-xs text-destructive">{errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description (optional)</label>
                <input
                  {...register('description')}
                  type="text"
                  placeholder="Monthly subscription - July 2026"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setOpen(false); reset() }}
                  className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {create.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
