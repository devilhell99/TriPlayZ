import { useSystem } from '~~/composables/auth'
import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const isSystem = useSystem()
  const authStore = useAuthStore()

  if (!authStore.id) return navigateTo({ path: '/login' })

  if (!isSystem.value) return navigateTo({ path: '/403' })
})
