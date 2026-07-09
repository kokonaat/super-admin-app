import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import ProtectedRoute from './ProtectedRoute'
import AuthenticatedLayout from '@/components/layout/authenticated-layout'

const SignIn = lazy(() => import('@/pages/SignIn'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Customers = lazy(() => import('@/pages/Customers'))
const CustomerDetail = lazy(() => import('@/pages/CustomerDetail'))
const Plans = lazy(() => import('@/pages/Plans'))

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-center" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
