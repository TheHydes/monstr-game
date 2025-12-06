<template>
  <div class="relative h-[50vh] overflow-hidden bg-slate-800 box-black">
    <ParallaxImage
      v-if="battleBackground"
      :src="battleBackground"
      :max-translate="20"
      :scale="1.06"
      class="absolute inset-0 w-full h-full"
    />

    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 flex items-end justify-center pb-6">
        <img
          v-if="battleMonsterSprite"
          :src="battleMonsterSprite"
          alt="Monster"
          class="monster-or-attack-sizing object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] animate-slow-pulse-scale"
        />
      </div>

      <div class="absolute left-0 right-0 bottom-3 px-4">
        <div class="w-full bg-slate-700 rounded">
          <div
            class="h-4 rounded flex items-center justify-center text-[10px] font-semibold transition-all duration-300"
            :class="monsterHpBarClass"
            :style="{ width: monsterHpPercent + '%' }"
          >
            {{ monster.hp }} / {{ monster.maxHp }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ParallaxImage from '@/components/common/ParallaxImage.vue'
import { useMonsterStore } from '@/stores/monster'
import { useHuntStore } from '@/stores/hunt'
import { useWeatherStore } from '@/stores/weather'
import { useHpBar } from '@/composables/useHpBar'

const monster = useMonsterStore()
const battle = useHuntStore()
const weather = useWeatherStore()

const { percent: monsterHpPercent, barClass: monsterHpBarClass } = useHpBar(
  computed(() => monster.hp),
  computed(() => monster.maxHp),
  'monster'
)

const battleBackground = computed(() => weather.background)
const battleMonsterSprite = computed(() => battle.currentMonsterSprite)
</script>
