import { axiosInstance } from './axios'
import { apiEndpoints } from '@/config/api'
import type { CurrentUser } from '@/types'

export const authApi = {
  signin: (email: string, password: string) =>
    axiosInstance
      .post<{ access_token: string; refresh_token: string }>(apiEndpoints.auth.signin, { email, password })
      .then((r) => r.data),

  me: () =>
    axiosInstance.get<CurrentUser>(apiEndpoints.auth.me).then((r) => r.data),

  logout: () =>
    axiosInstance.post(apiEndpoints.auth.logout).then((r) => r.data),
}
