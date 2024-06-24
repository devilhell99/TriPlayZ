import { defineStore } from 'pinia'
import { IPaginationState, usePaginationStore } from './pagination'

export interface IContact {
  id: number
  name: string
  nameFurigana: string
  email: string
  content: string
  dateTime: string
  status: number
  contactsReply: { content: string }[]
  contactReplys: string
  agency: {
    companyName: string
    id: string
  }
  agencyName?: string
}

interface IContactState {
  contacts: IContact[]
  inquiryTable: IContact[]
}

interface IContacts extends IPaginationState {
  data: IContact[]
}

interface IGetContactsParams {
  page: number
  take: number
  status: number
  date: string
  filter: number
}

export interface ICreateContactParams {
  name: string
  nameFurigana: string
  email: string
  content: string
  companyName?: string
}

export interface ICreateContactReplyParams {
  content: string
}

interface ICreateContactResponse {
  data: any
}

export const useContactStore = defineStore('contact', {
  state: (): IContactState => {
    return {
      contacts: [],
      inquiryTable: [],
    }
  },
  actions: {
    updateContactsStore(params: IContact[]) {
      this.contacts = params
    },

    updateInquiryTableStore(params: IContact) {
      this.inquiryTable.push({
        ...params,
        contactReplys: params.contactsReply.length
          ? params.contactsReply
              .map((i: { content: string }) => {
                return i.content
              })
              .join(',')
          : '',
      })
    },

    resetInquiryTableStore() {
      this.inquiryTable = []
    },

    async getContactsByAgencyId(agencyId: number) {
      const { data, error } = await useBaseFetch<IContact[]>(
        `/contact/agency/${agencyId}`
      )
      if (!error) {
        this.updateContactsStore(data)
      }
    },
    async createContact(params: ICreateContactParams) {
      return await useBaseFetch<ICreateContactResponse>('/contact', {
        body: params,
        method: 'POST',
      })
    },

    async createContactReply(
      contactId: number,
      params: ICreateContactReplyParams
    ) {
      return await useBaseFetch<ICreateContactResponse>(
        `/reply-contact/${contactId}`,
        {
          body: params,
          method: 'POST',
        }
      )
    },

    async getContactReplyByContactId(contactId: number) {
      const data = await useBaseFetch<IContact>(`/reply-contact/${contactId}`)
      return data
    },

    async getContactsById(contactId: number) {
      const { data } = await useBaseFetch<IContact>(`/contact/${contactId}`)
      this.updateInquiryTableStore(data)
      return data
    },

    async getContacts(params: IGetContactsParams) {
      const { data, error } = await useBaseFetch<IContacts>(
        `/contacts?page=${params.page}&take=${params.take}&status=${params.status}&date=${params.date}&filter=${params.filter}`
      )

      if (!error) {
        this.updateContactsStore(data.data)

        const paginationStore = usePaginationStore()

        paginationStore.setPagination({
          search: '',
          order: '',
          orderField: '',
          filter: params.filter,
          status: params.status,
          date: params.date,
          take: data.take,
          page: data.page,
          totalItems: data.totalItems,
        })
      }
    },

    async getContactsWithoutPagination() {
      const { data, error } = await useBaseFetch<IContact[]>(
        `/contacts-without-pagination`
      )

      if (!error) {
        this.updateContactsStore(data)
      }
    },
  },
})

export interface IContactStats {
  totalContactAnswered: number
  totalContactUnanswered: number
  totalContactInMonth: number
}

interface IContactStatsState {
  contactStats: IContactStats
}
export const useContactStatsStore = defineStore('contactStats', {
  state: (): IContactStatsState => {
    return {
      contactStats: {
        totalContactAnswered: 0,
        totalContactUnanswered: 0,
        totalContactInMonth: 0,
      },
    }
  },
  actions: {
    updateContactStore(params: IContactStats) {
      this.contactStats = params
    },
    async getContactStats() {
      const { data, error } = await useBaseFetch<IContactStats>(
        `/contact-stats`
      )
      if (!error) {
        this.updateContactStore(data)
      }
    },
  },
})
