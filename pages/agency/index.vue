<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>ユーザー管理</div>
    </div>

    <div class="flex justify-between flex-wrap">
      <el-form :inline="true" :model="searchContent">
        <el-form-item>
          <el-input
            v-model="searchContent.query"
            :style="{ width: '300px' }"
            placeholder="氏名・ふりがな・住所を入力"
          >
            <template #suffix>
              <el-icon v-if="searchContent.query" @click="clearQuery()"
                ><ElIconClose
              /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()"> 検索 </el-button>
        </el-form-item>
      </el-form>

      <el-select-v2
        v-model="statusFilterValue"
        :options="options"
        size="large"
        clearable
        @change="handleChangeStatus"
      />

      <div class="xxx">
        <el-button
          type="primary"
          @click="dialogSystemPlanVisible = !dialogSystemPlanVisible"
          >新規登録
        </el-button>

        <el-button type="primary" @click="handleNavigateToImportExcel">
          CSVインポート
        </el-button>

        <el-button class="ml-8" type="primary" @click="handleExportExcel()">
          CSV出力
        </el-button>
      </div>
    </div>

    <el-table
      :data="agencyUserStore.agencyUsers"
      style="width: 100%"
      empty-text="データが存在しません"
      @sort-change="handleSortChange"
    >
      <el-table-column sortable prop="userName" label="氏名" width="150" />
      <el-table-column
        sortable
        prop="userNameFurigana"
        label="ふりがな"
        width="150"
      />
      <el-table-column sortable prop="allAddress" label="住所" width="150" />
      <el-table-column sortable prop="tel" label="電話番号" width="150" />
      <el-table-column
        sortable
        prop="contractDate"
        label="契約年月日"
        width="150"
      >
        <template #default="scope">
          <span>
            {{ convertDate(scope.row.contractDate) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="contractStartDate"
        label="契約開始月"
        width="150"
      >
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.contractStartDate, FORMAT_TYPE.YEAR_MONTH)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="contractEndDate"
        label="契約終了月"
        width="150"
      >
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.contractEndDate, FORMAT_TYPE.YEAR_MONTH) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="contractCancelDate"
        label="解約月"
        width="150"
      >
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.contractCancelDate, FORMAT_TYPE.YEAR_MONTH)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="guaranteeDate"
        label="保証履行年月"
        width="150"
      >
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.guaranteeDate, FORMAT_TYPE.YEAR_MONTH) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="guaranteeAmount"
        label="保証履行額"
        width="150"
      >
        <template #default="scope">
          <span>
            {{
              scope.row.guaranteeAmount
                ? Math.floor(scope.row.guaranteeAmount)
                : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="contractUpdateDate"
        label="更新年月日"
        width="150"
      >
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.contractUpdateDate, FORMAT_TYPE.YEAR_MONTH)
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        width="300"
        class-name="table-header-fixed"
      >
        <template #default="scope">
          <el-button
            class="cursor-pointer"
            type="primary"
            width="36"
            height="24"
            :icon="ElIconEdit"
            @click="handleOpenUpdatePlan(scope.row)"
          >
            編集
          </el-button>

          <el-button
            v-if="
              !guaranteeStore.guarantees.some(
                (item) => item.agencyUserId === scope.row.id
              )
            "
            class="cursor-pointer"
            type="primary"
            width="36"
            height="24"
            @click="navigateToOtherRoute(scope.row.id)"
          >
            保証履行請求
          </el-button>
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
    <Modal
      v-model="dialogSystemPlanVisible"
      title="ユーザーの新規登録"
      on-submit-label="確認"
      on-cancel-label="キャンセル"
      @submit="openConfirmCreateUser ? openConfirm() : useNotificationError()"
      @cancel="handleCancel(formRef)"
    >
      <template #body>
        <el-form
          ref="formRef"
          :model="dataForm"
          :rules="rules"
          :scroll-to-error="true"
          label-width="120px"
          label-position="top"
        >
          <FormAgencyUser :data-form="dataForm" />
        </el-form>
      </template>
    </Modal>

    <Modal
      v-model="dialogAgencyUserConfirmVisible"
      :title="`${isDisabled ? 'ユーザー登録の確認' : 'ユーザーの変更'}`"
      :on-submit-label="`${isDisabled ? '登録' : '保存'}`"
      :on-cancel-label="`${isDisabled ? '戻る' : 'キャンセル'}`"
      :is-button="true"
      @submit="handleSubmit(formConfirmRef)"
      @cancel="isDisabled ? handleCancelConfirm() : handleCancelConfirmUpdate()"
      @delete="handleDeleteAgency"
    >
      <template #body>
        <el-form
          ref="formConfirmRef"
          :model="dataFormConfirm"
          :rules="rules"
          :scroll-to-error="true"
          label-width="120px"
          label-position="top"
        >
          <FormAgencyUserConfirm
            :is-disabled="isDisabled"
            :data-form-confirm="dataFormConfirm"
          />
        </el-form>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { FormInstance, FormRules } from 'element-plus'
import { usePaginationStore } from '~~/stores/pagination'
import {
  ICreateAgencyUserParams,
  useAgencyUserStore,
  IAgencyUser,
  IUpdateAgencyUserParams,
} from '~~/stores/agencyUser'

import { useGuaranteeStore } from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

/**
 * pinia
 */
const agencyUserStore = useAgencyUserStore()
const paginationStore = usePaginationStore()
const guaranteeStore = useGuaranteeStore()

await guaranteeStore.getGuaranteeList()

const searchContent = reactive({
  query: '',
})
const sortColumn = ref('')
const sortOrder = ref('')
const isDisabled = ref(true)
const statusFilter = ref<number | string>(EContractStatus.UNDER_CONTRACT)

await agencyUserStore.getAgencyUsers({
  search: searchContent.query,
  order: sortOrder.value,
  orderField: sortColumn.value,
  page: paginationStore.page,
  take: paginationStore.take,
  status: Number(statusFilter.value),
})

const router = useRouter()

/**
 * data
 */
const dialogSystemPlanVisible = ref(false)
const dialogAgencyUserConfirmVisible = ref(false)
const openConfirmCreateUser = ref(false)

const dataForm = reactive<ICreateAgencyUserParams>({
  userName: '',
  userNameFurigana: '',
  address: '',
  address2: '',
  tel: '',
  contractDate: new Date(),
  isContractUpdate: false,
  contractStartDate: new Date(),
  contractEndDate: new Date(),
})

const dataFormConfirm = reactive<IUpdateAgencyUserParams>({
  userName: dataForm.userName,
  userNameFurigana: dataForm.userNameFurigana,
  address: dataForm.address,
  address2: dataForm.address2,
  tel: dataForm.tel,
  contractDate: dataForm.contractDate,
  isContractUpdate: dataForm.isContractUpdate,
  contractStartDate: dataForm.contractStartDate,
  contractEndDate: dataForm.contractEndDate,
  contractCancelDate: '',
  guaranteeAmount: null,
  guaranteeDate: '',
  contractUpdateDate: '',
  reasonForChange: '',
})

watch([dataForm], () => {
  dataForm.contractDate &&
  dataForm.tel &&
  dataForm.userName &&
  dataForm.userNameFurigana
    ? (openConfirmCreateUser.value = true)
    : (openConfirmCreateUser.value = false)
})
const formConfirmRef = ref<FormInstance>()

const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  ...useValidateString('userName', '氏名', { required: true, max: 100 }),
  ...useValidateString('userNameFurigana', 'ふりがな', {
    required: true,
    max: 100,
  }),
  ...useValidateString('address', '住所1', {
    required: true,
    max: 100,
  }),
  ...useValidateString('address2', '住所2', {
    required: true,
    max: 100,
  }),
  ...useValidateString('tel', '電話番号', {
    required: true,
    min: 12,
    max: 12,
  }),
})

