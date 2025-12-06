<template>
  <div
    class="fixed bottom-0 left-0 right-0 px-3 pb-4 pointer-events-none w-full max-w-7xl justify-self-center flex flex-col gap-3"
  >
    <div class="w-full bg-slate-700/80 rounded-3xl h-8 relative overflow-hidden">
      <div
        class="h-full rounded-3xl transition-all duration-300"
        :class="playerHpBarClass"
        :style="{ width: playerHpPercent + '%' }"
      ></div>

      <div
        class="absolute inset-0 flex items-center justify-center text-base font-semibold text-white"
      >
        Your HP: {{ player.currentHp }} / {{ player.maxHp }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useHpBar } from '@/composables/useHpBar'

const player = usePlayerStore()

const { percent: playerHpPercent, barClass: playerHpBarClass } = useHpBar(
  computed(() => player.currentHp),
  computed(() => player.maxHp),
  'player'
)
</script>
