import { defineStore } from 'pinia'
import { ERole } from '~~/utils/enum'
import { IResponse } from '~~/utils/interface'

export interface IAuthState {
  id: number | null
  email: string
  role?: ERole
  isRepresentative?: boolean
  templeId?: number
}

export interface ISystemLogin {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => {
    return {
      id: null,
      email: '',
      role: undefined,
      isRepresentative: false,
    }
  },
  actions: {
    updateAuthStore(params: IAuthState) {
      this.id = params.id
      this.email = params.email
      this.role = params.role
      this.isRepresentative = params.isRepresentative
    },
    async systemLogin(body: ISystemLogin) {
      return await handleSignIn('/system/login', body)
    },
    async templeLogin(body: ISystemLogin) {
      const data: IResponse | undefined = await handleSignIn(
        '/temple/login',
        body
      )
      if (data?.errorCode && data?.errorCode === 'USER_FIRST_LOGIN')
        return navigateTo('/temple/change-password-first')
      return navigateTo('/temple/accounts', {
        external: true,
      })
    },
  },
})
