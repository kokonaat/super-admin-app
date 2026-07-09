import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/stores/authStore'

export function useSignIn() {
  const { setTokens, setUser, logout } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signin(email, password),
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token)
      try {
        const user = await authApi.me()
        if (user.platformRole !== 'super_admin') {
          logout()
          toast.error('Access denied. Super admin accounts only.')
          return
        }
        setUser(user)
        navigate('/')
      } catch {
        logout()
        toast.error('Failed to fetch user profile')
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Sign in failed')
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      navigate('/sign-in')
    },
  })
}
