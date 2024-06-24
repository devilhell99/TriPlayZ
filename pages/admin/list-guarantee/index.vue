<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>保証履行管理</div>
    </div>
    <div class="flex justify-stretch mb-[30px]">
      <el-date-picker v-model="date" type="month" @change="fetchData">
      </el-date-picker>
      <el-select-v2
        v-model="statusFilterValue"
        :options="options"
        placeholder="Please select"
        size="large"
        clearable
        @change="handleChangeStatus"
      />
      <div></div>
    </div>

    <el-table
      :data="guaranteeStore.guarantees"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="ステータス" width="180">
        <template #default="scope">
          <span>
            {{
              scope.row.status === EGuaranteeStatus.APPROVED
                ? '承認済み'
                : '請求中'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="日時" width="180">
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.createdTime, FORMAT_TYPE.YEAR_DAY_TIME_DATE)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="agencyUser.userName" label="お名前" width="180" />
      <el-table-column
        prop="agencyUser.userNameFurigana"
        label="ふりがな"
        width="180"
      />
      <el-table-column prop="agency.companyName" label="販売店" width="180" />

      <el-table-column label="請求額" width="180">
        <template #default="scope">
          <span>{{ formatter.format(scope.row.billingAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180">
        <template #default="scope">
          <NuxtLink
            v-if="scope.row.status === EGuaranteeStatus.REQUESTING"
            :to="{
              path: `guarantee/${scope.row.id}`,
            }"
            :style="{ color: 'blue' }"
            ><p class="text-primary-text font-bold">詳細</p></NuxtLink
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-between mt-[30px]">
      <div></div>
      <Pagination
        @current-change="handleChangePageIndex"
        @size-change="handleSizeChangePageIndex"
      />
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaginationStore } from '~~/stores/pagination'
import { useGuaranteeStore } from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */

const paginationStore = usePaginationStore()

const guaranteeStore = useGuaranteeStore()

const date = ref('')
const statusFilter = ref<number | string>(EGuaranteeStatus.REQUESTING)
const status = [EGuaranteeStatus.APPROVED, EGuaranteeStatus.REQUESTING]

const options = status.map((_, idx) => ({
  value: `${status[idx]}`,
  label: `${status[idx] === EGuaranteeStatus.APPROVED ? '承認済み' : '請求中'}`,
}))
await guaranteeStore.getGuaranteeListWithPagination({
  date: date.value,
  status: Number(statusFilter.value),
  page: paginationStore.page,
  take: paginationStore.take,
})

const fetchData = async () => {
  await guaranteeStore.getGuaranteeListWithPagination({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
  })
  if (date.value === null) {
    handleChangePageIndex(1)
  }
}

const handleChangeStatus = async () => {
  await guaranteeStore.getGuaranteeListWithPagination({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
  })
  if (statusFilter.value === undefined) {
    handleChangePageIndex(1)
  }
}

/**
 * methods
 */
async function handleChangePageIndex(currentPage: number) {
  paginationStore.page = currentPage
  await guaranteeStore.getGuaranteeListWithPagination({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
  })
}

async function handleSizeChangePageIndex(currentTake: number) {
  paginationStore.take = currentTake
  await guaranteeStore.getGuaranteeListWithPagination({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
  })
}
const formatter = new Intl.NumberFormat('ja-JP')
const statusFilterValue = computed({
  get: () => String(statusFilter.value),
  set: (value) => {
    statusFilter.value = value ? parseInt(value) : ''
  },
})
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
