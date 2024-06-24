<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>契約書</div>
    </div>

    <div class="pb-2.5 mb-[30px] mt-[60px]">
      <el-row
        v-for="(file, index) in useFileList.fileList"
        :key="index"
        class="flex flex-row mb-[40px]"
      >
        <el-input v-model="useFileList.fileList[index]" class="w-40" disabled />
        <el-button
          class="ml-6"
          type="primary"
          @click="handleDownloadFile(file, index)"
        >
          <span v-if="isLoading && downloadingIndex === index">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>
          <span v-else>ダウンロード</span>
        </el-button>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { IJwt } from '~~/composables/useBaseFetch'
import { useFileListStore } from '~~/stores/agency'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  middleware: ['system-only'],
})

const isLoading = ref(false)
const downloadingIndex = ref<number>()
const useFileList = useFileListStore()
await useFileList.getFileList()

async function handleDownloadFile(key: string, index: number) {
  isLoading.value = true
  downloadingIndex.value = index
  const config = useRuntimeConfig()
  const { tokenClientEncrypt } = handleGetAuthCookie()
  let token
  if (tokenClientEncrypt) {
    const client = handleJWTDecrypt(tokenClientEncrypt) as IJwt
    token = client.token
  }
  const response = await axios.get(`${config.public.baseURL}/get-file/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${key}`) // set the file name
  document.body.appendChild(link)
  link.click()
  isLoading.value = false
  downloadingIndex.value = undefined
}
</script>

<style scoped>
.el-input {
  width: 450px;
}
</style>
