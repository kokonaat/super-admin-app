import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { platformApi } from '@/api/platformApi'

export function useBillingByCustomer(customerId: string) {
  return useQuery({
    queryKey: ['billing', customerId],
    queryFn: () => platformApi.getBillingByCustomer(customerId),
    enabled: !!customerId,
  })
}

export function useCreateBilling() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string
      data: { amount: number; dueDate: string; description?: string }
    }) => platformApi.createBilling(customerId, data),
    onSuccess: (_, { customerId }) => {
      toast.success('Billing record created')
      qc.invalidateQueries({ queryKey: ['billing', customerId] })
      qc.invalidateQueries({ queryKey: ['platform-customer', customerId] })
      qc.invalidateQueries({ queryKey: ['platform-stats'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create billing record')
    },
  })
}

export function useUpdateBilling() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      billingId,
      data,
    }: {
      billingId: string
      customerId: string
      data: Partial<{ amount: number; dueDate: string; description: string; status: string }>
    }) => platformApi.updateBilling(billingId, data),
    onSuccess: (_, { customerId }) => {
      toast.success('Billing record updated')
      qc.invalidateQueries({ queryKey: ['billing', customerId] })
      qc.invalidateQueries({ queryKey: ['platform-stats'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update billing record')
    },
  })
}

export function useDeleteBilling() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ billingId }: { billingId: string; customerId: string }) =>
      platformApi.deleteBilling(billingId),
    onSuccess: (_, { customerId }) => {
      toast.success('Billing record deleted')
      qc.invalidateQueries({ queryKey: ['billing', customerId] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete billing record')
    },
  })
}
