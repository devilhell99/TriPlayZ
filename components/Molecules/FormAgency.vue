<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="justify-center">
    <el-form-item label="会社名" prop="companyName">
      <el-input v-model.number="dataForm.companyName" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="ふりがな" prop="companyNameFurigana">
      <el-input v-model="dataForm.companyNameFurigana" />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="郵便番号" prop="postCode">
      <el-input v-model="dataForm.postCode" v-maska data-maska="###-####" />
    </el-form-item>
  </div>

  <div class="justify-center items-center">
    <el-form-item label="都道府県" prop="prefectures">
      <el-input v-model="dataForm.prefectures" />
    </el-form-item>
  </div>

  <div class="justify-center items-center">
    <el-form-item label="電話番号" prop="tel">
      <el-input v-model="dataForm.tel" :maxlength="15" />
    </el-form-item>
  </div>

  <div class="justify-center items-center">
    <el-form-item label="ＦＡＸ番号" prop="fax">
      <el-input v-model="dataForm.fax" :maxlength="15" />
    </el-form-item>
  </div>

  <div class="justify-center items-center">
    <el-form-item label="備考" prop="note">
      <el-input v-model="dataForm.note" :rows="3" type="textarea" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { IUpdateAgencyParams } from '~~/stores/agency'

interface IProps {
  dataForm: IUpdateAgencyParams
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataForm } = defineProps<IProps>()
</script>

<style scoped></style>
