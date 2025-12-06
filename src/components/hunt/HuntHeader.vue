<template>
  <div class="p-3 bg-soft-black/90">
    <div class="flex flex-col items-center gap-5">
      <h1>
        Lvl: {{ monster.currentLevel }}
        <span v-if="monster.isBoss" class="text-amber-400">(Boss)</span>
      </h1>
      <div class="flex gap-8">
        <h2>Monster HP: {{ monster.hp }}</h2>
        <h2>Player HP: {{ player.currentHp }} / {{ player.maxHp }}</h2>
      </div>
    </div>

    <div class="mt-2 flex flex-wrap gap-2 items-center">
      <button class="btn-primary" v-show="monster.currentLevel > 1" @click="battle.goPrev()">
        Previous Level
      </button>

      <button class="btn-primary" @click="onStartBattle('fight')">Fight</button>

      <button
        class="btn-primary"
        v-show="monster.currentLevel < monster.highestUnlockedLevel"
        @click="battle.goNext()"
      >
        Next Level
      </button>

      <button
        class="btn-primary"
        v-show="monster.currentLevel < monster.highestUnlockedLevel"
        @click="onStartBattle('repeat')"
      >
        Repeat This Level
      </button>
      <button
        class="btn-primary"
        v-show="monster.currentLevel < monster.highestUnlockedLevel"
        @click="battle.goCurrentMax()"
      >
        Max Level
      </button>
      <label
        class="ml-auto inline-flex items-center gap-2 p-2.5 rounded font-bold cursor-pointer transition-colors"
        :class="skipBattle ? 'bg-emerald-800 text-white' : 'bg-emerald-200 text-black shadow-lg'"
      >
        <input type="checkbox" v-model="skipBattle" class="cursor-pointer" />
        <span>Skip Battle</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useMonsterStore } from '@/stores/monster'
import { useHuntStore } from '@/stores/hunt'

const props = defineProps({
  onStartBattle: {
    type: Function,
    required: true,
  },
})

const player = usePlayerStore()
const monster = useMonsterStore()
const battle = useHuntStore()

const skipBattle = computed({
  get: () => battle.skipBattle,
  set: (v) => {
    battle.skipBattle = v
  },
})
</script>
