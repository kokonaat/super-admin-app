import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Store, ShoppingCart, Users, Truck, BarChart2 } from 'lucide-react'
import { useCustomerDetail, useAssignSubscription } from '@/hooks/usePlatformCustomers'
import { useBillingByCustomer } from '@/hooks/useBilling'
import { usePlans } from '@/hooks/usePlans'
import { AccountStatusBadge, BillingStatusBadge } from '@/components/customers/StatusBadge'
import LockToggle from '@/components/customers/LockToggle'
import AddBillingDialog from '@/components/billing/AddBillingDialog'
import UpdateBillingDialog from '@/components/billing/UpdateBillingDialog'
import { useDeleteBilling } from '@/hooks/useBilling'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

type Tab = 'overview' | 'subscription' | 'billing'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>('overview')
  const { data: customer, isLoading } = useCustomerDetail(id!)
  const { data: billing } = useBillingByCustomer(id!)
  const { data: plans } = usePlans()
  const assignSub = useAssignSubscription()
  const deleteBilling = useDeleteBilling()

  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (!customer) return <p className="text-muted-foreground">Customer not found</p>

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/customers" className="rounded-md p-1.5 hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <div className="flex border-b">
        {(['overview', 'subscription', 'billing'] as Tab[]).map((t) => (
          <button key={t} className={tabClass(t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Email:</span> {customer.email}</p>
                {customer.phone && <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {customer.phone}</p>}
                <p className="text-sm">
                  <span className="text-muted-foreground">Joined:</span>{' '}
                  {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <AccountStatusBadge isActive={customer.isActive} />
                </div>
              </div>
              <LockToggle customerId={customer.id} isActive={customer.isActive} customerName={customer.name} />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 font-semibold">Shops ({customer.shops.length})</h2>
            {customer.shops.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shops yet</p>
            ) : (
              <div className="space-y-3">
                {customer.shops.map((shop) => (
                  <div key={shop.id} className="rounded-md border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{shop.name}</p>
                        <p className="text-xs text-muted-foreground">{shop.address || shop.slug}</p>
                      </div>
                      <AccountStatusBadge isActive={shop.isActive} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t">
                      <div className="flex items-center gap-1.5">
                        <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Transactions</p>
                          <p className="text-sm font-semibold">{shop.transactionCount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Vendors</p>
                          <p className="text-sm font-semibold">{shop.vendorCount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Customers</p>
                          <p className="text-sm font-semibold">{shop.customerCount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'subscription' && (
        <div className="space-y-4">
          {customer.subscription ? (
            <>
              <div className="rounded-xl border bg-card p-5">
                <h2 className="mb-3 font-semibold">Current Plan</h2>
                <p className="text-2xl font-bold">{customer.subscription.planName}</p>
                <p className="text-sm text-muted-foreground">৳{customer.subscription.planPrice} / month</p>
                {customer.subscription.startDate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Started: {format(new Date(customer.subscription.startDate), 'MMM d, yyyy')}
                  </p>
                )}
                {customer.subscription.expiryDate && (
                  <p className="text-xs text-muted-foreground">
                    Expires: {format(new Date(customer.subscription.expiryDate), 'MMM d, yyyy')}
                  </p>
                )}
              </div>

              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Plan Limits</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Monthly Transactions', value: customer.subscription.limits.totalTransactions },
                    { label: 'Vendors', value: customer.subscription.limits.maxVendors },
                    { label: 'Customers', value: customer.subscription.limits.maxCustomers },
                    { label: 'Shops', value: customer.subscription.limits.maxShops },
                    { label: 'Users', value: customer.subscription.limits.maxUsers },
                    { label: 'Expenses', value: customer.subscription.limits.maxExpenses },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-lg font-bold">
                        {value === -1 ? '∞' : value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription</p>
          )}

          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">Change Plan</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select plan…</option>
                  {plans?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ৳{p.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  assignSub.mutate({
                    id: customer.id,
                    planId: selectedPlanId,
                    startDate: startDate || undefined,
                    expiryDate: expiryDate || undefined,
                  })
                }
                disabled={!selectedPlanId || assignSub.isPending}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {assignSub.isPending ? 'Saving…' : 'Assign Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Billing History</h2>
            <AddBillingDialog customerId={customer.id} />
          </div>

          {!billing || billing.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center">
              <p className="text-muted-foreground">No billing records yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Paid At</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{b.no}</td>
                      <td className="px-4 py-3 font-medium">৳{b.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(b.dueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <BillingStatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{b.description || '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {b.paidAt ? format(new Date(b.paidAt), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <UpdateBillingDialog record={b} customerId={customer.id} />
                          <button
                            onClick={() =>
                              deleteBilling.mutate({ billingId: b.id, customerId: customer.id })
                            }
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
