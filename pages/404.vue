<template>
  <div
    class="page-error-cover h-full w-full flex justify-center items-center absolute top-0 left-0"
  >
    <div class="container text-center">
      <h1
        class="heading error-heading 2xl:text-[14rem] leading-[1.2] sm:text-[12rem]"
      >
        404
      </h1>
      <p class="text-red-500 text-lg font-bold tracking-[1rem]">
        見つかりません
      </p>
      <p class="text mt-2 text-sm tracking-widest">ページが見つかりません</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.error-heading {
  -webkit-text-stroke: 6px red;
  @apply font-mono font-bold text-transparent #{!important};
}

.page-error-cover {
  background: linear-gradient(
    -135deg,
    var(--color-primary) 10%,
    #81a5937d 50%,
    var(--color-success) 80%
  );
}
</style>
