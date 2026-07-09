import { axiosInstance } from './axios'
import { apiEndpoints } from '@/config/api'
import type {
  BillingRecord,
  CustomerDetail,
  CustomerSummary,
  PlatformStats,
  PlanItem,
} from '@/types'

export const platformApi = {
  getStats: () =>
    axiosInstance.get<PlatformStats>(apiEndpoints.platformAdmin.stats).then((r) => r.data),

  getCustomers: (page = 1, limit = 10, searchBy?: string) =>
    axiosInstance
      .get<{ data: CustomerSummary[]; total: number; page: number; limit: number }>(
        apiEndpoints.platformAdmin.customers,
        { params: { page, limit, searchBy } },
      )
      .then((r) => r.data),

  getCustomerById: (id: string) =>
    axiosInstance.get<CustomerDetail>(apiEndpoints.platformAdmin.customerById(id)).then((r) => r.data),

  toggleStatus: (id: string) =>
    axiosInstance.patch<{ isActive: boolean }>(apiEndpoints.platformAdmin.toggleStatus(id)).then((r) => r.data),

  assignSubscription: (id: string, planId: string, startDate?: string, expiryDate?: string) =>
    axiosInstance
      .patch(apiEndpoints.platformAdmin.assignSubscription(id), { planId, startDate, expiryDate })
      .then((r) => r.data),

  getBillingByCustomer: (id: string) =>
    axiosInstance.get<BillingRecord[]>(apiEndpoints.platformAdmin.billingByCustomer(id)).then((r) => r.data),

  createBilling: (id: string, data: { amount: number; dueDate: string; description?: string }) =>
    axiosInstance.post<BillingRecord>(apiEndpoints.platformAdmin.createBilling(id), data).then((r) => r.data),

  updateBilling: (billingId: string, data: Partial<{ amount: number; dueDate: string; description: string; status: string }>) =>
    axiosInstance.patch<BillingRecord>(apiEndpoints.platformAdmin.updateBilling(billingId), data).then((r) => r.data),

  deleteBilling: (billingId: string) =>
    axiosInstance.delete(apiEndpoints.platformAdmin.deleteBilling(billingId)),

  getPlans: () =>
    axiosInstance.get<PlanItem[]>(apiEndpoints.subscription.plans).then((r) => r.data),
}
