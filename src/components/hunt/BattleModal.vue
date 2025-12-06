<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/90" @click.self="onClose">
    <div class="w-full max-w-7xl rounded-xl bg-soft-black/90 p-4 shadow-xl relative">
      <header class="flex items-center justify-between mb-3 gap-3">
        <h2>Battle</h2>
        <h1>Lvl {{ monster.currentLevel }} {{ monster.isBoss ? '(Boss)' : '' }}</h1>

        <div class="flex items-center gap-2">
          <button
            v-if="!finished"
            class="rounded-md bg-rose-700 hover:bg-rose-600 btn-md p-2.5!"
            @click="onSkip"
          >
            Skip
          </button>

          <button v-else @click="onClose" class="btn-secondary">Close</button>
        </div>
      </header>

      <div class="relative h-[50vh] rounded-lg overflow-hidden bg-slate-800 shadow-2xl">
        <img
          v-if="backgroundSrc"
          :src="backgroundSrc"
          alt="Battle background"
          class="absolute inset-0 w-full h-full object-cover scale-110"
        />

        <div class="absolute inset-0 flex items-end justify-center pb-6">
          <img
            v-if="monsterSrc"
            :src="monsterSrc"
            alt="Monster"
            class="drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-transform duration-300 monster-or-attack-sizing object-contain"
            :class="enemyClass"
          />
        </div>

        <img
          v-if="phase === 'player-attack'"
          :key="playerAttackKey"
          :src="playerAttackGif"
          class="absolute self-end justify-self-center inset-0 monster-or-attack-sizing object-cover pointer-events-none mb-8"
        />

        <img
          v-if="phase === 'monster-attack'"
          :key="monsterAttackKey"
          :src="monsterAttackGif"
          class="absolute self-center justify-self-center inset-0 min-w-40 min-h-40 w-[25vw] h-[25vh] max-w-96 max-h-96 object-cover pointer-events-none"
        />

        <div
          v-if="phase === 'dodged'"
          class="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-amber-300 drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
        >
          Dodged!
        </div>

        <div
          v-if="finished"
          class="absolute inset-0 flex items-center justify-center text-3xl font-extrabold drop-shadow-[0_0_12px_rgba(0,0,0,0.9)] rounded bg-slate-800/95 h-16 w-fit p-3 mx-auto my-auto"
          :class="outcome === 'win' ? 'text-emerald-300' : 'text-rose-300'"
        >
          {{ outcome === 'win' ? 'Victory!' : 'You fainted…' }}
        </div>
      </div>

      <div class="mt-3">
        <div class="text-lg text-white mb-1">Monster HP</div>
        <div class="w-full bg-slate-700 rounded">
          <div
            class="h-8 rounded flex items-center justify-center text-[13px] font-semibold transition-all duration-300"
            :class="monsterHpBarClass"
            :style="{ width: monsterHpPercent + '%' }"
          >
            {{ monster.hp }} / {{ monster.maxHp }}
          </div>
        </div>
      </div>

      <div class="mt-2">
        <div class="text-lg text-white mb-1">Player HP</div>
        <div class="w-full bg-slate-700 rounded">
          <div
            class="h-8 rounded flex items-center justify-center text-[13px] font-semibold transition-all duration-300"
            :class="playerHpBarClass"
            :style="{ width: playerHpPercent + '%' }"
          >
            {{ player.currentHp }} / {{ player.maxHp }}
          </div>
        </div>
      </div>

      <div class="mt-3 text-sm text-white h-6 flex items-center">
        <span v-if="lastEvent">{{ lastEvent }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useMonsterStore } from '@/stores/monster'
import { useHuntStore } from '@/stores/hunt'
import { useWeatherStore } from '@/stores/weather'
import { useHpBar } from '@/composables/useHpBar'

import playerAttackGif from '@/assets/Images/Attack/PovAttack2Cropped2loop.gif'
import monsterAttackGif from '@/assets/Images/Attack/MonsterAttackCroppedloop.gif'

const props = defineProps({
  mode: {
    type: String,
    default: 'fight', // 'fight' | 'repeat'
  },
})

const emit = defineEmits(['close'])

const player = usePlayerStore()
const monster = useMonsterStore()
const battle = useHuntStore()
const weather = useWeatherStore()

const phase = ref('idle') // 'idle' | 'player-attack' | 'monster-attack' | 'dodged' | 'done'
const playerAttackKey = ref(0)
const monsterAttackKey = ref(0)
const lastEvent = ref('')
const finished = ref(false)
const outcome = ref(null) // 'win' | 'faint'

