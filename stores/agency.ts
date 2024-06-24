import { defineStore } from 'pinia'
import { IPaginationState, usePaginationStore } from './pagination'

export interface IAgency {
  id: number
  companyName: string
  companyNameFurigana: string
  prefectures: string
  address: string
  tel: string
  fax: string
  contractStartDate: Date | string
  bankNo: number
  postCode: string
  note: string
}

interface IAgencyState {
  agency: IAgency
}
interface IAgenciesState {
  agencies: IAgency[]
}

interface IGetAgencyParams {
  page: number
  take: number
  search: string
  orderField: string
  order: string
}

interface IAgencies extends IPaginationState {
  data: IAgency[]
}

export interface IUpdateAgencyParams {
  companyName: string
  companyNameFurigana: string
  postCode: string
  prefectures: string
  tel: string
  fax: string
  note: string
}

export interface IUpdateBankNoAgencyParams {
  bankNo: number
}

export interface IPaymentDataCheck {
  paymentDate: string | undefined
  bankNo: string
  amount: number
}

interface ICreateAgencyResponse {
  data: any
}

export const useAgencyStore = defineStore('agency', {
  state: (): IAgencyState => {
    return {
      agency: {
        id: 0,
        companyName: '',
        companyNameFurigana: '',
        prefectures: '',
        address: '',
        tel: '',
        fax: '',
        contractStartDate: '',
        bankNo: 0,
        postCode: '',
        note: '',
      },
    }
  },
  actions: {
    updateAgenciesStore(params: IAgency) {
      this.agency = params
    },

    async getAgency(id: number | undefined) {
      if (!id) {
        const data = {
          id: 0,
          companyName: '',
          companyNameFurigana: '',
          prefectures: '',
          address: '',
          tel: '',
          fax: '',
          contractStartDate: '',
          bankNo: 0,
          postCode: '',
          note: '',
        }
        this.updateAgenciesStore(data)
      } else {
        const { data, error } = await useBaseFetch<IAgency>(`/agency/${id}`)

        if (!error) {
          this.updateAgenciesStore(data)
        }
      }
    },
    async updateAgency(id: number, params: IUpdateAgencyParams) {
      return await useBaseFetch<ICreateAgencyResponse>(`agency/${id}`, {
        body: {
          ...params,
        },
        method: 'PUT',
      })
    },

    async updateBankNoAgency(id: number, params: IUpdateBankNoAgencyParams) {
      return await useBaseFetch<ICreateAgencyResponse>(`agency-bank/${id}`, {
        body: {
          ...params,
        },
        method: 'PATCH',
      })
    },

    async checkBankNo(params: IPaymentDataCheck[]) {
      return await useBaseFetch<any[]>(`bank-no-check`, {
        body: {
          params,
        },
        method: 'POST',
      })
    },
  },
})

export const useAgenciesStore = defineStore('agencies', {
  state: (): IAgenciesState => {
    return {
      agencies: [],
    }
  },
  actions: {
    updateAgencyUsersStore(params: IAgency[]) {
      this.agencies = params
    },
    async getAgencies(params: IGetAgencyParams) {
      const { data, error } = await useBaseFetch<IAgencies>(
        `/agencies?page=${params.page}&take=${params.take}&search=${params.search}&orderField=${params.orderField}&order=${params.order}`
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
  },
})

export interface IAgencyStats {
  totalAgencyWithContractDateLessNow: number
  totalAgencyWithContractDateGreaterNow: number
  totalAgency: number
}

interface IAgencyStatsState {
  agencyStats: IAgencyStats
}
export const useAgencyStatsStore = defineStore('agencyStats', {
  state: (): IAgencyStatsState => {
    return {
      agencyStats: {
        totalAgencyWithContractDateLessNow: 0,
        totalAgencyWithContractDateGreaterNow: 0,
        totalAgency: 0,
      },
    }
  },
  actions: {
    updateAgencyStore(params: IAgencyStats) {
      this.agencyStats = params
    },
    async getAgencyStats() {
      const { data, error } = await useBaseFetch<IAgencyStats>(`/agency-stats`)
      if (!error) {
        this.updateAgencyStore(data)
      }
    },
  },
})

interface IFileList {
  fileList: string[]
}

export const useFileListStore = defineStore('fileList', {
  state: (): IFileList => {
    return {
      fileList: [],
    }
  },
  actions: {
    updateFileListStore(params: string[]) {
      this.fileList = params
    },
    async getFileList() {
      const { data, error } = await useBaseFetch<string[]>(`/get-files`)
      if (!error) {
        this.updateFileListStore(data)
      }
    },
  },
})
