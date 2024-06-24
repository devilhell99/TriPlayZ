<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="氏名" prop="userName" required>
        <el-input v-model="dataForm.userName" />
      </el-form-item>
    </el-col>
  </div>
  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="ふりがな" prop="userNameFurigana" required>
        <el-input v-model="dataForm.userNameFurigana" />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="住所1" prop="address" required>
        <el-input v-model="dataForm.address" />
      </el-form-item>

      <el-form-item label="住所2">
        <el-input v-model="dataForm.address2" />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="電話番号" prop="tel" required>
        <el-input v-model="dataForm.tel" v-maska data-maska="###-###-####" />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約年月日" prop="contractDate" required>
        <el-date-picker
          v-model="dataForm.contractDate"
          type="date"
          :disabled-date="disabledDate"
          size="default"
        />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約更新" prop="isContractUpdate">
        <el-checkbox v-model="dataForm.isContractUpdate" />
      </el-form-item>
    </el-col>
  </div>
</template>

<script lang="ts" setup>
import { ICreateAgencyUserParams } from '~~/stores/agencyUser'

interface IProps {
  dataForm: ICreateAgencyUserParams
}

/**
 * prop
 */
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataForm } = defineProps<IProps>()

const disabledDate = (time: Date) => {
  const today = new Date() // Get the current date
  today.setHours(0, 0, 0, 0) // Set the time to midnight

  return time.getTime() < today.getTime() // Disable dates before today
}
</script>
