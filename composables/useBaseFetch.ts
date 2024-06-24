import { UseFetchOptions } from '#app'
import { NitroFetchRequest } from 'nitropack'
import { KeyOfRes } from 'nuxt/dist/app/composables/asyncData'
import { IResponse } from '~~/utils/interface'

export interface IJwt {
  token: string
  refreshToken: string
}

export async function useBaseFetch<T>(
  request: NitroFetchRequest,
  opts?:
    | UseFetchOptions<
        T extends void ? unknown : T,
        (res: T extends void ? unknown : T) => T extends void ? unknown : T,
        KeyOfRes<
          (res: T extends void ? unknown : T) => T extends void ? unknown : T
        >
      >
    | undefined
) {
  const config = useRuntimeConfig()

  const { tokenClientEncrypt } = handleGetAuthCookie()

  let token
  if (tokenClientEncrypt) {
    const client = handleJWTDecrypt(tokenClientEncrypt) as IJwt
    token = client.token
  }

  // TODO refreshToken
  let {
    data: dataOrigin,
    error: errorOrigin,
    pending,
    refresh,
  } = await useFetch<T>(request, {
    baseURL: config.public.baseURL,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    ...opts,
  })

  const error: IResponse | null = errorOrigin?.value?.data || null

  if (error && error?.statusCode !== 401) {
    useNotificationError({ message: error?.errorMessage })
  } else if (error && error?.statusCode === 401) {
    handleLogout()
  }

  const data = dataOrigin?.value?.data as T
  return { error, pending, refresh, data }
}
