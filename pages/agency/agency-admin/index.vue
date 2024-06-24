<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>管理者一覧</div>
      <div></div>
      <el-button type="success" size="small" @click="handleOpenCreateForm"
        >+ 管理者の新規登録</el-button
      >
    </div>

    <el-table :data="agencyAdminStore.agencyAdmins" style="width: 100%">
      <el-table-column prop="adminName" label="氏名" width="220" />
      <el-table-column prop="adminNameFurigana" label="ふりがな" width="220" />
      <el-table-column prop="email" label="メールアドレス" width="220" />
      <el-table-column prop="isRepresentative" label="上級管理者" width="220">
        <template #default="scope">
          <span>
            {{ scope.row.isRepresentative ? '上級管理者' : '' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180">
        <template #default="scope">
          <el-button
            v-if="scope.row.id !== agencyAdminData.id"
            class="cursor-pointer"
            type="danger"
            width="36"
            height="24"
            :icon="ElIconDelete"
            @click="handleRemoveAgencyAdmin(scope.row.id)"
          >
            削除</el-button
          >
        </template>
      </el-table-column>

      <el-table-column align="center" width="220">
        <template #default="scope">
          <el-button
            class="cursor-pointer"
            type="primary"
            width="36"
            height="24"
            :icon="ElIconEdit"
            @click="handleOpenUpdateAgencyAdmin(scope.row.id)"
          >
            変更</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Modal
      v-model="dialogAgencyAdminVisible"
      :title="isTextCreate ? '管理者の新規登録' : '管理者の変更'"
      :on-submit-label="isTextCreate ? '新規登録' : '保存'"
      :on-cancel-label="'キャンセル'"
      @submit="handleSubmit(formRef)"
      @cancel="handleCancel(formRef)"
    >
      <template #body>
        <el-form
          ref="formRef"
          :model="dataForm"
          :rules="rules"
          :scroll-to-error="true"
          label-width="120px"
          label-position="top"
        >
          <FormAgencyAdmin
            :data-form="dataForm"
            :is-update="isUpdate"
            @update-state-is-update="updateStateIsUpdate"
          />
        </el-form>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import {
  IAgencyAdmin,
  ICreateAgencyAdminParams,
  useAgencyAdminStore,
  useAgencyAdminWithCompanyStore,
} from '~~/stores/agencyAdmin'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  middleware: ['system-only'],
})

/**
 * pinia
 */
const agencyAdminStore = useAgencyAdminStore()
const agencyAdminWithCompanyStore = useAgencyAdminWithCompanyStore()
const agencyAdminData = await agencyAdminWithCompanyStore.getAgencyAdmin()

await agencyAdminStore.getAgencyAdmin()
const authStore = useAuthStore()
if (!authStore.isRepresentative) navigateTo({ path: '/403' })
/**
 * data
 */
const dialogAgencyAdminVisible = ref(false)
const formRef = ref<FormInstance>()

const dataForm = reactive<ICreateAgencyAdminParams>({
  adminName: '',
  adminNameFurigana: '',
  email: '',
  password: '',
  isRepresentative: false,
})

const isUpdate = ref(false)

const rules = reactive<FormRules>({
  ...useValidateString('adminName', '氏名', { required: true, max: 100 }),
  ...useValidateString('adminNameFurigana', 'ふりがな', {
    required: true,
    max: 100,
  }),
  ...useValidateString('email', 'メールアドレス', {
    regex: /^[\w-/.]+@([\w-]+\.)+[\w-]{2,4}$/,
    required: true,
    max: 100,
  }),
  ...useValidateString('password', 'パスワード', {
    min: 8,
    max: 100,
    required: true,
  }),
})

const updateStateIsUpdate = (newData: boolean) => {
  isUpdate.value = newData
}
const isTextCreate = ref(true)

const agencyAdmin = ref<IAgencyAdmin | null>()

/**
 * methods
 */

async function handleSubmit(formRef: FormInstance | undefined) {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (!valid) return
    const agencyAdminId = agencyAdmin.value?.id

    const { adminName, adminNameFurigana, email, password, isRepresentative } =
      dataForm

    if (agencyAdminId) {
      const { error } = await agencyAdminStore.updateAgencyAdmin(
        agencyAdminId,
        {
          adminName,
          adminNameFurigana,
          email,
          password,
          isRepresentative,
        }
      )

      if (error?.statusCode && +error.statusCode !== 200) return
      Object.assign(dataForm, {
        id: undefined,
        adminName: '',
        adminNameFurigana: '',
        email: '',
        password: '',
        isRepresentative: false,
      })

      agencyAdmin.value = null

      useNotificationSuccess()
    } else {
      const { error } = await agencyAdminStore.createAgencyAdmin({
        adminName,
        adminNameFurigana,
        email,
        password,
        isRepresentative,
      })

      if (error?.statusCode && +error.statusCode !== 200) return
      Object.assign(dataForm, {
        id: undefined,
        adminName: '',
        adminNameFurigana: '',
        email: '',
        password: '',
        isRepresentative: false,
      })
      agencyAdmin.value = null

      useNotificationSuccess()
    }

    dialogAgencyAdminVisible.value = false
    isTextCreate.value = true
    await agencyAdminStore.getAgencyAdmin()
  })
}

function handleOpenCreateForm() {
  dialogAgencyAdminVisible.value = true
  isUpdate.value = false
}

function handleCancel(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
  Object.assign(dataForm, {
    id: undefined,
    adminName: '',
    adminNameFurigana: '',
    email: '',
    password: '',
    isRepresentative: false,
  })
  isTextCreate.value = true
  agencyAdmin.value = null
}

function handleOpenUpdateAgencyAdmin(id: number) {
  dialogAgencyAdminVisible.value = true
  isUpdate.value = true
  isTextCreate.value = false

  agencyAdmin.value = agencyAdminStore.agencyAdmins.find((v) => +v.id === +id)

  if (!agencyAdmin.value) return

  dataForm.adminName = agencyAdmin.value.adminName || ''
  dataForm.adminNameFurigana = agencyAdmin.value.adminNameFurigana || ''
  dataForm.email = agencyAdmin.value.email || ''
  dataForm.isRepresentative = agencyAdmin.value.isRepresentative || false
}

function handleRemoveAgencyAdmin(id: number) {
  ElMessageBox.confirm('削除してもよろしいでしょうか?', {
    confirmButtonText: '削除',
    cancelButtonText: 'キャンセル',
    type: 'warning',
  }).then(async () => {
    await agencyAdminStore.deleteAgencyAdmin(id)

    useNotificationSuccess()

    await agencyAdminStore.getAgencyAdmin()
  })
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
