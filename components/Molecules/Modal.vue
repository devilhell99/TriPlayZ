<template>
  <client-only>
    <el-dialog
      v-model="dialogVisible"
      :title="prop.title"
      :width="prop.width || '60%'"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="onCancel"
    >
      <slot name="body"></slot>
      <template #footer>
        <div :class="`flex ${isButton ? ' justify-between' : ' justify-end'}`">
          <div v-if="isButton">
            <el-button type="danger" @click="$emit('delete')"> 削除 </el-button>
          </div>
          <span class="dialog-footer">
            <el-button @click="onCancel">
              {{ prop.onCancelLabel || 'キャンセル' }}
            </el-button>

            <el-button type="primary" @click="onSubmit">
              {{ prop.onSubmitLabel || '保存' }}
            </el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </client-only>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface IProps {
  modelValue: boolean
  title: string
  width?: string
  onSubmitLabel?: string
  onCancelLabel?: string
  isButton?: boolean
}

interface IEmits {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'submit'): void
  (event: 'cancel'): void
  (event: 'delete'): void
}

const prop = defineProps<IProps>()

const emit = defineEmits<IEmits>()

/**
 * data
 */
const dialogVisible = ref(false)

/**
 * watch
 */
watch(dialogVisible, (newDialogVisible, _oldDialogVisible) => {
  emit('update:modelValue', newDialogVisible)
})

watch(
  () => prop.modelValue,
  () => {
    dialogVisible.value = prop.modelValue
  },
  { immediate: true }
)

/**
 * methods
 */
function onSubmit() {
  emit('submit')
}

function onCancel() {
  dialogVisible.value = false
  emit('cancel')
}
</script>
<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
