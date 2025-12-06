import { defineStore } from 'pinia'
import { useQuestStore } from './quest'

export const useMonsterStore = defineStore('monster', {
  state: () => ({
    currentLevel: 1,
    highestUnlockedLevel: 1,
    hp: 0,
    maxHp: 0,
    damage: 0,
    isBoss: false,
  }),

  getters: {
    canGoPrev: (s) => s.currentLevel > 1,
    canGoNext: (s) => s.currentLevel < s.highestUnlockedLevel,
  },

  actions: {
    spawn(level) {
      this.currentLevel = level
      this.isBoss = (level % 10 === 0)

      const baseHp = 40 + level * 1.2
      const bossBonus = this.isBoss ? 2 : 1

      this.maxHp = Math.round(baseHp * bossBonus)
      this.hp = this.maxHp

      const baseDmg = 2 + Math.floor(level * 1.2)
      this.damage = Math.round(baseDmg * (this.isBoss ? 1.6 : 1))
    },

    setLevel(lvl) {
      const clamped = Math.max(1, Math.min(lvl, this.highestUnlockedLevel))
      this.spawn(clamped)
      useQuestStore().onMonsterLevel(this.currentLevel)
    },

    unlockNextOnWin() {
      const next = this.currentLevel + 1
      if (next > this.highestUnlockedLevel) {
        this.highestUnlockedLevel = next
      }
    },

    takeDamage(n) {
      this.hp = Math.max(0, this.hp - n)
    },
  },
})

