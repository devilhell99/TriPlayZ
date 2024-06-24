import { defineStore } from 'pinia'
import { IPaginationState, usePaginationStore } from './pagination'

export interface IGuarantee {
  id: number
  billingAmount: number
  delinquencyStatus: string
  agencyUserId: number
  dunningStatus: string
  status: boolean
  createdTime: string
  agency: {
    companyName: string
  }
  agencyUser: {
    id: string
    userName: string
    userNameFurigana: string
    address: string
  }
}

interface IGuaranteeState {
  guarantees: IGuarantee[]
}

interface IGuarantees extends IPaginationState {
  data: IGuarantee[]
}

export interface ICreateGuaranteeParams {
  billingAmount: number | string | null
  delinquencyStatus: string
  dunningStatus: string
}

interface ICreateGuaranteeResponse {
  data: any
}

interface IGetGuaranteesParams {
  page: number
  take: number
  status: number
  date: string
}

export const useGuaranteeStore = defineStore('guarantee', {
  state: (): IGuaranteeState => {
    return {
      guarantees: [],
    }
  },
  actions: {
    updateGuaranteesStore(params: IGuarantee[]) {
      this.guarantees = params
    },
    async createGuarantee(
      params: ICreateGuaranteeParams,
      agencyUserId: number
    ) {
      const newParams = {
        ...params,
        agencyUserId,
      }
      return await useBaseFetch<ICreateGuaranteeResponse>('/guarantee', {
        body: newParams,
        method: 'POST',
      })
    },

    async getGuaranteeList() {
      const { data, error } = await useBaseFetch<IGuarantee[]>('/guarantees', {
        method: 'GET',
      })
      if (!error) {
        this.updateGuaranteesStore(data)
      }
    },

    async approvedRequestGuarantee(guaranteeId: number) {
      return await useBaseFetch<ICreateGuaranteeResponse>(
        `/guarantee/approve/${guaranteeId}`,
        {
          method: 'PATCH',
        }
      )
    },

    async getGuaranteeById(guaranteeId: number) {
      const { data } = await useBaseFetch<IGuarantee>(
        `/guarantee/${guaranteeId}`
      )
      return data
    },

    async getGuaranteeListWithPagination(params: IGetGuaranteesParams) {
      const { data, error } = await useBaseFetch<IGuarantees>(
        `/guarantees/pagination?page=${params.page}&take=${params.take}&status=${params.status}&date=${params.date}`
      )

      if (!error) {
        this.updateGuaranteesStore(data.data)

        const paginationStore = usePaginationStore()

        paginationStore.setPagination({
          search: '',
          order: '',
          orderField: '',
          filter: 0,
          status: params.status,
          date: params.date,
          take: data.take,
          page: data.page,
          totalItems: data.totalItems,
        })
      }
    },
  },
})

export interface IGuaranteeStats {
  totalGuaranteeApproved: number
  totalGuaranteeRequest: number
  totalGuaranteeInMonth: number
  totalAmountGuaranteeInMonth: number
  totalAmountGuaranteeApproved: number
  totalGuarantee: number
  totalGuaranteeApprovedInMonth: number
  totalGuaranteeRequestInMonth: number
  totalPaymentInMonth: number
  totalShortageAmount: number
  totalPreviousMonthForwardAmount: number
}

interface IGuaranteeStatsState {
  guaranteeStats: IGuaranteeStats
}
export const useGuaranteeStatsStore = defineStore('guaranteeStats', {
  state: (): IGuaranteeStatsState => {
    return {
      guaranteeStats: {
        totalGuaranteeApproved: 0,
        totalGuaranteeRequest: 0,
        totalGuaranteeInMonth: 0,
        totalAmountGuaranteeInMonth: 0,
        totalAmountGuaranteeApproved: 0,
        totalGuarantee: 0,
        totalGuaranteeApprovedInMonth: 0,
        totalGuaranteeRequestInMonth: 0,
        totalPaymentInMonth: 0,
        totalShortageAmount: 0,
        totalPreviousMonthForwardAmount: 0,
      },
    }
  },
  actions: {
    updateGuaranteesStore(params: IGuaranteeStats) {
      this.guaranteeStats = params
    },
    async getGuaranteeStats() {
      const { data, error } = await useBaseFetch<IGuaranteeStats>(
        `/guarantee-stats`
      )
      if (!error) {
        this.updateGuaranteesStore(data)
      }
    },
  },
})

