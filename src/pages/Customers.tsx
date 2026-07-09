import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePlatformCustomers } from '@/hooks/usePlatformCustomers'
import { AccountStatusBadge, BillingStatusBadge } from '@/components/customers/StatusBadge'
import LockToggle from '@/components/customers/LockToggle'
import { useDebounce } from '@/hooks/useDebounce'
import { format } from 'date-fns'

const PAGE_SIZE = 15

export default function Customers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = usePlatformCustomers(page, PAGE_SIZE, debouncedSearch || undefined)

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} total platform customers
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or email…"
            className="w-72 rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shops</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Billing</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No customers found
                </td>
              </tr>
            )}
            {data?.data.map((c) => (
              <tr key={c.id} className="border-b hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/customers/${c.id}`} className="hover:underline">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.shopCount}</td>
                <td className="px-4 py-3">
                  {c.planName ? (
                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {c.planName}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <BillingStatusBadge status={c.billingStatus} />
                </td>
                <td className="px-4 py-3">
                  <AccountStatusBadge isActive={c.isActive} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.createdAt ? format(new Date(c.createdAt), 'MMM d, yyyy') : '—'}
                </td>
                <td className="px-4 py-3">
                  <LockToggle
                    customerId={c.id}
                    isActive={c.isActive}
                    customerName={c.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border p-1.5 hover:bg-accent disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border p-1.5 hover:bg-accent disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
