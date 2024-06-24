<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>保証履行</div>
    </div>

    <el-table
      :data="[agency]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column prop="userName" label="氏名" width="150" />
      <el-table-column prop="userNameFurigana" label="ふりがな" width="150" />
      <el-table-column prop="address" label="住所" width="150" />
      <el-table-column prop="tel" label="電話番号" width="140" />
      <el-table-column prop="contractDate" label="契約年月日" width="180">
        <template #default="scope">
          <span>
            {{
              formatDate(
                scope.row.contractDate,
                FORMAT_TYPE.YEAR_MONTH_DAY_NO_PADDING
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contractStartDate" label="契約開始月" width="180">
        <template #default="scope">
          <span>
            {{
              formatDate(scope.row.contractStartDate, FORMAT_TYPE.YEAR_MONTH)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contractEndDate" label="契約終了月" width="180">
        <template #default="scope">
          <span>
            {{ formatDate(scope.row.contractEndDate, FORMAT_TYPE.YEAR_MONTH) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showConfirmCreateGuarantee" class="w-full mt-20">
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
            <el-button @click="handleNavigateToListGuarantee()">戻る</el-button>

            <el-button type="primary" @click="handleSubmit()">
              保証履行を承認する
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

import { useAgencyUserStore } from '~~/stores/agencyUser'
import { ICreateGuaranteeParams, useGuaranteeStore } from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

/**
 * pinia
 */
const route = useRoute()
const router = useRouter()
const agencyUserStore = useAgencyUserStore()
const showConfirmCreateGuarantee = ref(true)

const guaranteeStore = useGuaranteeStore()
const guarantee = await guaranteeStore.getGuaranteeById(
  Number(route.params.guaranteeId as string)
)
const formatter = new Intl.NumberFormat('ja-JP')
const agency = await agencyUserStore.getAgencyUser(
  Number(guarantee.agencyUser.id)
)

const formRef = ref<FormInstance>()

const dataForm = reactive<ICreateGuaranteeParams>({
  billingAmount: formatter.format(guarantee.billingAmount),
  delinquencyStatus: guarantee.delinquencyStatus,
  dunningStatus: guarantee.dunningStatus,
})

async function handleSubmit() {
  const { error } = await guaranteeStore.approvedRequestGuarantee(
    Number(route.params.guaranteeId as string)
  )
  if (error?.statusCode && +error.statusCode !== 200) return

  useNotificationSuccess({ message: '保証履行を承認しました。' })
  handleNavigateToListGuarantee()
}

const handleNavigateToListGuarantee = () => {
  router.push({
    path: `/admin/list-guarantee`,
  })
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
