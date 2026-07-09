import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useToggleCustomerStatus } from '@/hooks/usePlatformCustomers'

interface Props {
  customerId: string
  isActive: boolean
  customerName: string
}

export default function LockToggle({ customerId, isActive, customerName }: Props) {
  const [confirming, setConfirming] = useState(false)
  const toggle = useToggleCustomerStatus()

  const handleConfirm = () => {
    toggle.mutate(customerId, { onSettled: () => setConfirming(false) })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {isActive ? 'Lock' : 'Unlock'} <strong>{customerName}</strong>?
        </span>
        <button
          onClick={handleConfirm}
          disabled={toggle.isPending}
          className="rounded bg-destructive px-2 py-0.5 text-xs text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground hover:bg-secondary/80"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
          : 'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400'
      }`}
      title={isActive ? 'Lock account' : 'Unlock account'}
    >
      {isActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
      {isActive ? 'Lock' : 'Unlock'}
    </button>
  )
}
