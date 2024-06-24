<template>
  <div class="w-full">
    <div class="pb-2.5 mb-[30px]">
      <div class="mb-[20px]">問い合わせ</div>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>ステータス</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{
          contact.status === EContactStatus.ANSWERED ? '回答済み' : '未回答'
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>日時</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{
          formatDate(contact.dateTime, FORMAT_TYPE.YEAR_DAY_TIME_DATE)
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>お名前</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{ contact.name }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>ふりがな</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{
          contact.nameFurigana
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>販売店</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{
          contact.agencyName ? contact.agencyName : contact?.agency?.companyName
        }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[10px]">
        <el-col class="ml-[50px]" :span="6"><b>メールアドレス</b></el-col>
        <el-col class="ml-[-50px]" :span="18">{{ contact.email }}</el-col>
      </el-row>
      <el-row class="flex flex-row mb-[20px]">
        <el-col class="ml-[50px]" :span="6"><b>問い合わせ内容</b></el-col>
        <el-col class="ml-[-50px] whitespace-pre-line" :span="18">{{
          contact.content
        }}</el-col>
      </el-row>
      <div class="flex justify-between">
        <div></div>
        <el-button
          v-if="contact.status === EContactStatus.UNANSWERED"
          class="ml-[-130px]"
          type="primary"
          plain
          @click="showReplyContent = !showReplyContent"
        >
          回答
        </el-button>

        <div></div>
        <div></div>
      </div>

      <div v-if="showReplyContent" class="flex justify-between mb-[20px]">
        <div></div>
        <el-input v-model="contentReply" :rows="4" type="textarea" />

        <div></div>
        <div></div>
      </div>
      <div>
        <span v-if="validationError" class="error-message">{{
          validationError
        }}</span>
      </div>
      <div v-if="showReplyContent" class="flex justify-center">
        <el-button type="primary" plain @click="handleCancel()">
          キャンセル
        </el-button>

        <el-button
          class="ml-[-250px]"
          type="primary"
          plain
          @click="handleSubmitReplyContent()"
          >回答
        </el-button>
      </div>
    </div>

    <div class="nav flex justify-between pb-2.5 mb-[10px]">
      <div v-if="contact?.agency?.id">販売店情報</div>
    </div>
    <el-table
      v-if="agencyStore.agency && contact?.agency?.id"
      :data="[agencyStore.agency]"
      style="width: 100%"
      empty-text="データが存在しません"
    >
      <el-table-column prop="companyName" label="会社名" />

      <el-table-column prop="companyNameFurigana" label="ふりがな" />
      <el-table-column prop="address" label="住所" />
      <el-table-column prop="tel" label="電話番号" />

      <el-table-column label="契約年月日">
        <template #default="scope">
          <span
            >{{
              formatDate(
                scope.row.contractStartDate,
                FORMAT_TYPE.YEAR_DAY_SLASH
              )
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mb-[20px] mt-[30px]"></div>
    <el-table
      v-if="contact?.agency?.id"
      style="width: 100%"
      empty-text="データが存在しません"
      :data="[remittanceAmountStore.remittanceAmount]"
    >
      <el-table-column
        :label="`${searchDate}月の新規登録数`"
        prop="newUserCount"
      >
      </el-table-column>
      <el-table-column
        :label="`${searchDate}月の保証料合計`"
        prop="guaranteeAmount"
      >
      </el-table-column>
      <el-table-column
        :label="`${searchDate}月の保証履行承認額合計`"
        :width="200"
        prop="guaranteeApproveAmount"
      >
      </el-table-column>
      <el-table-column
        :label="`${searchDate + 1}月の送金額`"
        prop="remittanceAmount"
      >
      </el-table-column>

      <el-table-column label="次月繰越額" prop="nextMonthForwardAmount">
      </el-table-column>

      <el-table-column :label="`${searchDate}月不足額`" prop="shortageAmount">
      </el-table-column>

      <el-table-column
        :label="`${searchDate - 1}月繰越額`"
        prop="previousMonthForwardAmount"
      >
      </el-table-column>
    </el-table>

    <div class="nav flex justify-between pb-2.5 mb-[20px] mt-[30px]"></div>
    <el-table
      v-if="contact?.agency?.id"
      style="width: 100%"
      :data="[guaranteeStatWithAgencyStore.guaranteeStatWithAgency]"
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

    <div class="nav flex justify-between pb-2.5 mt-[30px] mb-[20px]">
      <div>過去の問合せと回答</div>
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
              scope.row.status === EContactStatus.ANSWERED ? '回答済' : '未回答'
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

<script async setup lang="ts">
import { useAgencyStore } from '~~/stores/agency'
import { useContactStore } from '~~/stores/inquiry'
import {
  useRemittanceAmountStore,
  useGuaranteeStatWithAgencyStore,
} from '~~/stores/guarantee'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */

const route = useRoute()
const contactStore = useContactStore()
const agencyStore = useAgencyStore()
const searchDate = ref(
  Number(formatDate(new Date(), FORMAT_TYPE.YEAR_MONTH_DAY)?.slice(5, -3))
)
const adminDate = ref(new Date())

const contact = await contactStore.getContactsById(
  Number(route.params.contactId as string)
)
const remittanceAmountStore = useRemittanceAmountStore()
const guaranteeStatWithAgencyStore = useGuaranteeStatWithAgencyStore()
adminDate.value.setDate(1)
const firstDate = adminDate.value.toISOString().slice(0, 10)

await contactStore.getContactsWithoutPagination()

if (contact?.agency?.id) {
  await guaranteeStatWithAgencyStore.getGuaranteeStatWithAgency(
    +contact?.agency?.id
  )
  await agencyStore.getAgency(Number(contact?.agency?.id))

  await remittanceAmountStore.getRemittanceAmount(
    firstDate,
    +contact?.agency?.id
  )
}

const showReplyContent = ref(false)
const contentReply = ref('')

const validationError = ref('')

async function handleSubmitReplyContent() {
  if (!contentReply.value) {
    validationError.value = 'を入力してください'
  } else {
    validationError.value = ''
    const { error } = await contactStore.createContactReply(
      Number(route.params.contactId as string),
      { content: contentReply.value }
    )
    if (error?.statusCode && +error.statusCode !== 200) return
    useNotificationSuccess({ title: '更新しました。', message: ' ' })
    await contactStore.getContactsWithoutPagination()
    showReplyContent.value = false
  }
}
function handleCancel() {
  validationError.value = ''
  showReplyContent.value = false
}

const handlerCalculate = (data: number, total: number) => {
  if (data && total) return ((data / total) * 100).toFixed(1)
}

onUnmounted(() => {
  contactStore.resetInquiryTableStore()
})
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
