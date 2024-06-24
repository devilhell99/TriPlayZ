<template>
  <div>
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>トップ</div>
    </div>

    <div class="nav flex justify-between pb-2.5 mt-[30px]">
      <DateJapan v-model="searchDate" @change="fetchData" />
    </div>

    <el-table
      :data="[remittanceAmountStore.remittanceAmount]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column :label="`${DateMath}月の新規登録数`">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.newUserCount) }}
        </template>
      </el-table-column>

      <el-table-column :label="`${DateMath}月の保証料合計`">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.guaranteeAmount) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="`${DateMath}月の保証履行承認額合計`"
        :width="200"
      >
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.guaranteeApproveAmount) }}
        </template>
      </el-table-column>

      <el-table-column :label="`${DateMath + 1}月の送金額`">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.remittanceAmount) }}
        </template>
      </el-table-column>

      <el-table-column label="次月繰越額">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.nextMonthForwardAmount) }}
        </template>
      </el-table-column>

      <el-table-column :label="`${DateMath}月不足額`">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.shortageAmount) }}
        </template>
      </el-table-column>

      <el-table-column :label="`${DateMath - 1}月繰越額`">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.previousMonthForwardAmount) }}
        </template>
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mb-[30px] mt-[20px]"></div>
    <el-table
      :data="[guaranteeStatWithAgencyStore.guaranteeStatWithAgency]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="累計登録件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalAgencyUser) }}
        </template>
      </el-table-column>
      <el-table-column label="累計保証請求件数">
        <template #default="scope">
          <div class="flex">
            <h1>
              {{ scope.row.totalGuarantee }}
            </h1>

            <h1
              v-if="
                scope.row.totalGuarantee !== 0 &&
                scope.row.totalAgencyUser !== 0
              "
            >
              {{
                ` (${handlerCalculate(
                  scope.row.totalGuarantee,
                  scope.row.totalAgencyUser
                )}%)`
              }}
            </h1>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="累計保証承認件数">
        <template #default="scope">
          <div class="flex">
            <h1>
              {{ scope.row.totalGuaranteeApproved }}
            </h1>

            <h1
              v-if="
                scope.row.totalGuaranteeApproved !== 0 &&
                scope.row.totalAgencyUser !== 0
              "
            >
              {{
                `(${handlerCalculate(
                  scope.row.totalGuaranteeApproved,
                  scope.row.totalAgencyUser
                )}%)`
              }}
            </h1>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="max-w-[300px] mt-6">
      <el-card shadow="hover" class="flex flex-col">
        <h1 class="font-bold">【専用送金先口座】</h1>

        <h1>三井住友銀行アオイ支店</h1>

        <h1>
          普通預金・口座番号 :
          {{ agencyAdminStore?.agencyAdmin?.agency?.bankNo }}
        </h1>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import {
  useGuaranteeStatWithAgencyStore,
  useRemittanceAmountStore,
} from '~~/stores/guarantee'
import { useAgencyAdminWithCompanyStore } from '@/stores/agencyAdmin'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

const searchDate = ref(dayjs().format('YYYY/MM'))
const DateMath = ref(+dayjs(searchDate.value).format('M'))
const agencyId = localStorage.getItem('numberId')
const agencyAdminStore = useAgencyAdminWithCompanyStore()
const remittanceAmountStore = useRemittanceAmountStore()
const guaranteeStatWithAgencyStore = useGuaranteeStatWithAgencyStore()
const handlerCalculate = (data: number, total: number) => {
  if (data && total) return ((data / total) * 100).toFixed(1)
}

const firstDate = dayjs().format('YYYY-MM-DD')
if (agencyId) {
  await guaranteeStatWithAgencyStore.getGuaranteeStatWithAgency(+agencyId)
  await remittanceAmountStore.getRemittanceAmount(firstDate, +agencyId)
}

const fetchData = async () => {
  const dateQuery = dayjs(searchDate.value).format('YYYY-MM-DD')
  DateMath.value = +dayjs(dateQuery).format('M')
  if (dateQuery)
    await remittanceAmountStore.getRemittanceAmount(
      dateQuery as string,
      Number(agencyId)
    )
}
</script>
