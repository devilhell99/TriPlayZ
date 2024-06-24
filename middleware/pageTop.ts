import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore()

  handleGetProviders()

  if (authStore.role === ERole.AGENCY_ADMIN) {
    return navigateTo({ path: '/agency/top' })
  } else if (authStore.role === ERole.SYSTEM_ADMIN) {
    return navigateTo({ path: '/admin' })
  }
})
