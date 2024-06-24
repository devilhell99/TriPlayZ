<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>販売店管理</div>
    </div>
    <div class="flex justify-stretch">
      <el-form :inline="true" :model="searchContent" class="search-form">
        <el-form-item>
          <el-input
            v-model.trim="searchContent.query"
            :style="{ width: '300px' }"
            placeholder="会社名・ふりがな・住所など"
          >
            <template #suffix>
              <el-icon v-if="searchContent.query" @click="clearQuery()"
                ><ElIconClose
              /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="-ml-6" type="primary" @click="handleSearch()"
            >検索</el-button
          >
        </el-form-item>
      </el-form>
      <div></div>
    </div>

    <el-table
      :data="agenciesStore.agencies"
      style="width: 100%"
      empty-text="データが存在しません"
      @sort-change="handleSortChange"
    >
      <el-table-column sortable prop="companyName" label="会社名" width="250" />
      <el-table-column
        sortable
        prop="companyNameFurigana"
        label="ふりがな"
        width="250"
      />
      <el-table-column sortable prop="address" label="住所" width="250" />
      <el-table-column sortable prop="tel" label="電話番号" width="150" />
      <el-table-column
        sortable
        prop="contractStartDate"
        label="契約年月日"
        width="150"
      >
        <template #default="scope">
          <span>
            {{
              formatDate(
                scope.row.contractStartDate,
                FORMAT_TYPE.YEAR_MONTH_DAY_NO_PADDING
              )
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column width="180" fixed="right">
        <template #default="scope">
          <NuxtLink
            :to="{
              path: `/admin/agency/${scope.row.id}`,
            }"
          >
            <p class="text-primary-text text-center font-bold">詳細</p>
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
import { useAgenciesStore } from '~~/stores/agency'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

/**
 * pinia
 */

const paginationStore = usePaginationStore()

const agenciesStore = useAgenciesStore()

const searchContent = reactive({
  query: '',
})
const sortColumn = ref('')
const sortOrder = ref('')

await agenciesStore.getAgencies({
  search: searchContent.query,
  order: sortOrder.value,
  orderField: sortColumn.value,
  page: paginationStore.page,
  take: paginationStore.take,
})

/**
 * methods
 */
async function handleChangePageIndex(currentPage: number) {
  paginationStore.page = currentPage
  await agenciesStore.getAgencies({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
  })
}

async function handleSizeChangePageIndex(currentTake: number) {
  paginationStore.take = currentTake
  await agenciesStore.getAgencies({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
  })
}

async function handleSearch() {
  await agenciesStore.getAgencies({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
  })
}

const clearQuery = () => {
  searchContent.query = ''
  handleChangePageIndex(1)
}

const handleSortChange = async (sort: any) => {
  sortOrder.value = sort.order === 'descending' ? 'desc' : 'asc'
  sortColumn.value = sort.prop
  if (sort.order === null && sortColumn.value === sort.prop) {
    sortOrder.value = ''
    sortColumn.value = ''
  }

  paginationStore.page = 1
  await agenciesStore.getAgencies({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : '',
    orderField: sortColumn.value ? sortColumn.value : '',
  })
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
