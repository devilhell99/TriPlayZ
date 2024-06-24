<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>販売店管理</div>
    </div>
    <div class="flex justify-stretch mb-[30px]">
      <el-date-picker
        v-model="date"
        type="month"
        :disabled-date="disabledMonthFuture"
        @change="fetchData"
      >
      </el-date-picker>
      <el-select-v2
        v-model="statusFilterValue"
        :options="options"
        size="large"
        clearable
        @change="handleChangeStatus"
      />
      <div class="ml-[20px]">
        <el-select-v2
          v-model="userFilterValue"
          :options="optionFilters"
          size="large"
          clearable
          @change="handleChangeUserFilter"
        />
      </div>
      <div></div>
    </div>

    <el-table
      :data="contactStore.contacts"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="ステータス" width="100">
        <template #default="scope">
          <span>
            {{
              scope.row.status === EContactStatus.ANSWERED ? '回答済' : '未回答'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="日時" width="180">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.dateTime, FORMAT_TYPE.YEAR_DAY_TIME_DATE) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="お名前" width="180" />
      <el-table-column prop="nameFurigana" label="ふりがな" width="180" />
      <el-table-column label="販売店" width="180">
        <template #default="scope">
          <span>
            {{
              scope?.row?.agencyName
                ? scope?.row?.agencyName
                : scope?.row?.agency?.companyName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="メールアドレス" width="180" />
      <el-table-column prop="content" label="問合せ内容" width="180" />

      <el-table-column width="180" fixed="right">
        <template #default="scope">
          <NuxtLink
            :to="{
              path: `/admin/inquiry/${scope.row.id}`,
            }"
          >
            <p class="text-primary-text font-bold text-center">詳細</p>
          </NuxtLink>
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
import { useContactStore } from '~~/stores/inquiry'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */

const paginationStore = usePaginationStore()

const contactStore = useContactStore()

const date = ref('')
const statusFilter = ref<number | string>(EContactStatus.UNANSWERED)
const userFilter = ref<number | string>(EContactFilter.ALL)
const status = [EContactStatus.ANSWERED, EContactStatus.UNANSWERED]
const filters = [
  EContactFilter.ALL,
  EContactFilter.DEALER_REGISTER,
  EContactFilter.DEALER_UNREGISTER,
]

const optionFilters = filters.map((_, idx) => ({
  value: `${filters[idx]}`,
  label: `${
    filters[idx] === EContactFilter.ALL
      ? '全て'
      : filters[idx] === EContactFilter.DEALER_REGISTER
      ? '販売店登録済'
      : '販売店未登録・ユーザー'
  }`,
}))
const disabledMonthFuture = (time: Date) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const selectedYear = time.getFullYear()
  const selectedMonth = time.getMonth()

  return (
    selectedYear > currentYear ||
    (selectedYear === currentYear && selectedMonth > currentMonth)
  )
}
const options = status.map((_, idx) => ({
  value: `${status[idx]}`,
  label: `${status[idx] === EContactStatus.ANSWERED ? '回答済み' : '未回答'}`,
}))
await contactStore.getContacts({
  date: date.value,
  status: Number(statusFilter.value),
  page: paginationStore.page,
  take: paginationStore.take,
  filter: Number(userFilter.value),
})

const fetchData = async () => {
  await contactStore.getContacts({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
    filter: Number(userFilter.value) ? Number(userFilter.value) : 0,
  })
  if (date.value === null) {
    handleChangePageIndex(1)
  }
}

const handleChangeStatus = async () => {
  await contactStore.getContacts({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
    filter: Number(userFilter.value) ? Number(userFilter.value) : 0,
  })
  if (statusFilter.value === undefined) {
    handleChangePageIndex(1)
  }
}
const handleChangeUserFilter = async () => {
  await contactStore.getContacts({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
    filter: Number(userFilter.value) ? Number(userFilter.value) : 0,
  })
  if (userFilter.value === undefined) {
    handleChangePageIndex(1)
  }
}

/**
 * methods
 */
async function handleChangePageIndex(currentPage: number) {
  paginationStore.page = currentPage
  await contactStore.getContacts({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
    filter: Number(userFilter.value) ? Number(userFilter.value) : 0,
  })
}

async function handleSizeChangePageIndex(currentTake: number) {
  paginationStore.take = currentTake
  await contactStore.getContacts({
    date: date.value ? date.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
    page: paginationStore.page,
    take: paginationStore.take,
    filter: Number(userFilter.value) ? Number(userFilter.value) : 0,
  })
}
const statusFilterValue = computed({
  get: () => String(statusFilter.value),
  set: (value) => {
    statusFilter.value = value ? parseInt(value) : ''
  },
})
const userFilterValue = computed({
  get: () => String(userFilter.value),
  set: (value) => {
    userFilter.value = value ? parseInt(value) : ''
  },
})
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