const agencyUser = ref<IAgencyUser | null>()

/**
 * methods
 */
async function handleChangePageIndex(currentPage: number) {
  paginationStore.page = currentPage
  await agencyUserStore.getAgencyUsers({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
}

async function handleSizeChangePageIndex(currentTake: number) {
  paginationStore.take = currentTake
  await agencyUserStore.getAgencyUsers({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
}

async function handleSearch() {
  await agencyUserStore.getAgencyUsers({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : 'asc',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
}

const agencyId = ref<number>(0)
const agencyName = ref<string>('')

// eslint-disable-next-line require-await
const handleDeleteAgency = async () => {
  ElMessageBox.confirm(`${agencyName.value}を削除してもよろしいでしょうか?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'キャンセル',
    type: 'warning',
  }).then(async () => {
    await agencyUserStore.deleteAgencyUser(agencyId.value)

    await agencyUserStore.getAgencyUsers({
      search: searchContent.query,
      order: sortOrder.value,
      orderField: sortColumn.value,
      page: paginationStore.page,
      take: paginationStore.take,
      status: Number(statusFilter.value),
    })

    dialogAgencyUserConfirmVisible.value = false
  })
}

const clearQuery = () => {
  searchContent.query = ''
  handleChangePageIndex(1)
}

const convertDate = (date: string) => {
  if (date) return dayjs(date).format('YYYY年MM月DD日')
}

const handleSortChange = async (sort: any) => {
  sortOrder.value = sort.order === 'descending' ? 'desc' : 'asc'
  sortColumn.value = sort.prop
  if (sort.order === null && sortColumn.value === sort.prop) {
    sortOrder.value = ''
    sortColumn.value = ''
  }

  paginationStore.page = 1
  await agencyUserStore.getAgencyUsers({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : '',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
}

const handleExportExcel = async () => {
  await agencyUserStore.exportCsv({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : '',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
}

async function handleSubmit(formConfirmRef: FormInstance | undefined) {
  if (!formConfirmRef) return
  await formConfirmRef.validate(async (valid, _fields) => {
    if (!valid) return

    const agencyUserId = agencyUser.value?.id

    const {
      userName,
      userNameFurigana,
      address,
      address2,
      tel,
      contractDate,
      isContractUpdate,
      contractEndDate,
      contractStartDate,
      contractCancelDate,
      guaranteeAmount,
      guaranteeDate,
      reasonForChange,
    } = dataFormConfirm

    if (agencyUserId) {
      const { error } = await agencyUserStore.updateUserAgency(agencyUserId, {
        userName,
        userNameFurigana,
        address,
        address2,
        tel,
        contractDate,
        isContractUpdate,
        contractEndDate,
        contractStartDate,
        contractCancelDate,
        guaranteeAmount,
        guaranteeDate,
        reasonForChange,
      })

      if (error?.statusCode && +error.statusCode !== 200) return
      Object.assign(dataForm, {
        id: undefined,
        userName: '',
        userNameFurigana: '',
        address: '',
        address2: '',
        tel: '',
        contractDate: new Date(),
        isContractUpdate: false,
        contractEndDate: null,
        contractStartDate: null,
      })

      Object.assign(dataFormConfirm, {
        id: undefined,
        userName: '',
        userNameFurigana: '',
        address: '',
        address2: '',
        tel: '',
        contractDate: new Date(),
        isContractUpdate: false,
        contractEndDate: null,
        contractStartDate: null,
        reasonForChange: '',
      })

      agencyUser.value = null

      useNotificationSuccess()
    } else {
      const { error } = await agencyUserStore.createAgencyUser({
        userName,
        userNameFurigana,
        address,
        address2,
        tel,
        contractDate,
        isContractUpdate,
        contractEndDate,
        contractStartDate,
      })

      if (error?.statusCode && +error.statusCode !== 200) return
      Object.assign(dataForm, {
        id: undefined,
        userName: '',
        userNameFurigana: '',
        address: '',
        address2: '',
        tel: '',
        contractDate: new Date(),
        isContractUpdate: false,
        contractEndDate: null,
        contractStartDate: null,
      })
      Object.assign(dataFormConfirm, {
        id: undefined,
        userName: '',
        userNameFurigana: '',
        address: '',
        address2: '',
        tel: '',
        contractDate: new Date(),
        isContractUpdate: false,
        contractEndDate: null,
        contractStartDate: null,
        reasonForChange: '',
      })

      agencyUser.value = null

      useNotificationSuccess()
    }

    dialogAgencyUserConfirmVisible.value = false
    if (!agencyUserId) paginationStore.page = 1
    await agencyUserStore.getAgencyUsers({
      page: paginationStore.page,
      take: paginationStore.take,
      search: searchContent.query ? searchContent.query : '',
      order: sortOrder.value ? sortOrder.value : 'asc',
      orderField: '',
      status: +statusFilter.value ? +statusFilter.value : 0,
    })
  })
}

function handleCancel(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
  Object.assign(dataForm, {
    id: undefined,
    userName: '',
    userNameFurigana: '',
    address: '',
    address2: '',
    tel: '',
    contractDate: new Date(),
    isContractUpdate: null,
    contractEndDate: null,
    contractStartDate: null,
  })
  agencyUser.value = null
}

function handleCancelConfirm() {
  dialogSystemPlanVisible.value = true
  dialogAgencyUserConfirmVisible.value = false
}

function handleCancelConfirmUpdate() {
  dialogAgencyUserConfirmVisible.value = false
  isDisabled.value = true
}

function openConfirm() {
  dialogSystemPlanVisible.value = false
  dialogAgencyUserConfirmVisible.value = true
  isDisabled.value = true
  dataForm.contractStartDate = plusMonth(dataForm.contractDate as Date, 1)
  dataForm.contractEndDate = plusYear(dataForm.contractDate as Date, 10)
  Object.assign(dataFormConfirm, dataForm)
}

function handleOpenUpdatePlan(data: { id: number; userName: string }) {
  agencyId.value = data.id
  agencyName.value = data.userName
  dialogAgencyUserConfirmVisible.value = true
  isDisabled.value = false

  agencyUser.value = agencyUserStore.agencyUsers.find((v) => +v.id === +data.id)

  if (!agencyUser.value) return

  dataFormConfirm.userName = agencyUser.value.userName || ''
  dataFormConfirm.userNameFurigana = agencyUser.value.userNameFurigana || ''

  dataFormConfirm.address = agencyUser.value.address || ''
  dataFormConfirm.address2 = agencyUser.value.address2 || ''
  dataFormConfirm.tel = agencyUser.value.tel || ''
  dataFormConfirm.contractDate = agencyUser.value.contractDate
  dataFormConfirm.contractStartDate = agencyUser.value.contractStartDate
  dataFormConfirm.contractEndDate = agencyUser.value.contractEndDate
  dataFormConfirm.isContractUpdate = agencyUser.value.isContractUpdate
  dataFormConfirm.contractCancelDate = new Date(
    agencyUser.value.contractCancelDate
      ? agencyUser.value.contractCancelDate
      : ''
  )
  dataFormConfirm.guaranteeAmount = agencyUser.value.guaranteeAmount
    ? agencyUser.value.guaranteeAmount
    : null
  dataFormConfirm.guaranteeDate = agencyUser.value.guaranteeDate
    ? new Date(agencyUser.value.guaranteeDate)
    : ''
  dataFormConfirm.contractUpdateDate = agencyUser.value.contractUpdateDate
  dataFormConfirm.reasonForChange = agencyUser.value.reasonForChange
}

const status = [
  EContractStatus.ALL,
  EContractStatus.UNDER_CONTRACT,
  EContractStatus.CANCELED,
]

const options = status.map((_, idx) => ({
  value: `${status[idx]}`,
  label: `${
    status[idx] === EContractStatus.ALL
      ? '全て'
      : status[idx] === EContractStatus.UNDER_CONTRACT
      ? '契約中'
      : '解約済'
  }`,
}))
const handleChangeStatus = async () => {
  await agencyUserStore.getAgencyUsers({
    page: paginationStore.page,
    take: paginationStore.take,
    search: searchContent.query ? searchContent.query : '',
    order: sortOrder.value ? sortOrder.value : '',
    orderField: sortColumn.value ? sortColumn.value : '',
    status: Number(statusFilter.value) ? Number(statusFilter.value) : 0,
  })
  if (statusFilter.value === undefined) {
    handleChangePageIndex(1)
  }
}

const navigateToOtherRoute = (agencyUserId: string) => {
  router.push({
    path: `/agency/guarantee/${agencyUserId}`,
  })
}

const handleNavigateToImportExcel = () => {
  router.push({
    path: `/agency/import-csv`,
  })
}
const statusFilterValue = computed({
  get: () => String(statusFilter.value),
  set: (value) => {
    statusFilter.value = value ? parseInt(value) : ''
  },
})
</script>

<style>
.el-upload-list {
  display: none;
}

.table-header-fixed.el-table-fixed-column--right.is-first-column.is-leaf.el-table__cell {
  @apply bg-primary;
}
</style>
