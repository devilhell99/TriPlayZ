<template>
  <div class="flex flex-col min-h-screen">
    <HeaderSystemAuth />
    <div class="h-full flex-1 flex flex-row">
      <SidebarSystem />

      <div
        class="2xl:w-[82%] sm:w-[82%] 2xl:px-[120px] 2xl:py-[70px] sm:px-6 sm:py-8"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
