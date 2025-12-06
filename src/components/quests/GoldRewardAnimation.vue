<template>
  <transition name="fly">
    <div
      v-if="reward"
      class="fixed top-20 right-10 z-100 text-amber-300 text-3xl font-bold select-none pointer-events-none"
    >
      +{{ reward.gold }}g
    </div>
  </transition>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'
import { useGoldRewardStore } from '@/stores/goldReward'

const goldReward = useGoldRewardStore()
const reward = computed(() => goldReward.current)

let timerId = null

watch(
  reward,
  (val) => {
    if (!val) return

    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }

    timerId = setTimeout(() => {
      goldReward.clear()
      timerId = null
    }, 1200)
  },
  { immediate: false }
)

onBeforeUnmount(() => {
  if (timerId) clearTimeout(timerId)
})
</script>

<style scoped>
.fly-enter-active,
.fly-leave-active {
  transition: all 0.8s ease-out;
}

.fly-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}
.fly-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fly-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fly-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.9);
}
</style>
