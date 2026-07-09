import { usePlans } from '@/hooks/usePlans'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Plans() {
  const { data: plans, isLoading } = usePlans()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plans</h1>
        <p className="text-sm text-muted-foreground">Subscription plan catalog</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <div key={plan.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{plan.name}</h2>
                  <p className="text-xs text-muted-foreground">{plan.no}</p>
                </div>
                <span className="text-lg font-bold">৳{plan.price}</span>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{plan.description}</p>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  Transactions: <span className="font-medium text-foreground">{plan.totalTransactions}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  {plan.dashboardAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={plan.dashboardAccess ? 'text-foreground' : 'text-muted-foreground'}>
                    Dashboard access
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        To create or edit plans, use the shop-owner admin panel Plans section.
      </p>
    </div>
  )
}
