import { useAuthStore } from '~~/stores/auth'
import { ERole } from '~~/utils/enum'

export const useSystem = () => {
  const nuxtApp = useNuxtApp()
  let roles = nuxtApp._route.meta.roles as ERole

  const authStore = useAuthStore()

  handleGetProviders()

  return computed(() => {
    if (!authStore.id) return false

    roles = roles || [ERole.AGENCY_ADMIN, ERole.SYSTEM_ADMIN]

    const isPermitted = roles.includes(authStore.role as string)

    return !!isPermitted
  })
}
