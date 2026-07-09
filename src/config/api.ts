export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.kokonaat.com";

export const apiEndpoints = {
  auth: {
    signin: "/auth/signin",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  platformAdmin: {
    stats: "/platform-admin/stats",
    customers: "/platform-admin/customers",
    customerById: (id: string) => `/platform-admin/customers/${id}`,
    toggleStatus: (id: string) => `/platform-admin/customers/${id}/status`,
    assignSubscription: (id: string) =>
      `/platform-admin/customers/${id}/subscription`,
    billingByCustomer: (id: string) =>
      `/platform-admin/customers/${id}/billing`,
    createBilling: (id: string) => `/platform-admin/customers/${id}/billing`,
    updateBilling: (id: string) => `/platform-admin/billing/${id}`,
    deleteBilling: (id: string) => `/platform-admin/billing/${id}`,
  },
  subscription: {
    plans: "/subscription/plans",
  },
};
