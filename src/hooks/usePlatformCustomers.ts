import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { platformApi } from '@/api/platformApi'

export function usePlatformCustomers(page = 1, limit = 10, searchBy?: string) {
  return useQuery({
    queryKey: ['platform-customers', page, limit, searchBy],
    queryFn: () => platformApi.getCustomers(page, limit, searchBy),
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  })
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: ['platform-customer', id],
    queryFn: () => platformApi.getCustomerById(id),
    enabled: !!id,
  })
}

export function useToggleCustomerStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => platformApi.toggleStatus(id),
    onSuccess: (data, id) => {
      toast.success(data.isActive ? 'Account unlocked' : 'Account locked')
      qc.invalidateQueries({ queryKey: ['platform-customers'] })
      qc.invalidateQueries({ queryKey: ['platform-customer', id] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    },
  })
}

export function useAssignSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      planId,
      startDate,
      expiryDate,
    }: {
      id: string
      planId: string
      startDate?: string
      expiryDate?: string
    }) => platformApi.assignSubscription(id, planId, startDate, expiryDate),
    onSuccess: (_, { id }) => {
      toast.success('Subscription updated')
      qc.invalidateQueries({ queryKey: ['platform-customer', id] })
      qc.invalidateQueries({ queryKey: ['platform-customers'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update subscription')
    },
  })
}
