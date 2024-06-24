import { defineStore } from 'pinia'

export interface IAgencyAdminWithCompany {
  id: number
  adminName: string
  adminNameFurigana: string
  email: string
  agency: {
    companyName: string
    id: number
    bankNo: number
  }
}

interface IAgencyAdminWithCompanyState {
  agencyAdmin: IAgencyAdminWithCompany
}
export const useAgencyAdminWithCompanyStore = defineStore(
  'agencyAdminWithCompany',
  {
    state: (): IAgencyAdminWithCompanyState => {
      return {
        agencyAdmin: {
          id: 0,
          adminName: '',
          adminNameFurigana: '',
          email: '',
          agency: {
            bankNo: 0,
            companyName: '',
            id: 0,
          },
        },
      }
    },
    actions: {
      setAgencyAdmin(data: IAgencyAdminWithCompany) {
        this.agencyAdmin = data
      },

      async getAgencyAdmin(): Promise<IAgencyAdminWithCompany> {
        const { data } = await useBaseFetch<IAgencyAdminWithCompany>(
          `/agency-admin`
        )
        this.setAgencyAdmin(data)
        return data
      },
    },
  }
)

export interface IAgencyAdmin {
  id: number
  adminName: string
  adminNameFurigana: string
  email: string
  password: string
  isRepresentative: boolean
}

interface IAgencyAdminState {
  agencyAdmins: IAgencyAdmin[]
}

export interface ICreateAgencyAdminParams {
  adminName: string
  adminNameFurigana: string
  email: string
  password?: string
  isRepresentative: boolean
}
interface ICreateAgencyAdminResponse {
  data: any
}

export const useAgencyAdminStore = defineStore('agencyAdmin', {
  state: (): IAgencyAdminState => {
    return {
      agencyAdmins: [],
    }
  },
  actions: {
    updateAgencyAdminsStore(params: IAgencyAdmin[]) {
      this.agencyAdmins = params
    },
    async getAgencyAdmin() {
      const { data, error } = await useBaseFetch<IAgencyAdmin[]>(
        `/agency-admins`
      )
      if (!error) {
        this.updateAgencyAdminsStore(data)
      }
    },

    async getAgencyAdminByAgencyId(agencyId: number) {
      const { data, error } = await useBaseFetch<IAgencyAdmin[]>(
        `/agency-admins/${agencyId}`
      )
      if (!error) {
        this.updateAgencyAdminsStore(data)
      }
    },
    async createAgencyAdmin(params: ICreateAgencyAdminParams) {
      return await useBaseFetch<ICreateAgencyAdminResponse>('/agency-admin', {
        body: params,
        method: 'POST',
      })
    },
    async updateAgencyAdmin(id: number, params: ICreateAgencyAdminParams) {
      if (!params.password) delete params.password
      return await useBaseFetch<ICreateAgencyAdminResponse>(
        `agency-admin/${id}`,
        {
          body: {
            ...params,
          },
          method: 'PUT',
        }
      )
    },
    async deleteAgencyAdmin(id: number) {
      return await useBaseFetch<ICreateAgencyAdminResponse>(
        `agency-admin/${id}`,
        {
          method: 'DELETE',
        }
      )
    },
  },
})
