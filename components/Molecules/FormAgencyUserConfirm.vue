<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="氏名" prop="userName">
        <el-input v-model="dataFormConfirm.userName" :disabled="isDisabled" />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="ふりがな" prop="userNameFurigana">
        <el-input
          v-model="dataFormConfirm.userNameFurigana"
          :disabled="isDisabled"
        />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="住所1" prop="address">
        <el-input v-model="dataFormConfirm.address" :disabled="isDisabled" />
      </el-form-item>

      <el-form-item label="住所2">
        <el-input v-model="dataFormConfirm.address2" :disabled="isDisabled" />
      </el-form-item>
    </el-col>
  </div>
  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="電話番号" prop="tel">
        <el-input
          v-model="dataFormConfirm.tel"
          v-maska
          data-maska="###-###-####"
          :disabled="isDisabled"
        />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約年月日" prop="contractDate">
        <el-date-picker
          v-model="dataFormConfirm.contractDate"
          type="date"
          disabled
          size="default"
        />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約開始月" prop="contractStartDate">
        <el-date-picker
          v-model="dataFormConfirm.contractStartDate"
          type="month"
          disabled
          size="default"
        />
      </el-form-item>
    </el-col>
  </div>
  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約終了月" prop="contractEndDate">
        <el-date-picker
          v-model="dataFormConfirm.contractEndDate"
          type="month"
          disabled
          size="default"
        />
      </el-form-item>
    </el-col>
  </div>

  <div v-if="!isDisabled" class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="解約年月日">
        <el-date-picker
          v-model="dataFormConfirm.contractCancelDate"
          type="month"
          :clearable="false"
          size="default"
        />
      </el-form-item>
    </el-col>
  </div>

  <div v-if="!isDisabled" class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="保証履行年月" prop="guaranteeDate">
        <el-date-picker
          v-model="dataFormConfirm.guaranteeDate"
          type="month"
          size="default"
          disabled
        />
      </el-form-item>
    </el-col>
  </div>

  <div v-if="!isDisabled" class="flex justify-between">
    <el-col :span="5">
      <el-form-item label="保証履行額" prop="guaranteeAmount">
        <el-input v-model="dataFormConfirm.guaranteeAmount" disabled />
      </el-form-item>
    </el-col>
  </div>

  <div class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="契約更新" prop="isContractUpdate">
        <el-checkbox
          v-model="dataFormConfirm.isContractUpdate"
          :disabled="isDisabled"
        />
      </el-form-item>
    </el-col>
  </div>

  <div v-if="!isDisabled" class="flex justify-between">
    <el-col :span="11">
      <el-form-item label="変更理由" prop="reasonForChange">
        <el-input v-model="dataFormConfirm.reasonForChange" type="textarea" />
      </el-form-item>
    </el-col>
  </div>
</template>

<script lang="ts" setup>
import { IUpdateAgencyUserParams } from '~~/stores/agencyUser'

interface IProps {
  dataFormConfirm: IUpdateAgencyUserParams
  isDisabled: boolean
}

/**
 * prop
 */
// eslint-disable-next-line vue/no-setup-props-destructure
const { dataFormConfirm, isDisabled } = defineProps<IProps>()
</script>
