export interface CurrentUser {
  id: string
  name: string
  email: string
  phone?: string
  platformRole: string
  createdAt: string
}

export type BillingStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface BillingRecord {
  id: string
  no: string
  amount: number
  dueDate: string
  status: BillingStatus
  description?: string
  paidAt?: string
  createdAt: string
}

export interface CustomerSummary {
  id: string
  name: string
  email: string
  phone?: string
  isActive: boolean
  shopCount: number
  planName: string | null
  planExpiryDate: string | null
  billingStatus: BillingStatus | null
  createdAt: string
}

export interface ShopSummary {
  id: string
  name: string
  slug: string
  address: string
  isActive: boolean
  transactionCount: number
  vendorCount: number
  customerCount: number
}

export interface PlanLimits {
  totalTransactions: number
  maxShops: number
  maxUsers: number
  maxVendors: number
  maxCustomers: number
  maxExpenses: number
}

export interface SubscriptionSummary {
  id: string
  planId: string
  planName: string
  planPrice: number
  startDate: string | null
  expiryDate: string | null
  limits: PlanLimits
}

export interface CustomerDetail {
  id: string
  name: string
  email: string
  phone?: string
  isActive: boolean
  createdAt: string
  shops: ShopSummary[]
  subscription: SubscriptionSummary | null
  recentBilling: BillingRecord | null
}

export interface PlatformStats {
  totalCustomers: number
  totalShops: number
  activeSubscriptions: number
  overdueBillingCount: number
  recentlyLocked: CustomerSummary[]
  recentSignups: CustomerSummary[]
}

export interface PlanItem {
  id: string
  no: string
  name: string
  description: string
  price: number
  totalTransactions: number
  dashboardAccess: boolean
}
