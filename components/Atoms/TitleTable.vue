<template>
  <div :class="`pb-2.5 mb-3 tracking-wider font-bold ${top}`">
    <div>{{ title }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: [String],
    default: '',
  },
  top: {
    type: [String],
    default: '',
  },
})
</script>
