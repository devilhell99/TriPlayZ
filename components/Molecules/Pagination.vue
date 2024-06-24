<template>
  <el-pagination
    v-model:page-size="paginationStore.take"
    background
    layout="total, sizes, prev, pager, next"
    :page-sizes="[10, 25, 50]"
    :current-page="paginationStore.page"
    :total="paginationStore.totalItems"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { usePaginationStore } from '~~/stores/pagination'

interface IEmits {
  (event: 'click', storyId: number): void
  (event: 'size-change', storyId: number): void
}
/**
 * emit
 */
const emit = defineEmits<IEmits>()

/**
 * data
 */

const paginationStore = usePaginationStore()

/**
 * methods
 */
function handleCurrentChange(val: number) {
  emit('click', val)
}

function handleSizeChange(val: number) {
  emit('size-change', val)
}
</script>

<style scoped></style>
