import { useQuery } from '@tanstack/react-query'
import { platformApi } from '@/api/platformApi'

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: platformApi.getPlans,
    staleTime: 60_000,
  })
}
