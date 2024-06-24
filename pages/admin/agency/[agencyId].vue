<template>
  <div class="w-full">
    <div class="pb-2.5 mb-[30px]">
      <div class="mb-[20px]">販売店の情報</div>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>会社名</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          agencyStore.agency.companyName
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>ふりがな</b></el-col>
        <el-col class="ml-[-150px]" :span="18"
          >{{ agencyStore.agency.companyNameFurigana }}
        </el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>住所</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          agencyStore.agency.address
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>電話番号</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          agencyStore.agency.tel
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>契約年月日</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          formatDate(
            agencyStore.agency.contractStartDate,
            FORMAT_TYPE.YEAR_MONTH_DAY_NO_PADDING
          )
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>口座番号</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          agencyStore.agency.bankNo
        }}</el-col>
        <el-col
          v-if="!showInputChangeAccountNumber"
          class="ml-[350px] absolute"
          :span="6"
        >
          <el-button
            size="small"
            type="primary"
            @click="
              showInputChangeAccountNumber = !showInputChangeAccountNumber
            "
            >変更</el-button
          >
        </el-col>
        <el-col
          v-if="showInputChangeAccountNumber"
          class="ml-[350px] absolute"
          :span="18"
        >
          <el-input v-model.number="accountNumber" size="small" />
        </el-col>
        <el-col
          v-if="showInputChangeAccountNumber"
          class="ml-[520px] absolute"
          :span="6"
        >
          <el-button
            size="small"
            type="primary"
            @click="handleSubmitUpdateBankNo()"
            >変更</el-button
          >
        </el-col>
        <el-col
          v-if="validationError"
          class="error-message ml-[720px] absolute"
        >
          <span>{{ validationError }}</span>
        </el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>備考</b></el-col>
        <el-col class="ml-[-150px]" :span="18">{{
          agencyStore.agency.note
        }}</el-col>
      </el-row>
    </div>
    <div class="nav flex justify-between pb-2.5 mb-[10px]">
      <div>管理者</div>
    </div>
    <el-table
      :data="agencyAdminStore.agencyAdmins"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column prop="adminName" label="名前" />

      <el-table-column prop="adminNameFurigana" label="ふりがな" />
      <el-table-column prop="email" label="メールアドレス" />

      <el-table-column label="上級管理者 ">
        <template #default="scope">
          <span>{{ scope.row.isRepresentative === true ? 'Yes' : 'No' }} </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mt-[30px]">
      <DateJapan v-model="searchDate" @change="fetchData" />
    </div>

    <div class="nav flex justify-between pb-2.5 mb-[10px]"></div>
    <el-table
      :data="[remittanceAmountStore.remittanceAmount]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column
        :label="`${DateMath}月の新規登録数`"
        prop="newUserCount"
      />
      <el-table-column
        :label="`${DateMath}月の保証料合計`"
        prop="guaranteeAmount"
      />
      <el-table-column
        :label="`${DateMath}月の保証履行承認額合計`"
        prop="guaranteeApproveAmount"
        :width="200"
      />

      <el-table-column
        :label="`${DateMath + 1}月の送金額`"
        prop="remittanceAmount"
      />

      <el-table-column label="次月繰越額" prop="nextMonthForwardAmount" />

      <el-table-column :label="`${DateMath}月不足額`" prop="shortageAmount" />
      <el-table-column
        :label="`${DateMath - 1}月繰越額`"
        prop="previousMonthForwardAmount"
      />
    </el-table>

    <div class="nav flex justify-between pb-2.5 mb-[30px] mt-[20px]"></div>
    <el-table
      :data="[guaranteeStatWithAgencyStore.guaranteeStatWithAgency]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="累計登録件数" prop="totalAgencyUser" />
      <el-table-column label="累計保証料額" prop="guaranteeFeeAmount" />
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
                ` (${handlerCalculate(
                  scope.row.totalGuaranteeApproved,
                  scope.row.totalAgencyUser
                )}%)`
              }}
            </h1>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="累計保証履行額"
        width="150"
        prop="totalAmountGuaranteeApproved"
      />
    </el-table>

    <div class="nav flex justify-between pb-2.5 mt-[30px] mb-[10px]">
      <div>入金履歴</div>
    </div>
    <el-table
      :data="payments.data"
      style="width: 50%"
      empty-text="データがありません。"
    >
      <el-table-column label="年月日">
        <template #default="scope">
          <span
            >{{
              formatDate(scope.row.paymentDate, FORMAT_TYPE.YEAR_DAY_TIME_DATE)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="入金額">
        <template #default="scope">
          <span>{{ `${scope.row.amount}円` }} </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mt-[40px] mb-[10px]">
      <div>問い合わせ</div>
    </div>
    <el-table
      :data="contactStore.inquiryTable"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column label="ステータス">
        <template #default="scope">
          <span
            >{{
              scope.row.status === EContactStatus.ANSWERED
                ? '回答済 '
                : '未回答'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="日時">
        <template #default="scope">
          <span
            >{{
              formatDate(scope.row.dateTime, FORMAT_TYPE.YEAR_DAY_TIME_DATE)
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="content" label="問合せ内容" />

      <el-table-column label="回答内容" width="400">
        <template #default="scope">
          <p class="whitespace-pre-line overflow-hidden break-words">
            {{ scope.contactReplys }}
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useAgencyStore } from '~~/stores/agency'
import { useAgencyAdminStore } from '~~/stores/agencyAdmin'
import { useContactStore } from '~~/stores/inquiry'
import {
  useGuaranteeStatWithAgencyStore,
  useRemittanceAmountStore,
} from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */
interface Payment {
  paymentDate: Date | string
  amount: number
}

const searchDate = ref(new Date())
const DateMath = ref(
  Number(formatDate(searchDate.value, FORMAT_TYPE.YEAR_MONTH_DAY)?.slice(5, -3))
)
const route = useRoute()
const agencyStore = useAgencyStore()
const agencyAdminStore = useAgencyAdminStore()
const contactStore = useContactStore()
const remittanceAmountStore = useRemittanceAmountStore()
const guaranteeStatWithAgencyStore = useGuaranteeStatWithAgencyStore()
const agencyId = Number(route.params.agencyId as string)
searchDate.value.setDate(1)
const firstDate = searchDate.value.toISOString().slice(0, 10)
await agencyStore.getAgency(agencyId)
await agencyAdminStore.getAgencyAdminByAgencyId(agencyId)
await contactStore.getContactsById(agencyId)
await guaranteeStatWithAgencyStore.getGuaranteeStatWithAgency(agencyId)
await remittanceAmountStore.getRemittanceAmount(firstDate, agencyId)
const payments = await useBaseFetch<Payment[]>(`/payments/${agencyId}`, {
  method: 'GET',
})

// const remittanceAmount = ref<IRemittanceAmount>()
const fetchData = async () => {
  const dateQuery = formatDate(searchDate.value, FORMAT_TYPE.YEAR_MONTH_DAY)
  DateMath.value = Number(dateQuery?.slice(5, -3))
  if (dateQuery)
    await remittanceAmountStore.getRemittanceAmount(
      dateQuery as string,
      agencyId
    )
}
const accountNumber = ref<number>()
const showInputChangeAccountNumber = ref(false)
const validationError = ref('')

async function handleSubmitUpdateBankNo() {
  if (!accountNumber.value) {
    validationError.value = 'を入力してください'
  } else {
    validationError.value = ''
    const { error } = await agencyStore.updateBankNoAgency(agencyId, {
      bankNo: accountNumber.value,
    })
    if (error?.statusCode && +error.statusCode !== 200) return
    useNotificationSuccess({ title: '更新しました。', message: ' ' })
    showInputChangeAccountNumber.value = false
    await agencyStore.getAgency(agencyId)
  }
}

const handlerCalculate = (data: number, total: number) => {
  if (data && total) return ((data / total) * 100).toFixed(1)
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
