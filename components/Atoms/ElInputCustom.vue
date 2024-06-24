<template>
  <ClientOnly>
    <el-input
      v-model="inputModel"
      type="text"
      :placeholder="props.placeholder"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: () => '',
  },
  modelValue: {
    type: String,
    default: () => '',
  },
  type: {
    type: String as PropType<'currency' | 'phone'>,
    default: () => 'text',
  },
})

const emits = defineEmits(['update:modelValue'])

const typeInput = ref<string>(props.type)
const inputValue = ref(props.modelValue)

const inputModel = computed({
  get: () => inputValue.value,
  set: (val: any) => {
    if (typeInput.value === 'phone') {
      const valueInput = val
        .replace(/\D/g, '')
        .match(/(\d{0,3})(\d{0,4})(\d{0,4})/)
      inputValue.value = !valueInput[2]
        ? valueInput[1]
        : valueInput[1] +
          '-' +
          valueInput[2] +
          (valueInput[3] ? '-' + valueInput[3] : '')
      return emits('update:modelValue', inputValue.value.replace(/\D/g, ''))
    }
    if (typeInput.value === 'currency') {
      inputValue.value = val
        .replace(/\D/g, '')
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
      return emits('update:modelValue', inputValue.value.replace(/\D/g, ''))
    }
    emits('update:modelValue', inputValue.value)
  },
})
</script>

<style lang="scss"></style>
