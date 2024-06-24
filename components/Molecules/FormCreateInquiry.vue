<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="justify-center">
    <el-form-item label="名前" prop="name">
      <el-input v-model="dataForm.name" :disabled="true" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="ふりがな" prop="nameFurigana">
      <el-input v-model="dataForm.nameFurigana" :disabled="true" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="販売店" prop="companyName">
      <el-input v-model="dataForm.companyName" :disabled="true" />
    </el-form-item>

    <el-form-item label="メールアドレス" prop="email">
      <el-input v-model="dataForm.email" :disabled="true" />
    </el-form-item>

    <el-form-item label="問合せ内容" prop="content">
      <el-input
        v-model="dataForm.content"
        :autosize="{ minRows: 5, maxRows: 10 }"
        type="textarea"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ICreateContactParams } from '~~/stores/inquiry'

interface IProps {
  dataForm: ICreateContactParams
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataForm } = defineProps<IProps>()
</script>

<style>
.el-input.is-disabled .el-input__inner {
  -webkit-text-fill-color: #333;
  cursor: not-allowed;
}
</style>
