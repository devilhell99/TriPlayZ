<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>CSVインポート</div>
    </div>

    <div class="w-full mb-10">
      <div class="flex justify-between mt-[30px]">
        <div></div>
        <div></div>
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

        <div class="mt-3 text-[#606266] text-sm text-start">
          CSVファイル登録に必要な項目は、「氏名,ふりがな,住所1,住所2電話番号,契約年月日」です。
          <br />
          この順序で1ユーザー1行で作成し、アップロードしてください。
          <br />
          住所1には番地までを入力し、住所2はアパート名と部屋番号を入力します。アパート名などがないときはスペース（空白）にして下さい。
          <br />
          年月日は「2023/08/04」という形式、あるいは「20230804」、「'20230804」という形式で入力します。
          <br />
          最後に確認画面で確認のうえ、一括登録ボタンをクリックしてください。
        </div>
      </el-upload>
      <div></div>
    </div>

    <el-table
      v-if="csvData.length > 0"
      :data="paginatedItems"
      style="width: 100%"
    >
      <el-table-column prop="userName" label="氏名" width="150" />
      <el-table-column prop="userNameFurigana" label="ふりがな" width="150" />
      <el-table-column prop="address" label="住所1" width="150" />
      <el-table-column prop="address2" label="住所2" width="150" />
      <el-table-column prop="tel" label="電話番号" width="150" />
      <el-table-column prop="contractDate" label="契約年月日" width="150">
        <template #default="scope">
          <span>
            {{ contractDateStart(scope.row.contractDate) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="contractStartDate" label="契約開始月" width="150">
        <template #default="scope">
          <span>
            {{ contractDateMonthStart(scope.row.contractStartDate) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="contractEndDate" label="契約終了月" width="150">
        <template #default="scope">
          <span>
            {{ contractDateYearEnd(scope.row.contractStartDate, 10) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="contractUpdateDate" label="更新年月日" width="150">
        <template #default="scope">
          <span>
            {{ contractDateYearEnd(scope.row.contractUpdateDate, 20) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="csvData.length > 0" class="flex justify-center mt-[30px]">
      <div></div>
      <el-button @click="handleCancel">キャンセル</el-button>
      <el-button
        type="primary"
        :disabled="isCheckSendAll"
        @click="handleSubmit"
      >
        一括登録
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language'
import { useAgencyUserStore } from '~~/stores/agencyUser'

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

const router = useRouter()

async function handleSubmit() {
  const { error } = await agencyUserStore.createAgencyUsers(csvData.value)

  if (error?.statusCode && +error.statusCode !== 200) return
  csvData.value = []
  useNotificationSuccess()
  handleNavigateToListAgencyUser()
}

const isCheckSendAll = computed(() => {
  return csvData.value.some((i) => !i.contractDate)
})

function handleCancel() {
  csvData.value = []
}

const fileUpload = ref<string | Blob>()

const formDataUpload = ref(new FormData())
const csvData = ref<any[]>([])
const csvHeaders = ref<any[]>([])

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

const readFile = (file: string | Blob, encoding: string) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsText(new Blob([file]), encoding)
  })
}
const parseCSVData = (csvData: string) => {
  const rows = csvData.split('\n').slice(0) // Skip header row if present
  const data = rows.map((row: string) => row.split(','))
  return data
}
const handleUploadBefore = async (file: string | Blob) => {
  fileUpload.value = file
  const fileInfo = await DetectFileEncodingAndLanguage(fileUpload.value)
  let encoding = 'Shift-JIS'

  if (fileInfo.encoding && fileInfo.encoding.includes('UTF')) {
    encoding = fileInfo.encoding
  }

  const fileContent = (await readFile(fileUpload.value, encoding)) as string
  const parsedData = parseCSVData(fileContent).slice(0, -1)
  csvHeaders.value = Object.keys(parsedData[0])
  csvData.value = parsedData

  const newValue = csvData.value.map((item) => {
    return {
      ...item,
      userName: item[0],
      userNameFurigana: item[1],
      address: item[2],
      address2: item[3],
      tel: item[4],
      contractDate: item[5],
      contractStartDate: item[5],
      contractEndDate: item[5],
      contractUpdateDate: item[6] === '1\r' ? item[5] : '',
    }
  })

  csvData.value = newValue
}

const handleNavigateToListAgencyUser = () => {
  router.push('/agency')
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
