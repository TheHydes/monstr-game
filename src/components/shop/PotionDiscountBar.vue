<template>
  <div
    v-if="discount.active && discount.bannerVisible"
    class="w-full bg-amber-300 text-black text-lg flex items-center justify-center gap-4 px-4 py-1.5 shadow-md"
  >
    <div class="font-semibold">{{ discount.discountPercent }}% potion discount!</div>

    <div v-if="discount.remainingSeconds > 0" class="font-mono">Time left: {{ mm }}:{{ ss }}</div>

    <button
      type="button"
      class="font-bold! hover:text-black! bg-black p-2 rounded hover:bg-white"
      @click="discount.hideBanner"
    >
      ✕ Hide
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePotionDiscountStore } from '@/stores/potionDiscount'

const discount = usePotionDiscountStore()

onMounted(() => {
  discount.startCycleIfNeeded()
})

const mm = computed(() => {
  const m = Math.floor(discount.remainingSeconds / 60)
  return String(m).padStart(2, '0')
})

const ss = computed(() => {
  const s = discount.remainingSeconds % 60
  return String(s).padStart(2, '0')
})
</script>
