<template>
  <section class="max-w-7xl mx-auto py-8 px-4 text-white space-y-6">
    <header class="space-y-1">
      <h1 class="text-3xl">Quests & Goals</h1>
      <p class="text-sm">Complete quests for gold, or track your own goals.</p>
    </header>

    <div class="inline-flex rounded-lg bg-amber-500 p-1">
      <button
        class="btn-lg rounded-r-none rounded-l-md transition"
        :class="
          activeTab === 'quests'
            ? 'bg-amber-900 text-slate-900 font-semibold '
            : 'text-white hover:bg-slate-700/70 bg-slate-800 btn-quest'
        "
        @click="activeTab = 'quests'"
      >
        Quests
      </button>
      <button
        class="btn-lg rounded-l-none rounded-r-md transition"
        :class="
          activeTab === 'goals'
            ? 'bg-amber-900 text-slate-900 font-semibold'
            : 'text-white hover:bg-slate-700/70 bg-slate-800 btn-quest'
        "
        @click="activeTab = 'goals'"
      >
        My Goals
      </button>
    </div>

    <TabSwitchTransition>
      <div v-if="activeTab === 'quests'" key="quests" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Quests</h2>
          <span class="text-sm text-slate-300">
            Completed: {{ completedCount }} / {{ quests.length }}
          </span>
        </div>

        <div class="space-y-3">
          <article
            v-for="q in sortedQuests"
            :key="q.id"
            class="rounded-lg border p-3 flex items-center justify-between gap-3 bg-slate-900/80"
            :class="[
              q.claimed
                ? 'border-emerald-500/70 bg-emerald-900/20'
                : q.completed
                ? 'border-amber-400/70'
                : 'border-slate-700',
            ]"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold">
                  {{ q.title }}
                </span>

                <span
                  v-if="q.completed && !q.claimed"
                  class="text-xs px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-900 font-semibold"
                >
                  Completed
                </span>

                <span
                  v-if="q.claimed"
                  class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-900 font-semibold"
                >
                  Claimed
                </span>
              </div>

              <div class="text-sm text-slate-300">
                Reward:
                <span class="text-amber-300 font-semibold">{{ q.reward }}g</span>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div class="text-xs text-slate-300">
                {{ renderProgress(q) }}
              </div>

              <button
                v-if="q.completed && !q.claimed"
                class="btn-claim tracking-wider btn-md"
                @click="claim(q)"
              >
                Claim
              </button>
            </div>
          </article>
        </div>
      </div>

      <div v-else key="goals" class="space-y-4">
        <h2 class="text-xl font-semibold">My Goals</h2>

        <div class="rounded-lg bg-slate-900/80 border border-slate-700 p-4 space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="text-xs uppercase tracking-wide text-slate-400">Title</label>
              <input
                v-model="newGoalTitle"
                class="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                placeholder="Defeat 10 bosses..."
              />
            </div>

            <div class="flex flex-col gap-1 md:col-span-1">
              <label class="text-xs uppercase tracking-wide text-slate-400">
                Description (optional)
              </label>
              <input
                v-model="newGoalDesc"
                class="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                placeholder="Details, notes, constraints…"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              class="btn-md btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!newGoalTitleTrimmed"
              @click="onAddGoal"
            >
              Add Goal
            </button>
          </div>
        </div>

        <div v-if="quest.myGoals.length" class="space-y-3">
          <GoalItem
            v-for="g in quest.myGoals"
            :key="g.id"
            :goal="g"
            @toggle="quest.toggleGoal(g.id)"
            @remove="quest.removeGoal(g.id)"
            @update="(title, desc) => quest.updateGoal(g.id, title, desc)"
          />
        </div>

        <p v-else class="text-slate-400 text-sm">
          You don’t have any goals yet. Add one above to get started.
        </p>
      </div>
    </TabSwitchTransition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuestStore } from '@/stores/quest'
import { usePlayerStore } from '@/stores/player'
import { useMonsterStore } from '@/stores/monster'
import GoalItem from '@/components/quests/GoalItem.vue'
import TabSwitchTransition from '@/components/quests/TabSwitchTransition.vue'

const quest = useQuestStore()
const player = usePlayerStore()
const monster = useMonsterStore()

const activeTab = ref('quests')

const quests = computed(() => quest.quests)

const sortedQuests = computed(() => {
  const withIndex = quests.value.map((q, index) => ({ q, index }))

  return withIndex
    .slice()
    .sort((a, b) => {
      const scoreA = a.q.claimed ? 1 : 0
      const scoreB = b.q.claimed ? 1 : 0

      if (scoreA !== scoreB) return scoreA - scoreB

      return a.index - b.index
    })
    .map((x) => x.q)
})

const completedCount = computed(() => quests.value.filter((q) => q.completed).length)
const newGoalTitle = ref('')
const newGoalDesc = ref('')
const newGoalTitleTrimmed = computed(() => newGoalTitle.value.trim().length > 0)

function onAddGoal() {
  if (!newGoalTitleTrimmed.value) return
  quest.addGoal(newGoalTitle.value.trim(), newGoalDesc.value.trim())
  newGoalTitle.value = ''
  newGoalDesc.value = ''
}

function claim(q) {
  quest.claimReward(q.id)
}

function progressFor(q) {
  const pLevel = player.playerLevel
  const mLevel = monster.highestUnlockedLevel

  switch (q.id) {
    case 'win_1':
    case 'buy_small':
    case 'boss_1':
    case 'equip_wep':
    case 'equip_arm':
      return { current: q.completed ? 1 : 0, target: 1 }

    case 'plvl_5':
      return { current: Math.min(pLevel, 5), target: 5 }
    case 'plvl_25':
      return { current: Math.min(pLevel, 25), target: 25 }
    case 'plvl_50':
      return { current: Math.min(pLevel, 50), target: 50 }
    case 'plvl_100':
      return { current: Math.min(pLevel, 100), target: 100 }
    case 'plvl_300':
      return { current: Math.min(pLevel, 300), target: 300 }

    case 'mlvl_5':
      return { current: Math.min(mLevel, 5), target: 5 }
    case 'mlvl_20':
      return { current: Math.min(mLevel, 20), target: 20 }
    case 'mlvl_30':
      return { current: Math.min(mLevel, 30), target: 30 }
    case 'mlvl_50':
      return { current: Math.min(mLevel, 50), target: 50 }
    case 'mlvl_100':
      return { current: Math.min(mLevel, 100), target: 100 }

    case 'upg_dmg_5':
      return {
        current: Math.min(quest.damageUpgrades, 5),
        target: 5,
      }

    default:
      return {
        current: q.completed ? 1 : 0,
        target: 1,
      }
  }
}

function renderProgress(q) {
  const { current, target } = progressFor(q)
  return `${current} / ${target}`
}
</script>

