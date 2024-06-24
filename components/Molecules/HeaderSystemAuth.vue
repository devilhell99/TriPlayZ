<template>
  <header class="header border-b-2 border-primary h-16 bbdd">
    <div class="header-container px-4 h-full">
      <div class="inner py-2 h-full">
        <div class="flex items-center justify-between h-full">
          <div class="header-logo">
            <NuxtLink v-if="isSystemAdmin" to="/admin">
              <p class="font-bold">株式会社日本料金保証</p>
            </NuxtLink>
            <NuxtLink v-else to="/agency/top">
              <p class="font-bold">株式会社日本料金保証</p>
            </NuxtLink>
          </div>
          <div class="header-utils flex justify-between">
            <div class="nav flex justify-between mx-4">
              <p class="nav flex mx-4 font-[0]">
                {{ agencyAdminData?.agency.companyName }}
              </p>
              <p class="nav flex mx-4 font-light">
                {{ agencyAdminData?.adminName ?? '管理者' }}
              </p>
            </div>
            <el-button type="primary" size="small" @click="logOut()">
              ログアウト
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import {
  IAgencyAdminWithCompany,
  useAgencyAdminWithCompanyStore,
} from '~~/stores/agencyAdmin'
import { useAuthStore } from '~~/stores/auth'

const authStore = useAuthStore()
const isSystemAdmin = ref(false)
authStore.role === ERole.SYSTEM_ADMIN
  ? (isSystemAdmin.value = true)
  : (isSystemAdmin.value = false)
let agencyAdminData: IAgencyAdminWithCompany
if (!isSystemAdmin.value) {
  const agencyAdminStore = useAgencyAdminWithCompanyStore()
  agencyAdminData = await agencyAdminStore.getAgencyAdmin()
  localStorage.setItem('numberId', String(agencyAdminData.agency.id))
}
const logOut = () => {
  handleLogout()
}
</script>
