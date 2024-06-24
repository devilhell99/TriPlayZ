<template>
  <div class="w-full">
    <TitleTable :title="'問い合わせ'" />

    <el-table
      :data="[contactStatsStore.contactStats]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column prop="totalContactInMonth" label="当月問い合わせ件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalContactInMonth) }}
        </template>
      </el-table-column>

      <el-table-column prop="totalContactAnswered" label="当月回答済み件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalContactAnswered) }}
        </template>
      </el-table-column>

      <el-table-column prop="totalContactUnanswered" label="未回答件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalContactUnanswered) }}
        </template>
      </el-table-column>

      <el-table-column width="150" fixed="right">
        <template #default="">
          <NuxtLink
            :to="{
              path: `/admin/list-inquiry`,
            }"
            :style="{ color: 'blue' }"
            ><p class="text-primary-text font-bold">詳細</p></NuxtLink
          >
        </template>
      </el-table-column>
    </el-table>

    <TitleTable :title="'保証履行'" :top="'mt-10'" />
    <el-table
      :data="[guaranteeStatsStore.guaranteeStats]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column
        prop="totalGuaranteeInMonth"
        label="当月保証履行請求件数"
        width="200"
      >
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalGuaranteeInMonth) }}
        </template>
      </el-table-column>

      <el-table-column prop="totalGuaranteeApproved" label="当月承認済み件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalGuaranteeApproved) }}
        </template>
      </el-table-column>

      <el-table-column
        label="当月承認しない件数"
        prop="totalGuaranteeRequestInMonth"
      >
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalGuaranteeRequestInMonth) }}
        </template>
      </el-table-column>

      <el-table-column prop="totalGuaranteeRequest" label="審査中件数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalGuaranteeRequest) }}
        </template>
      </el-table-column>

      <el-table-column width="150">
        <template #default="">
          <NuxtLink
            :to="{
              path: `/admin/list-guarantee`,
            }"
          >
            <p class="text-primary-text font-bold">詳細</p>
          </NuxtLink>
        </template>
      </el-table-column>
    </el-table>

    <TitleTable :title="'販売店数'" :top="'mt-10'" />
    <el-table
      :data="[agencyStatsStore.agencyStats]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column
        prop="totalAgencyWithContractDateLessNow"
        label="先月までの販売店数"
      >
        <template #default="scope">
          {{
            handleFormattedNumber(scope.row.totalAgencyWithContractDateLessNow)
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="totalAgencyWithContractDateGreaterNow"
        label="今月増加した販売店数"
      >
        <template #default="scope">
          {{
            handleFormattedNumber(
              scope.row.totalAgencyWithContractDateGreaterNow
            )
          }}
        </template>
      </el-table-column>

      <el-table-column prop="totalAgency" label="合計店数">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalAgency) }}
        </template>
      </el-table-column>

      <el-table-column>
        <template #default="">
          <span>
            <NuxtLink
              :to="{
                path: `/admin/list-agency`,
              }"
              :style="{ color: 'blue' }"
              ><p class="text-primary-text font-bold">詳細</p></NuxtLink
            ></span
          >
        </template>
      </el-table-column>
    </el-table>

    <TitleTable :title="'全販売店の実績表示'" :top="'mt-10'" />
    <el-table
      :data="[agencyUserStatsStore.agencyUserStats]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column :label="`${searchDate}月の新規登録数`" width="150">
        <template #default="scope">
          {{ handleFormattedNumber(scope.row.totalAgencyUserInMonth) }}
        </template>
      </el-table-column>

      <el-table-column :label="`${searchDate}月の保証料合計`" width="160">
        <template #default="scope">
          {{
            `${handleFormattedNumber(
              scope.row.totalAgencyUserInMonth * 1000
            )} 円`
          }}
        </template>
      </el-table-column>
      <el-table-column
        :label="`${searchDate}月の保証履行承認額合計`"
        width="200"
      >
        <template #default="">
          {{
            `${handleFormattedNumber(
              guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeInMonth
            )} 円`
          }}
        </template>
      </el-table-column>
      <el-table-column :label="`${searchDate + 1}月の送金額`" width="160">
        <template #default="">
          <span>{{ handleFormattedNumber(totalRemittanceAmount) }} 円</span>
        </template>
      </el-table-column>

      <el-table-column label="次月繰越額">
        <template #default="">
          <span>
            {{
              `${handleFormattedNumber(totalNextMonthForwardAmount)} 円`
            }}</span
          >
        </template>
      </el-table-column>

      <el-table-column :label="`${searchDate}月不足額`">
        <template #default="">
          <span>
            {{
              `${handleFormattedNumber(
                guaranteeStatsStore.guaranteeStats.totalShortageAmount
              )} 円`
            }}</span
          >
        </template>
      </el-table-column>

      <el-table-column :label="`${searchDate - 1}月繰越額`">
        <template #default="">
          <span>
            {{
              `${handleFormattedNumber(
                guaranteeStatsStore.guaranteeStats
                  .totalPreviousMonthForwardAmount
              )} 円`
            }}</span
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mb-[30px] mt-[60px]"></div>
    <el-table
      :data="[agencyUserStatsStore.agencyUserStats]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="全販売店の累計登録件数">
        <template #default="scope">
          <span>{{ handleFormattedNumber(scope.row.totalAgencyUser) }} </span>
        </template>
      </el-table-column>

      <el-table-column label="累計保証料額">
        <template #default="scope">
          <span
            >{{ handleFormattedNumber(scope.row.totalAgencyUser * 1000) }} 円
          </span>
        </template>
      </el-table-column>
      <el-table-column label="累計保証請求件数">
        <template #default="scope">
          <div class="flex">
            <h1>
              {{ guaranteeStatsStore.guaranteeStats.totalGuarantee }}
            </h1>

            <h1
              v-if="
                guaranteeStatsStore.guaranteeStats.totalGuarantee !== 0 &&
                scope.row.totalAgencyUser !== 0
              "
            >
              {{
                ` (${handlerCalculate(
                  guaranteeStatsStore.guaranteeStats.totalGuarantee,
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
              {{ guaranteeStatsStore.guaranteeStats.totalGuaranteeApproved }}
            </h1>

            <h1
              v-if="
                guaranteeStatsStore.guaranteeStats.totalGuaranteeApproved !==
                  0 && scope.row.totalAgencyUser !== 0
              "
            >
              {{
                ` (${handlerCalculate(
                  guaranteeStatsStore.guaranteeStats.totalGuaranteeApproved,
                  scope.row.totalAgencyUser
                )}%)`
              }}
            </h1>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="累計保証履行額">
        <template #default="">
          {{
            `${handleFormattedNumber(
              guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeApproved
            )}`
          }}
          円
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useAgencyStatsStore } from '~~/stores/agency'
import { useAgencyUserStatsStore } from '~~/stores/agencyUser'
import { useGuaranteeStatsStore } from '~~/stores/guarantee'
import { useContactStatsStore } from '~~/stores/inquiry'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */

const guaranteeStatsStore = useGuaranteeStatsStore()
await guaranteeStatsStore.getGuaranteeStats()

const contactStatsStore = useContactStatsStore()
await contactStatsStore.getContactStats()
const searchDate = ref(
  Number(formatDate(new Date(), FORMAT_TYPE.YEAR_MONTH_DAY)?.slice(5, -3))
)
const totalRemittanceAmount = computed(() => {
  if (
    agencyUserStatsStore.agencyUserStats.totalAgencyUserInMonth * 1000 >=
    guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeInMonth
  ) {
    const totalCalculation =
      agencyUserStatsStore.agencyUserStats.totalAgencyUserInMonth * 1000 -
      guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeInMonth +
      guaranteeStatsStore.guaranteeStats.totalShortageAmount -
      guaranteeStatsStore.guaranteeStats.totalPreviousMonthForwardAmount
    return totalCalculation > 0 ? totalCalculation : 0
  } else {
    const totalCalculation =
      guaranteeStatsStore.guaranteeStats.totalShortageAmount -
      guaranteeStatsStore.guaranteeStats.totalPreviousMonthForwardAmount
    return totalCalculation > 0 ? totalCalculation : 0
  }
})
const totalNextMonthForwardAmount = computed(() => {
  if (
    guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeInMonth <=
    agencyUserStatsStore.agencyUserStats.totalAgencyUserInMonth * 1000
  ) {
    return 0
  } else {
    return (
      guaranteeStatsStore.guaranteeStats.totalAmountGuaranteeInMonth -
      agencyUserStatsStore.agencyUserStats.totalAgencyUserInMonth * 1000
    )
  }
})
const agencyStatsStore = useAgencyStatsStore()
await agencyStatsStore.getAgencyStats()

const agencyUserStatsStore = useAgencyUserStatsStore()
await agencyUserStatsStore.getAgencyUserStats()

const handlerCalculate = (data: number, total: number) => {
  if (data && total) {
    return ((data / total) * 100).toFixed(1)
  }
}
</script>

<style scoped></style>
