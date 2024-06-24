<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>入金インポート</div>
    </div>

    <div class="w-full mb-10">
      <div class="flex justify-between mt-[30px]">
        <div></div>
        <el-pagination
          v-if="csvData.length > 0"
          v-model="currentPage"
          :page-size="itemsPerPage"
          :total="csvData.length"
          layout="total,prev, pager, next"
          @current-change="handleChangePageIndex"
        ></el-pagination>
        <div></div>
      </div>
      <el-upload
        v-if="csvData.length === 0"
        ref="file"
        class="upload-demo"
        drag
        :data="formDataUpload"
        :before-upload="handleUploadBefore"
        :limit="1"
        :show-file-list="false"
      >
        <el-button type="primary">Select file</el-button>
        <div class="el-upload__text mt-3">
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
      <div></div>
    </div>

    <el-table
      v-if="csvData.length > 0"
      :data="paginatedItems"
      style="width: 100%"
    >
      <el-table-column label="入金日">
        <template #default="scope">
          <span v-if="scope.row.agencyId !== 0" class="text-[#000000]">
            {{ scope.row.paymentDate }}
          </span>
          <span v-else class="text-[#FF0000]">
            {{ scope.row.paymentDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="口座番号">
        <template #default="scope">
          <span v-if="scope.row.agencyId !== 0" class="text-[#000000]">
            {{ scope.row.bankNo.slice(-7) }}
          </span>
          <span v-else class="text-[#FF0000]">
            {{ scope.row.bankNo.slice(-7) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="金額">
        <template #default="scope">
          <span v-if="scope.row.agencyId !== 0" class="text-[#000000]">
            {{ scope.row.amount }}
          </span>
          <span v-else class="text-[#FF0000]">
            {{ scope.row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="エラー">
        <template #default="scope">
          <span v-if="scope.row.agencyId === 0" class="text-[#FF0000]">
            {{ '代理店の口座番号と一致しません' }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="csvData.length > 0" class="flex justify-center mt-[30px]">
      <div></div>
      <el-button type="primary" @click="handleSubmit"
        >インポートの実行</el-button
      >
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language'
import { IPaymentDataCheck, useAgencyStore } from '~~/stores/agency'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.SYSTEM_ADMIN],
  middleware: ['system-only'],
})
interface ICreatePaymentResponse {
  data: any
}

/**
 * pinia
 */
const agencyStore = useAgencyStore()

async function handleSubmit() {
  const { error } = await useBaseFetch<ICreatePaymentResponse>('/payments', {
    body: csvData.value.filter((items) => items.agencyId),
    method: 'POST',
  })

  if (error?.statusCode && +error.statusCode !== 200) return
  csvData.value = []
  useNotificationSuccess()
}

const fileUpload = ref<string | Blob>()

const formDataUpload = ref(new FormData())
const csvData = ref<any[]>([])

const itemsPerPage = 10 // Number of items to display per page
const currentPage = ref(1) // Current page number

// Compute the items for the current page based on the currentPage and itemsPerPage
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return csvData.value.slice(startIndex, endIndex)
})

function handleChangePageIndex(page: number) {
  currentPage.value = page
}

const parseCSVData = (csvData: string) => {
  const rows = csvData.split('\n').slice(0) // Skip header row if present
  const data = rows.map((row: string) => row.split(','))
  return data
}

const readFile = (file: string | Blob, encoding: string) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsText(new Blob([file]), encoding)
  })
}

// const handleUploadError = () => {
//   ElMessage.error('Upload failed')
// }

const handleUploadBefore = async (file: string | Blob) => {
  fileUpload.value = file
  const fileInfo = await DetectFileEncodingAndLanguage(fileUpload.value)
  let encoding = 'Shift-JIS'

  if (fileInfo.encoding && fileInfo.encoding.includes('UTF')) {
    encoding = fileInfo.encoding
  }

  const fileContent = (await readFile(fileUpload.value, encoding)) as string
  const csvDataTest = parseCSVData(fileContent)

  const newValue: IPaymentDataCheck[] = csvDataTest.map(
    (item): IPaymentDataCheck => {
      return {
        paymentDate:
          item[3] && item[3].slice(2).length !== 0
            ? dayjs(item[3], 'YYMMDD')
                .year(new Date().getFullYear())
                .format('YYYY/MM/DD')
            : '',
        bankNo:
          item[13] && item[13].length > 7
            ? item[13].substring(item[13].length - 7)
            : item[13],
        amount: Number(item[6]),
      }
    }
  )

  const valueCheck = await agencyStore.checkBankNo(
    newValue.filter((item) => item.amount || item.bankNo || item.paymentDate)
  )
  csvData.value = valueCheck.data
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
