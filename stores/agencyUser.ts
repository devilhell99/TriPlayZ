import { defineStore } from 'pinia'
import axios from 'axios'
import { IPaginationState, usePaginationStore } from './pagination'
import { IJwt } from '~~/composables/useBaseFetch'

export interface IAgencyUser {
  id: number
  userName: string
  userNameFurigana: string
  address: string
  address2: string
  allAddress: string
  tel: string
  contractDate: Date | string
  contractStartDate: Date | string
  contractEndDate: Date | string
  createdTime: Date | string
  isContractUpdate: boolean
  contractUpdateDate: Date | string
  contractCancelDate: Date | string
  reasonForChange: string
  guaranteeAmount: number
  guaranteeDate: Date | string
}

interface IAgencyUserState {
  agencyUsers: IAgencyUser[]
}

interface IGetAgencyUserParams {
  page: number
  take: number
  search: string
  orderField: string
  order: string
  status: number
}

interface IAgencyUsers extends IPaginationState {
  data: IAgencyUser[]
}

export interface ICreateAgencyUserParams {
  userName: string
  userNameFurigana: string
  address: string | null
  address2: string | null
  tel: string | null
  contractDate: Date | string
  isContractUpdate: boolean
  contractStartDate: Date | string
  contractEndDate: Date | string
}

export interface IUpdateAgencyUserParams {
  userName: string
  userNameFurigana: string
  address: string | null
  address2: string | null
  tel: string | null
  contractDate: Date | string
  isContractUpdate: boolean
  contractStartDate: Date | string
  contractEndDate: Date | string
  guaranteeAmount?: number | null
  guaranteeDate?: Date | string
  contractCancelDate: Date | string
  contractUpdateDate?: Date | string
  reasonForChange: string | null
}

interface ICreateAgencyUserResponse {
  data: any
}

export const useAgencyUserStore = defineStore('agencyUser', {
  state: (): IAgencyUserState => {
    return {
      agencyUsers: [],
    }
  },
  actions: {
    updateAgencyUsersStore(params: IAgencyUser[]) {
      if (params && params.length) {
        params.forEach((i) => {
          return (i.allAddress = `${i.address} ${i.address2}`)
        })
      }
      this.agencyUsers = params
    },

    async getAgencyUsers(params: IGetAgencyUserParams) {
      const { data, error } = await useBaseFetch<IAgencyUsers>(
        `/agency-users?page=${params.page}&take=${params.take}&search=${params.search}&orderField=${params.orderField}&order=${params.order}&status=${params.status}`
      )

      if (!error) {
        this.updateAgencyUsersStore(data.data)

        const paginationStore = usePaginationStore()

        paginationStore.setPagination({
          status: 0,
          date: '',
          filter: 0,
          search: params.search,
          orderField: params.orderField,
          order: params.order,
          take: data.take,
          page: data.page,
          totalItems: data.totalItems,
        })
      }
    },

    async deleteAgencyUser(id: number) {
      return await useBaseFetch(`/agency-user/${id}`, {
        method: 'DELETE',
      })
    },

    async createAgencyUser(params: ICreateAgencyUserParams) {
      return await useBaseFetch<ICreateAgencyUserResponse>('/agency-user', {
        body: params,
        method: 'POST',
      })
    },

    async createAgencyUsers(params: ICreateAgencyUserParams[]) {
      return await useBaseFetch<ICreateAgencyUserResponse>('/agency-users', {
        body: params,
        method: 'POST',
      })
    },

    async updateUserAgency(id: number, params: IUpdateAgencyUserParams) {
      delete params.guaranteeAmount
      delete params.guaranteeDate
      return await useBaseFetch<ICreateAgencyUserResponse>(
        `agency-user/${id}`,
        {
          body: {
            ...params,
          },
          method: 'PUT',
        }
      )
    },

    async exportCsv(params: IGetAgencyUserParams) {
      const config = useRuntimeConfig()
      const { tokenClientEncrypt } = handleGetAuthCookie()
      let token
      if (tokenClientEncrypt) {
        const client = handleJWTDecrypt(tokenClientEncrypt) as IJwt
        token = client.token
      }

      const response = await axios.get(
        `${config.public.baseURL}/export-csv?search=${params.search}&orderField=${params.orderField}&order=${params.order}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          responseType: 'blob',
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ユーザー一覧_${formatDate(
          new Date().toDateString(),
          FORMAT_TYPE.YEAR_DAY_TIME_SLASH
        )}.csv`
      ) // set the file name
      document.body.appendChild(link)
      link.click()
    },

    async getAgencyUser(agencyUserId: number) {
      const { data } = await useBaseFetch<IAgencyUser>(
        `/agency-user/${agencyUserId}`
      )
      return data
    },
  },
})

export interface IAgencyUserStats {
  totalAgencyUserInMonth: number
  totalAgencyUserWithContract: number
  totalAgencyUser: number
}

interface IAgencyUserStatsState {
  agencyUserStats: IAgencyUserStats
}
export const useAgencyUserStatsStore = defineStore('agencyUserStats', {
  state: (): IAgencyUserStatsState => {
    return {
      agencyUserStats: {
        totalAgencyUserInMonth: 0,
        totalAgencyUserWithContract: 0,
        totalAgencyUser: 0,
      },
    }
  },
  actions: {
    updateAgencyUserStore(params: IAgencyUserStats) {
      this.agencyUserStats = params
    },
    async getAgencyUserStats() {
      const { data, error } = await useBaseFetch<IAgencyUserStats>(
        `/agency-user-stats`
      )
      if (!error) {
        this.updateAgencyUserStore(data)
      }
    },
  },
})
