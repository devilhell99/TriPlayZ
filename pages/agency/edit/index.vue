<template>
  <div class="w-full">
    <div
      class="nav flex justify-between pb-2.5 border-b-2 border-warning mb-[30px]"
    >
      <div>販売店情報の変更</div>
    </div>
    <div class="w-full mt-20">
      <el-form
        ref="formRef"
        :model="dataForm"
        :rules="rules"
        :scroll-to-error="true"
        label-width="120px"
        label-position="top"
      >
        <FormAgency v-model:data-form="dataForm" />
        <div class="flex justify-center">
          <el-form-item>
            <el-button @click="handleNavigateToListAgencyUser()">
              キャンセル
            </el-button>

            <el-button type="primary" @click="handleUpdateAgency(formRef)">
              保存
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { IUpdateAgencyParams, useAgencyStore } from '~~/stores/agency'
import { useAgencyAdminWithCompanyStore } from '~~/stores/agencyAdmin'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  layout: 'system-auth',
  roles: [ERole.AGENCY_ADMIN],
  isRepresentative: true,
  middleware: ['system-only'],
})

/**
 * pinia
 */

const router = useRouter()
const agencyStore = useAgencyStore()
const agencyAdminWithCompanyStore = useAgencyAdminWithCompanyStore()
const agencyAdminData = await agencyAdminWithCompanyStore.getAgencyAdmin()

const authStore = useAuthStore()

if (!authStore.isRepresentative) navigateTo({ path: '/403' })

const formRef = ref<FormInstance>()

const validateFax = (_rule: any, _value: any, _callback: any) => {
  const pattern = /^[a-zA-Z0-9\-+(),]*$/
  const is = pattern.test(_value)
  if (is) {
    _callback()
  } else {
    _callback(new Error('英数字、-+()を含めて9~15文字で入力してください'))
  }
}

const rules = reactive<FormRules>({
  ...useValidateString('companyName', '会社名', {
    required: true,
    max: 100,
  }),
  ...useValidateString('companyNameFurigana', 'ふりがな', {
    required: true,
    max: 100,
  }),
  ...useValidateString('postCode', '郵便番号', {
    required: true,
    min: 8,
    max: 10,
  }),
  ...useValidateString('tel', '電話番号', {
    required: true,
    min: 9,
    max: 15,
  }),
  ...useValidateString('fax', 'ＦＡＸ番号', {
    validator: validateFax,
    min: 9,
    max: 15,
  }),
})

const dataForm = ref<IUpdateAgencyParams>({
  companyName: '',
  companyNameFurigana: '',
  postCode: '',
  tel: '',
  prefectures: '',
  fax: '',
  note: '',
})

await agencyStore.getAgency(agencyAdminData.agency.id)
dataForm.value = agencyStore.agency

/**
 * data
 */

async function handleUpdateAgency(formRef: FormInstance | undefined) {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (!valid) return
    const {
      companyName,
      companyNameFurigana,
      tel,
      prefectures,
      fax,
      postCode,
      note,
    } = dataForm.value

    const { error } = await agencyStore.updateAgency(
      agencyAdminData.agency.id,
      {
        companyName,
        companyNameFurigana,
        tel,
        prefectures,
        fax,
        postCode,
        note,
      }
    )

    if (error?.statusCode && +error.statusCode !== 200) return
    Object.assign(dataForm.value, {
      companyName: agencyStore.agency.companyName,
      companyNameFurigana: agencyStore.agency.companyNameFurigana,
      postCode: agencyStore.agency.postCode,
      tel: agencyStore.agency.tel,
      prefectures: agencyStore.agency.prefectures,
      fax: agencyStore.agency.fax,
      note: agencyStore.agency.note,
    })
    useNotificationSuccess()
    await agencyStore.getAgency(agencyAdminData.agency.id)
    dataForm.value = agencyStore.agency
  })
}

const handleNavigateToListAgencyUser = () => {
  router.push('/agency/agency-admin')
}
</script>

<style scoped>
.el-upload-list {
  display: none;
}
</style>
