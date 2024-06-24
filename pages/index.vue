<template>
  <div>index landing page test cicd</div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['page-top'],
})

navigateTo({ path: '/login' })
</script>

<style scoped></style>
