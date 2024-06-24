<template>
  <el-config-provider :locale="ja">
    <el-date-picker
      v-model="modelValues"
      type="month"
      format="YYYY/MM"
      value-format="YYYY-MM"
      :disabled-date="disabledDate"
      @change="$emit('change')"
    ></el-date-picker>
  </el-config-provider>
</template>

<script setup>
import ja from 'element-plus/dist/locale/ja.mjs'

const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
})
const emit = defineEmits(['update:modelVal', 'change'])

const modelValues = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
</script>
