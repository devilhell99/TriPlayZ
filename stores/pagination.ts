import { defineStore } from 'pinia'

export interface IPaginationState {
  search: string
  orderField: string
  status: number
  date: string
  filter: number
  order: string
  take: number
  page: number
  totalItems: number
}

export const usePaginationStore = defineStore('pagination', {
  state: (): IPaginationState => {
    return {
      search: '',
      orderField: '',
      status: 0,
      date: '',
      filter: 0,
      order: '',
      take: 10,
      page: 1,
      totalItems: 0,
    }
  },
  actions: {
    setPagination(params: IPaginationState) {
      this.search = params.search
      this.orderField = params.orderField
      this.date = params.date
      this.filter = params.filter
      this.status = params.status
      this.order = params.order
      this.take = params.take
      this.page = params.page
      this.totalItems = params.totalItems
    },
  },
})
