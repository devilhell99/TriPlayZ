import CryptoJS from 'crypto-js'
import { useLocalStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { ERole } from './enum'
import { IAuthState, useAuthStore } from '~~/stores/auth'

interface IUser {
  id: number
  email: string
  role: ERole
  isRepresentative: boolean
}
interface ILogin {
  user: IUser
  token: string
  refreshToken: string
}

export interface IAuthLocalStorage {
  tokenClientEncrypt: string
  dataClientEncrypt: string
}

export function handleJWTEncrypt(payload: Object) {
  const runtimeConfig = useRuntimeConfig()

  return CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    runtimeConfig.nuxtAuthSecret
  ).toString()
}

export function handleJWTDecrypt(token: string) {
  const runtimeConfig = useRuntimeConfig()

  return JSON.parse(
    CryptoJS.AES.decrypt(token, runtimeConfig.nuxtAuthSecret).toString(
      CryptoJS.enc.Utf8
    )
  )
}

/**
 * set auth localStorage
 */
export function handleSetAuthLocalStorage(payload: IAuthLocalStorage) {
  const tokenClientEncrypt = useLocalStorage('auth.session-token', '')
  tokenClientEncrypt.value = payload.tokenClientEncrypt

  const dataClientEncrypt = useLocalStorage('auth.user-data', '')
  dataClientEncrypt.value = payload.dataClientEncrypt
}

/**
 * get auth localStorage
 */
export function handleGetAuthLocalStorage() {
  const tokenClientEncrypt = useLocalStorage('auth.session-token', '')
  const dataClientEncrypt = useLocalStorage('auth.user-data', '')

  return {
    tokenClientEncrypt,
    dataClientEncrypt,
  }
}

/**
 * remove auth localStorage
 */
export function handleRemoveAuthLocalStorage() {
  const tokenClientEncrypt = useLocalStorage('auth.session-token', '')
  tokenClientEncrypt.value = null
  const dataClientEncrypt = useLocalStorage('auth.user-data', '')
  dataClientEncrypt.value = null
}

/**
 * set auth localStorage
 */
export function handleSetAuthCookie(payload: IAuthLocalStorage) {
  const tokenClientEncrypt = useCookie('auth.session-token')
  tokenClientEncrypt.value = payload.tokenClientEncrypt

  const dataClientEncrypt = useCookie('auth.user-data')
  dataClientEncrypt.value = payload.dataClientEncrypt
}

/**
 * get auth localStorage
 */
export function handleGetAuthCookie() {
  const tokenClientEncrypt = useCookie('auth.session-token')
  const dataClientEncrypt = useCookie('auth.user-data')

  return {
    tokenClientEncrypt: tokenClientEncrypt.value,
    dataClientEncrypt: dataClientEncrypt.value,
  }
}

/**
 * remove auth localStorage
 */
export function handleRemoveAuthCookie() {
  const tokenClientEncrypt = useCookie('auth.session-token')
  tokenClientEncrypt.value = null
  const dataClientEncrypt = useCookie('auth.user-data')
  dataClientEncrypt.value = null
}

/**
 * get auth middleware
 */
export function handleGetProviders() {
  const authStore = useAuthStore()

  /**
   * get cookie
   */
  const cookieSessionAuth = useCookie('auth.session-token').value
  const cookieUserData = useCookie('auth.user-data').value

  if (!cookieUserData || !cookieSessionAuth)
    return computed(() => {
      return false
    })
  /**
   * set localStorage
   */
  handleSetAuthLocalStorage({
    tokenClientEncrypt: cookieSessionAuth,
    dataClientEncrypt: cookieUserData,
  })
  /**
   * set pinia
   */
  const userData = handleJWTDecrypt(cookieUserData)

  authStore.updateAuthStore(userData)
}

/**
 * sigIn
 */
export async function handleSignIn(endpoint: string, body: any) {
  const { data, error } = await useBaseFetch<ILogin>(endpoint, {
    method: 'POST',
    body,
  })

  if (error) return error

  const payloadToken = {
    token: data.token,
    refreshToken: data.refreshToken,
  }

  const tokenClientEncrypt = handleJWTEncrypt(payloadToken)

  const payloadUserData: IAuthState = {
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    isRepresentative: data.user.isRepresentative,
  }

  const dataClientEncrypt = handleJWTEncrypt(payloadUserData)

  /**
   * step 1: set local storage
   * step 2: set pinia
   * step 3: xu ly khi load lai trang middlawere get token from local add pinia
   * step 4: add token vao method common
   */

  /**
   * set localStorage
   */
  handleRemoveAuthLocalStorage()

  handleSetAuthLocalStorage({ tokenClientEncrypt, dataClientEncrypt })

  /**
   * set cookie
   */

  handleRemoveAuthCookie()

  handleSetAuthCookie({ tokenClientEncrypt, dataClientEncrypt })

  /**
   * set pinia
   */
  const authStore = useAuthStore()
  authStore.updateAuthStore(payloadUserData)
}

/**
 * logout
 */
export function handleLogout() {
  handleRemoveAuthCookie()

  handleRemoveAuthLocalStorage()

  location.reload()
}

export function handleFormattedNumber(number: number | undefined) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
}

export function contractDateStart(date: string) {
  if (date) {
    if (date.includes('/')) {
      return dayjs(date, 'YYYY/MM/DD').format('YYYY/MM/DD')
    } else {
      return dayjs(date, 'YYYYMMDD').format('YYYY/MM/DD')
    }
  }
}

export function contractDateMonthStart(date: string) {
  if (date) {
    if (date.includes('/')) {
      return dayjs(date, 'YYYY/MM/DD').add(1, 'month').format('YYYY年MM月')
    } else {
      return dayjs(date, 'YYYYMMDD').add(1, 'month').format('YYYY年MM月')
    }
  }
}

export function contractDateYearEnd(date: string, year: number) {
  if (date) {
    if (date.includes('/')) {
      return dayjs(date, 'YYYY/MM/DD').add(year, 'year').format('YYYY年MM月')
    } else {
      return dayjs(date, 'YYYYMMDD').add(year, 'year').format('YYYY年MM月')
    }
  }
}
