<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>保証請求</div>
    </div>

    <el-table :data="agencyUser" style="width: 100%">
      <el-table-column prop="userName" label="氏名" width="150" />
      <el-table-column prop="userNameFurigana" label="ふりがな" width="150" />
      <el-table-column prop="address" label="住所" width="150" />
      <el-table-column prop="tel" label="電話番号" width="150" />
      <el-table-column prop="contractDate" label="契約年月日" width="150">
        <template #default="scope">
          <span>
            {{
              formatDate(
                scope.row.contractDate,
                FORMAT_TYPE.YEAR_DAY_TIME_DATE_NO_PADDING
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contractStartDate" label="契約開始月" width="150">
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.contractStartDate, FORMAT_TYPE.YEAR_MONTH)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contractEndDate" label="契約終了月" width="150">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.contractEndDate, FORMAT_TYPE.YEAR_MONTH) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!showConfirmCreateGuarantee" class="w-full mt-20">
      <el-form
        ref="formRef"
        :model="dataForm"
        :rules="rules"
        :scroll-to-error="true"
        label-width="120px"
        label-position="top"
      >
        <FormCreateGuarantee
          :data-form="dataForm"
          :show-confirm-create-guarantee="showConfirmCreateGuarantee"
        />
        <div class="flex justify-center">
          <el-form-item>
            <el-button @click="handleNavigateToListAgencyUser()"
              >キャンセル</el-button
            >

            <el-button
              type="primary"
              @click="
                checkOpenConfirm
                  ? handleOpenConfirm(formRef)
                  : useNotificationError()
              "
            >
              確認
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div v-if="showConfirmCreateGuarantee" class="w-full mt-40">
      <el-form
        ref="formRef"
        :model="dataForm"
        :scroll-to-error="true"
        label-width="120px"
        label-position="top"
      >
        <FormCreateGuarantee
          :data-form="dataForm"
          :show-confirm-create-guarantee="showConfirmCreateGuarantee"
        />
        <div class="flex justify-center">
          <el-form-item>
            <el-button @click="showConfirmCreateGuarantee = false"
              >戻る</el-button
            >

            <el-button type="primary" @click="handleSubmit(formRef)">
              保証履行請求する
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'

import { useAgencyUserStore, IAgencyUser } from '~~/stores/agencyUser'
import { ICreateGuaranteeParams, useGuaranteeStore } from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

/**
 * pinia
 */
const route = useRoute()
const agencyUserStore = useAgencyUserStore()
const guaranteeStore = useGuaranteeStore()
const checkOpenConfirm = ref(false)
const showConfirmCreateGuarantee = ref(false)
const router = useRouter()

const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  ...useValidateNumber('billingAmount', '請求額', {
    required: true,
    min: 1,
    max: 10000000,
  }),
  ...useValidateString('delinquencyStatus', '滞納状況', {
    required: true,
    max: 100,
  }),
  ...useValidateString('dunningStatus', '督促状況', {
    required: true,
    max: 100,
  }),
})

const dataForm = reactive<ICreateGuaranteeParams>({
  billingAmount: null,
  delinquencyStatus:
    '（例）○年○月分から○月分まで連続して滞納。○月○○円、○月○○円、○月○○円。',
  dunningStatus: `（例）○月○日に電話するが、出ず。○月○日訪問し、翌日の支払を約束するが、
支払無し。その後、電話しても出ない。`,
})

watch([dataForm], () => {
  dataForm.billingAmount && dataForm.delinquencyStatus && dataForm.dunningStatus
    ? (checkOpenConfirm.value = true)
    : (checkOpenConfirm.value = false)
})

const agencyUser = reactive<IAgencyUser[]>([
  {
    id: 0,
    userName: '',
    userNameFurigana: '',
    address: '',
    tel: '',
    contractDate: '',
    contractStartDate: '',
    contractEndDate: '',
    createdTime: '',
    isContractUpdate: false,
    contractUpdateDate: '',
    contractCancelDate: '',
    reasonForChange: '',
    guaranteeAmount: 0,
    guaranteeDate: '',
  },
])

onMounted(async () => {
  const dataAgencyUser = await agencyUserStore.getAgencyUser(
    Number(route.params.agencyUserId as string)
  )
  Object.assign(agencyUser[0], dataAgencyUser)
})

async function handleSubmit(formConfirmRef: FormInstance | undefined) {
  if (!formConfirmRef) return
  await formConfirmRef.validate(async (valid, _fields) => {
    if (!valid) return

    const { billingAmount, delinquencyStatus, dunningStatus } = dataForm

    const { error } = await guaranteeStore.createGuarantee(
      {
        billingAmount,
        delinquencyStatus,
        dunningStatus,
      },
      Number(route.params.agencyUserId as string)
    )

    if (error?.statusCode && +error.statusCode !== 200) return
    Object.assign(dataForm, {
      id: undefined,
      billingAmount: null,
      delinquencyStatus:
        '（例）○年○月分から○月分まで連続して滞納。○月○○円、○月○○円、○月○○円。',
      status: EGuaranteeStatus.REQUESTING,
      dunningStatus: `（例）○月○日に電話するが、出ず。○月○日訪問し、翌日の支払を約束するが、
支払無し。その後、電話しても出ない。`,
    })
    useNotificationSuccess({ message: '保証履行請求を申請しました。' })
    handleNavigateToListAgencyUser()
  })
}

async function handleOpenConfirm(formRef: FormInstance | undefined) {
  if (!formRef) return
  await formRef.validate((valid, _fields) => {
    if (!valid) return useNotificationError()
    showConfirmCreateGuarantee.value = true
  })
}

const handleNavigateToListAgencyUser = () => {
  router.push({
    path: `/agency`,
  })
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
