<template>
  <div class="system-side-bar 2xl:w-[18%] sm:w-[17%]">
    <el-menu
      v-if="isSystemAdmin"
      background-color="#000000"
      text-color="#ffffff"
      active-text-color="#ffffff"
      class="el-menu-vertical-demo h-full"
      :default-active="currentRoutePathAdmin"
    >
      <el-menu-item class="menu-item" index="1">
        <template #title>
          <NuxtLink key="admin" to="/admin" class="w-full">
            <span>
              <el-icon><HomeFilled /></el-icon>トップ
            </span>
          </NuxtLink>
        </template>
      </el-menu-item>

      <el-menu-item class="menu-item" index="2">
        <template #title>
          <NuxtLink
            to="/admin/list-agency"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><UserFilled /></el-icon>販売店管理</span
            ></NuxtLink
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="3">
        <template #title>
          <NuxtLink
            to="/admin/list-inquiry"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><Switch /></el-icon>問い合わせ管理</span
            ></NuxtLink
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="4">
        <template #title>
          <NuxtLink
            to="/admin/list-guarantee"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><Setting /></el-icon>保証履行管理</span
            ></NuxtLink
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="5">
        <template #title>
          <NuxtLink
            to="/admin/receipt-import"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span>
              <el-icon><FolderAdd /></el-icon>入金インポート</span
            ></NuxtLink
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="11">
        <template #title>
          <a
            href="/Ｑ＆Ａ.pdf"
            target="_blank"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><DocumentCopy /></el-icon>Q&A</span
            ></a
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="12">
        <template #title>
          <a
            href="/マニュアル.pdf"
            target="_blank"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><DocumentCopy /></el-icon>マニュアル</span
            ></a
          >
        </template>
      </el-menu-item>
    </el-menu>

    <el-menu
      v-else
      background-color="#000000"
      text-color="#ffffff"
      active-text-color="#ffffff"
      class="el-menu-vertical-demo h-full"
      :default-active="currentRoutePathAgency"
    >
      <el-menu-item class="menu-item" index="6">
        <template #title>
          <NuxtLink to="/agency/top" class="w-full">
            <el-icon><HomeFilled /></el-icon>トップ
          </NuxtLink>
        </template>
      </el-menu-item>

      <el-sub-menu index="7">
        <template #title>
          <el-icon><UserFilled /></el-icon> <span>ユーザー管理</span>
        </template>
        <el-menu-item index="7-1">
          <NuxtLink to="/agency" class="w-full"
            ><el-icon><Tickets /></el-icon> ユーザー一覧
          </NuxtLink>
        </el-menu-item>

        <el-menu-item class="w-full" index="7-2">
          <NuxtLink to="/agency/import-csv" class="w-full">
            <el-icon><FolderAdd /></el-icon> CSVインポート
          </NuxtLink>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item class="menu-item" index="8">
        <template #title>
          <NuxtLink to="/agency/contract" class="w-full"
            ><el-icon><Document /></el-icon> 契約書</NuxtLink
          >
        </template>
      </el-menu-item>

      <el-menu-item class="menu-item" index="9">
        <template #title>
          <NuxtLink to="/agency/inquiry" class="w-full">
            <el-icon><DocumentChecked /></el-icon>問い合わせ
          </NuxtLink>
        </template>
      </el-menu-item>
      <el-sub-menu v-if="authStore.isRepresentative" index="10">
        <template #title>
          <span
            ><el-icon><StarFilled /></el-icon>販売店情報など</span
          >
        </template>
        <el-menu-item index="10-1">
          <NuxtLink to="/agency/agency-admin" class="w-full">
            <el-icon><Tickets /></el-icon>管理者一覧</NuxtLink
          >
        </el-menu-item>

        <el-menu-item index="10-2">
          <NuxtLink to="/agency/edit" class="w-full">
            <el-icon><Edit /></el-icon> 販売店情報の変更
          </NuxtLink>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item class="menu-item" index="11">
        <template #title>
          <a
            href="/Ｑ＆Ａ.pdf"
            target="_blank"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><DocumentCopy /></el-icon> Q&A</span
            ></a
          >
        </template>
      </el-menu-item>
      <el-menu-item class="menu-item" index="12">
        <template #title>
          <a
            href="/マニュアル.pdf"
            target="_blank"
            class="w-full"
            @click="paginationStore.page = 1"
            ><span
              ><el-icon><DocumentCopy /></el-icon> マニュアル</span
            ></a
          >
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  UserFilled,
  Document,
  FolderAdd,
  Tickets,
  HomeFilled,
  DocumentChecked,
  StarFilled,
  Edit,
  DocumentCopy,
  Switch,
  Setting,
} from '@element-plus/icons-vue'
import { useAuthStore } from '~~/stores/auth'
import { usePaginationStore } from '~~/stores/pagination'

const authStore = useAuthStore()
const isSystemAdmin = ref(false)
authStore.role === ERole.SYSTEM_ADMIN
  ? (isSystemAdmin.value = true)
  : (isSystemAdmin.value = false)

const router = useRouter()
const paginationStore = usePaginationStore()
const currentRoutePathAdmin = computed(() => {
  const routePath = router.currentRoute.value.path
  switch (routePath) {
    case '/admin/list-agency':
      return '2'
    case '/admin/list-agency/':
      return '2'
    case '/admin/list-inquiry':
      return '3'
    case '/admin/list-inquiry/':
      return '3'
    case '/admin/list-guarantee':
      return '4'
    case '/admin/list-guarantee/':
      return '4'
    case '/admin/receipt-import':
      return '5'
    case '/admin/receipt-import/':
      return '5'
    default:
      return '1'
  }
})
const currentRoutePathAgency = computed(() => {
  const routePath = router.currentRoute.value.path
  switch (routePath) {
    case '/agency':
      return '7-1'
    case '/agency/':
      return '7-1'
    case '/agency/import-csv':
      return '7-2'
    case '/agency/import-csv/':
      return '7-2'
    case '/agency/contract':
      return '8'
    case '/agency/contract/':
      return '8'
    case '/agency/inquiry':
      return '9'
    case '/agency/inquiry/':
      return '9'
    case '/agency/agency-admin':
      return '10-1'
    case '/agency/agency-admin/':
      return '10-1'
    case '/agency/edit':
      return '10-2'
    case '/agency/edit/':
      return '10-2'
    default:
      return '6'
  }
})
</script>

<style lang="scss">
.system-side-bar {
  .el-menu-item.is-active {
    background-color: #0871e1;
  }
}
.menu-item {
  padding-left: 8px !important;
}
</style>
