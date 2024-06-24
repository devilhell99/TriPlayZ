<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="justify-center w-[300px]">
    <el-form-item label="請求額" prop="billingAmount">
      <el-input
        v-model.number="dataForm.billingAmount"
        :disabled="showConfirmCreateGuarantee"
      />
      <p class="absolute inset-y-1 right-3"><strong>円</strong></p>
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="滞納状況" prop="delinquencyStatus">
      <el-input
        v-model="dataForm.delinquencyStatus"
        type="textarea"
        :rows="4"
        :disabled="showConfirmCreateGuarantee"
      />
    </el-form-item>
  </div>
  <div class="justify-center items-center">
    <el-form-item label="督促状況" prop="dunningStatus">
      <el-input
        v-model="dataForm.dunningStatus"
        type="textarea"
        :rows="4"
        :disabled="showConfirmCreateGuarantee"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ICreateGuaranteeParams } from '~~/stores/guarantee'

interface IProps {
  dataForm: ICreateGuaranteeParams
  showConfirmCreateGuarantee: boolean
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataForm, showConfirmCreateGuarantee } = defineProps<IProps>()
</script>

<style scoped></style>
