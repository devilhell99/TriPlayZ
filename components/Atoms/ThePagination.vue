<template>
  <div>
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="props.totalItem"
      :page-size="props.pageSize"
      class="mt-4"
      @next-click="handleChangePage"
      @current-change="handleChangePage"
      @prev-click="handleChangePage"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  totalItem: {
    type: Number,
    default: 50,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['changPage'])

const handleChangePage = (value: number) => {
  emits('changPage', value)
}
</script>
