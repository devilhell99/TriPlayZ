<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>問合せフォーム</div>
    </div>
    <div class="w-full">
      <el-form
        ref="formRef"
        :model="dataForm"
        :scroll-to-error="true"
        label-width="120px"
        label-position="top"
      >
        <FormCreateInquiry :data-form="dataForm" />
        <div class="flex justify-center">
          <el-form-item>
            <el-button @click="handleNavigateToListAgencyUser()"
              >キャンセル</el-button
            >

            <el-button type="primary" @click="handleSubmit(formRef)">
              送信
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { useAgencyAdminWithCompanyStore } from '~~/stores/agencyAdmin'
import { ICreateContactParams, useContactStore } from '~~/stores/inquiry'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  isRepresentative: false,
  middleware: ['system-only'],
})

/**
 * pinia
 */

const router = useRouter()
const agencyAdminWithCompanyStore = useAgencyAdminWithCompanyStore()
const agencyAdminData = await agencyAdminWithCompanyStore.getAgencyAdmin()
const contactStore = useContactStore()

const formRef = ref<FormInstance>()

const dataForm = reactive<ICreateContactParams>({
  name: agencyAdminData.adminName,
  nameFurigana: agencyAdminData.adminNameFurigana,
  companyName: agencyAdminData.agency.companyName,
  email: agencyAdminData.email,
  content: '',
})

async function handleSubmit(formRef: FormInstance | undefined) {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (!valid) return

    const { name, nameFurigana, email, content, companyName } = dataForm

    const { error } = await contactStore.createContact({
      name,
      nameFurigana,
      companyName,
      email,
      content,
    })
    if (error?.statusCode && +error.statusCode !== 200) return
    Object.assign(dataForm, {
      name: agencyAdminData.adminName,
      nameFurigana: agencyAdminData.adminNameFurigana,
      companyName: agencyAdminData.agency.companyName,
      email: agencyAdminData.email,
      content: '',
    })
    useNotificationSuccess({ title: '送信しました。', message: ' ' })
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
