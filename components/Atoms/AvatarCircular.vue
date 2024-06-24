<template>
  <div
    :style="{
      'background-image': `url(${url})`,
    }"
    class="bg-cover avatar_circular rounded-full w-14 h-14 border-2 border-thirst cursor-pointer flex flex-col items-center transition transform hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:scale-85"
    @click="onClickAvatar()"
  >
    <div class="text-white mt-14">Story</div>

    <div
      v-if="active"
      class="rounded-full border-2 border-white rotate w-16 h-16 absolute border-dashed top-[-6px]"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  storyId: number
  url: string
  active?: boolean
}

interface IEmits {
  (event: 'click', storyId: number): void
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { url, storyId } = defineProps<IProps>()

const emit = defineEmits<IEmits>()

// methods
function onClickAvatar() {
  emit('click', storyId)
}
</script>

<style lang="scss" scoped>
.avatar_circular {
  .rotate {
    animation: rotation 8s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
}
</style>
