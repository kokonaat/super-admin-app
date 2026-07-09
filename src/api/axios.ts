import axios from 'axios'
import { apiEndpoints, BASE_URL } from '@/config/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        localStorage.clear()
        if (window.location.pathname !== '/sign-in') window.location.href = '/sign-in'
        return Promise.reject(error)
      }
      try {
        const res = await axiosInstance.post(apiEndpoints.auth.refresh, { refreshToken })
        const { access_token, refresh_token } = res.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        original.headers['Authorization'] = `Bearer ${access_token}`
        return axiosInstance(original)
      } catch {
        localStorage.clear()
        if (window.location.pathname !== '/sign-in') window.location.href = '/sign-in'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