export interface IRemittanceAmount {
  id: number
  guaranteeAmount: number
  guaranteeApproveAmount: number
  month: string
  newUserCount: number
  nextMonthForwardAmount: number
  paymentAmount: number
  previousMonthForwardAmount: number
  remittanceAmount: number
  shortageAmount: number
  createdTime: string | null
}

interface IRemittanceAmountState {
  remittanceAmount: IRemittanceAmount
}
export const useRemittanceAmountStore = defineStore('remittanceAmount', {
  state: (): IRemittanceAmountState => {
    return {
      remittanceAmount: {
        id: 0,
        guaranteeAmount: 0,
        guaranteeApproveAmount: 0,
        month: '',
        newUserCount: 0,
        nextMonthForwardAmount: 0,
        paymentAmount: 0,
        previousMonthForwardAmount: 0,
        remittanceAmount: 0,
        shortageAmount: 0,
        createdTime: '',
      },
    }
  },
  actions: {
    updaterRemittanceAmountStore(params: IRemittanceAmount) {
      this.remittanceAmount = params
    },
    async getRemittanceAmount(query: string, agencyId: number | null) {
      const { data, error } = await useBaseFetch<IRemittanceAmount>(
        `/remittance-amount/${agencyId}?queryDate=${query}`
      )
      if (!error && data) {
        const handlerLogic = (data: number | null) => {
          if (data) return data
          return 0
        }

        this.updaterRemittanceAmountStore({
          ...data,
          guaranteeAmount: handlerLogic(data.guaranteeAmount),
          guaranteeApproveAmount: handlerLogic(data.guaranteeApproveAmount),
          newUserCount: handlerLogic(data.newUserCount),
          nextMonthForwardAmount: handlerLogic(data.nextMonthForwardAmount),
          paymentAmount: handlerLogic(data.paymentAmount),
          previousMonthForwardAmount: handlerLogic(
            data.previousMonthForwardAmount
          ),
          remittanceAmount: handlerLogic(data.remittanceAmount),
          shortageAmount: handlerLogic(data.shortageAmount),
        })
      } else {
        this.updaterRemittanceAmountStore({
          id: 0,
          month: '2023-01-01T10:12:33.281Z',
          newUserCount: 0,
          guaranteeAmount: 0,
          guaranteeApproveAmount: 0,
          remittanceAmount: 0,
          nextMonthForwardAmount: 0,
          paymentAmount: 0,
          shortageAmount: 0,
          previousMonthForwardAmount: 0,
          createdTime: '',
        })
      }
    },
  },
})

export interface IGuaranteeStatWithAgencyAmount {
  totalAgencyUser: number
  guaranteeFeeAmount: number
  totalGuarantee: number
  totalAgencyUserWithContract: number
  totalGuaranteeApproved: number
  totalAmountGuaranteeApproved: number
}

interface IGuaranteeStatWithAgencyState {
  guaranteeStatWithAgency: IGuaranteeStatWithAgencyAmount
}
export const useGuaranteeStatWithAgencyStore = defineStore(
  'guaranteeStatWithAgency',
  {
    state: (): IGuaranteeStatWithAgencyState => {
      return {
        guaranteeStatWithAgency: {
          totalAgencyUser: 0,
          guaranteeFeeAmount: 0,
          totalGuarantee: 0,
          totalAgencyUserWithContract: 0,
          totalGuaranteeApproved: 0,
          totalAmountGuaranteeApproved: 0,
        },
      }
    },
    actions: {
      updaterGuaranteeStatWithAgencyStore(
        params: IGuaranteeStatWithAgencyAmount
      ) {
        this.guaranteeStatWithAgency = params
      },
      async getGuaranteeStatWithAgency(agencyId: number) {
        const { data, error } =
          await useBaseFetch<IGuaranteeStatWithAgencyAmount>(
            `/get-stats/${agencyId}`
          )
        if (!error) {
          this.updaterGuaranteeStatWithAgencyStore(data)
        }
      },
    },
  }
)
