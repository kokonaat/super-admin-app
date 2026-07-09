import { cn } from '@/lib/utils'
import type { BillingStatus } from '@/types'

export function AccountStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        isActive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      )}
    >
      {isActive ? 'Active' : 'Locked'}
    </span>
  )
}

export function BillingStatusBadge({ status }: { status: BillingStatus | null }) {
  if (!status) return <span className="text-xs text-muted-foreground">—</span>

  const styles: Record<BillingStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    PAID: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[status])}>
      {status}
    </span>
  )
}
