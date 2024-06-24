<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="justify-center">
    <el-form-item label="氏名" prop="adminName">
      <el-input v-model.number="dataForm.adminName" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="ふりがな" prop="adminNameFurigana">
      <el-input v-model="dataForm.adminNameFurigana" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="メールアドレス" prop="email">
      <el-input v-model="dataForm.email" />
    </el-form-item>
  </div>

  <div v-if="!isUpdate" class="justify-center items-center">
    <el-form-item label="パスワード" prop="password">
      <el-input v-model="dataForm.password" type="password" show-password />
    </el-form-item>
  </div>

  <div v-if="isUpdate" class="justify-center items-center">
    <el-form-item label="パスワード">
      <el-button @click="updateStateIsUpdate()">変更</el-button>
    </el-form-item>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="上級管理者" prop="isRepresentative">
        <el-checkbox v-model="dataForm.isRepresentative" />
      </el-form-item>
    </el-col>
  </div>
</template>

<script lang="ts" setup>
import { ICreateAgencyAdminParams } from '~~/stores/agencyAdmin'

interface IProps {
  dataForm: ICreateAgencyAdminParams
  isUpdate: boolean
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataForm, isUpdate } = defineProps<IProps>()
const emit = defineEmits(['update-state-is-update'])

const updateStateIsUpdate = () => {
  emit('update-state-is-update', false)
}
</script>

<style scoped></style>
