<template>
  <section class="h-screen flex justify-center box-black">
    <img
      :src="weather.background"
      alt="Background"
      class="absolute z-[-1] inset-0 w-full h-full object-cover blur-xl opacity-60 pointer-events-none"
    />

    <div class="w-full text-white">
      <HuntHeader :on-start-battle="startBattle" />

      <BattleScene />

      <PotionPanel />

      <BattleLogPanel />

      <PlayerHpBarSticky />

      <BattleModal v-if="isBattleModalOpen" :mode="battleMode" @close="isBattleModalOpen = false" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useMonsterStore } from '@/stores/monster'
import { useHuntStore } from '@/stores/hunt'
import { useWeatherStore } from '@/stores/weather'
import { usePlayerStore } from '@/stores/player'
import { useCatalogStore } from '@/stores/catalog'

import HuntHeader from '@/components/hunt/HuntHeader.vue'
import BattleScene from '@/components/hunt/BattleScene.vue'
import PotionPanel from '@/components/hunt/PotionPanel.vue'
import BattleLogPanel from '@/components/hunt/BattleLogPanel.vue'
import PlayerHpBarSticky from '@/components/hunt/PlayerHpBarSticky.vue'
import BattleModal from '@/components/hunt/BattleModal.vue'

const monster = useMonsterStore()
const battle = useHuntStore()
const weather = useWeatherStore()
const player = usePlayerStore()
const catalog = useCatalogStore()

const isBattleModalOpen = ref(false)
const battleMode = ref('fight')

function startBattle(mode) {
  const advance = mode === 'fight'

  if (!battle.skipBattle) {
    battleMode.value = mode
    isBattleModalOpen.value = true
    return
  }

  battle.start()
  battle.runAuto(advance)
}

function handlePotionHotkey(e) {
  const tag = (e.target && e.target.tagName) || ''
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
  if (e.target?.isContentEditable) return

  if (isBattleModalOpen.value) return

  if (!['1', '2', '3'].includes(e.key)) return

  const index = Number(e.key) - 1
  const pot = catalog.potions[index]
  if (!pot) return

  if (!player.canUsePotion(pot.id)) return

  player.usePotion(pot.id)
}

onMounted(() => {
  if (!monster.maxHp) {
    monster.spawn(monster.currentLevel)
  }

  if (!battle.currentMonsterSprite) {
    battle.rollVisuals(monster.isBoss)
  }

  window.addEventListener('keydown', handlePotionHotkey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handlePotionHotkey)
})
</script>
