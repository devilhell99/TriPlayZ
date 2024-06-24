<template>
  <div class="flex flex-col min-h-screen">
    <HeaderSystemUnAuth />
    <div class="h-full flex-1 relative">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