const fastForward = ref(false)
const pendingAutoClose = ref(false)
const animationId = ref(0)

const enemyState = ref('idle') // 'idle' | 'attack' | 'dodge'

const { percent: monsterHpPercent, barClass: monsterHpBarClass } = useHpBar(
  computed(() => monster.hp),
  computed(() => monster.maxHp),
  'monster'
)

const { percent: playerHpPercent, barClass: playerHpBarClass } = useHpBar(
  computed(() => player.currentHp),
  computed(() => player.maxHp),
  'player'
)

const enemyClass = computed(() => {
  if (enemyState.value === 'attack') return 'scale-110'
  if (enemyState.value === 'dodge') return 'scale-90'
  return 'scale-100'
})

const backgroundSrc = computed(() => weather.background)
const monsterSrc = computed(() => battle.currentMonsterSprite)

const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

const wait = (ms) =>
  fastForward.value ? Promise.resolve() : new Promise((res) => setTimeout(res, ms))

function showPlayerAttack() {
  const id = ++animationId.value
  phase.value = 'idle'
  nextTick(() => {
    if (animationId.value !== id || fastForward.value) return
    playerAttackKey.value++
    phase.value = 'player-attack'
  })
}

function showMonsterAttack() {
  const id = ++animationId.value
  phase.value = 'idle'
  nextTick(() => {
    if (animationId.value !== id || fastForward.value) return
    monsterAttackKey.value++
    phase.value = 'monster-attack'
  })
}

async function startAnimatedBattle() {
  battle.start()

  const advanceOnWin = props.mode === 'fight'

  while (!finished.value) {
    if (!fastForward.value) {
      showPlayerAttack()
      enemyState.value = 'idle'
    }

    let dmgRoll = randInt(player.dmgMin, player.dmgMax)
    let hit = dmgRoll

    if (Math.random() < player.critChance) {
      hit = Math.round(hit * 2)
      battle.pushLog(`Player CRIT! (${hit})`)
      lastEvent.value = `Player CRIT for ${hit}`
    } else {
      battle.pushLog(`Player hits for ${hit}`)
      lastEvent.value = `Player hits for ${hit}`
    }

    if (player.firePct > 0) {
      const fire = Math.round(hit * player.firePct)
      hit += fire
      if (fire > 0) {
        battle.pushLog(`  + fire bonus ${fire}`)
        lastEvent.value += ` (+${fire} fire)`
      }
    }

    monster.takeDamage(hit)
    await wait(600)
    if (!fastForward.value) {
      phase.value = 'idle'
    }

    if (monster.hp <= 0) {
      battle.pushLog('Monster defeated!')

      battle.handleMonsterWin(advanceOnWin)

      outcome.value = 'win'
      finished.value = true
      battle.running = false
      battle.lastResult = 'win'
      phase.value = 'done'
      enemyState.value = 'idle'

      if (pendingAutoClose.value) {
        emit('close')
      }
      break
    }

    if (Math.random() < player.dodgeChance) {
      if (!fastForward.value) {
        phase.value = 'dodged'
        enemyState.value = 'dodge'
      }
      battle.pushLog('Player DODGED')
      lastEvent.value = 'Player dodged the attack'
      await wait(700)
      if (!fastForward.value) {
        enemyState.value = 'idle'
        phase.value = 'idle'
      }
    } else {
      if (!fastForward.value) {
        showMonsterAttack()
        enemyState.value = 'attack'
      }
      let taken = Math.ceil(monster.damage * (1 - player.damageReduction))
      taken = Math.max(1, taken)
      player.takeDamage(taken)
      battle.pushLog(`Monster hits for ${taken}`)
      lastEvent.value = `Monster hits for ${taken}`
      await wait(600)
      if (!fastForward.value) {
        enemyState.value = 'idle'
        phase.value = 'idle'
      }

      if (player.currentHp <= 0) {
        battle.pushLog('Player fainted…')
        player.reviveFainted()

        outcome.value = 'faint'
        finished.value = true
        battle.running = false
        battle.lastResult = 'faint'
        phase.value = 'done'

        if (pendingAutoClose.value) {
          emit('close')
        }
        break
      }
    }
  }
}

function onSkip() {
  if (finished.value) return
  fastForward.value = true
  animationId.value++
  phase.value = 'idle'
  enemyState.value = 'idle'
}

function onClose() {
  if (!finished.value) {
    fastForward.value = true
    animationId.value++
    phase.value = 'idle'
    enemyState.value = 'idle'
    pendingAutoClose.value = true
    return
  }
  emit('close')
}

onMounted(() => {
  startAnimatedBattle()
})
</script>
