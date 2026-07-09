import { Users, Store, CreditCard, AlertTriangle } from 'lucide-react'
import { useStats } from '@/hooks/useStats'
import { AccountStatusBadge } from '@/components/customers/StatusBadge'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

function StatCard({
  label,
  value,
  icon: Icon,
  alert,
}: {
  label: string
  value: number | undefined
  icon: React.ElementType
  alert?: boolean
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 shadow-sm ${alert && value ? 'border-destructive/40' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className={`h-5 w-5 ${alert && value ? 'text-destructive' : 'text-muted-foreground'}`} />
      </div>
      <p className={`mt-2 text-3xl font-bold ${alert && value ? 'text-destructive' : ''}`}>
        {value ?? '—'}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Customers" value={data?.totalCustomers} icon={Users} />
          <StatCard label="Total Shops" value={data?.totalShops} icon={Store} />
          <StatCard label="Active Subscriptions" value={data?.activeSubscriptions} icon={CreditCard} />
          <StatCard label="Overdue Billing" value={data?.overdueBillingCount} icon={AlertTriangle} alert />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Recently Locked</h2>
          {data?.recentlyLocked.length === 0 && (
            <p className="text-sm text-muted-foreground">No locked accounts</p>
          )}
          <div className="space-y-2">
            {data?.recentlyLocked.map((c) => (
              <Link
                key={c.id}
                to={`/customers/${c.id}`}
                className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
              >
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
                <AccountStatusBadge isActive={c.isActive} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Recent Signups</h2>
          <div className="space-y-2">
            {data?.recentSignups.map((c) => (
              <Link
                key={c.id}
                to={`/customers/${c.id}`}
                className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
              >
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {c.createdAt ? format(new Date(c.createdAt), 'MMM d') : ''}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
