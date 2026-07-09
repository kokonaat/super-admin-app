import { useQuery } from '@tanstack/react-query'
import { platformApi } from '@/api/platformApi'

export function useStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: platformApi.getStats,
    staleTime: 30_000,
  })
}
