import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useGoldRewardStore } from './goldReward'

export const useQuestStore = defineStore('quest', {
  state: () => ({
    myGoals: [],

    quests: [
      { id: 'win_1',      title: 'Win your first battle', reward: 5, completed: false, claimed: false },
      { id: 'plvl_5',     title: 'Reach player level 5',  reward: 10, completed: false, claimed: false },
      { id: 'buy_small',  title: 'Buy your first Small Health Potion', reward: 10, completed: false, claimed: false },
      { id: 'mlvl_5',     title: 'Reach monster level 5', reward: 5, completed: false, claimed: false },
      { id: 'boss_1',     title: 'Defeat your first boss', reward: 5, completed: false, claimed: false },
      { id: 'equip_wep',  title: 'Equip a weapon', reward: 10, completed: false, claimed: false },
      { id: 'equip_arm',  title: 'Equip an armor', reward: 20, completed: false, claimed: false },
      { id: 'upg_dmg_5',  title: 'Upgrade your damage 5 times', reward: 10, completed: false, claimed: false },

      { id: 'plvl_25',    title: 'Reach player level 25', reward: 30, completed: false, claimed: false },
      { id: 'mlvl_20',    title: 'Reach monster level 20', reward: 20, completed: false, claimed: false },
      { id: 'mlvl_30',    title: 'Reach monster level 30', reward: 30, completed: false, claimed: false },
      { id: 'mlvl_50',    title: 'Reach monster level 50', reward: 100, completed: false, claimed: false },
      { id: 'mlvl_100',   title: 'Reach monster level 100', reward: 9999, completed: false, claimed: false },

      { id: 'plvl_50',    title: 'Reach player level 50', reward: 2500, completed: false, claimed: false },
      { id: 'plvl_100',   title: 'Reach player level 100', reward: 9999, completed: false, claimed: false },
      { id: 'plvl_300',   title: 'Reach player level 300', reward: 30000, completed: false, claimed: false },
    ],

    damageUpgrades: 0,
  }),

  actions: {
    addGoal(title, desc = '') {
      this.myGoals.push({
        id: crypto.randomUUID(),
        title,
        desc,
        done: false,
      })
    },

    toggleGoal(id) {
      const g = this.myGoals.find(x => x.id === id)
      if (g) g.done = !g.done
    },

    updateGoal(id, title, desc) {
      const g = this.myGoals.find(x => x.id === id)
      if (g) {
        g.title = title
        g.desc = desc
      }
    },

    removeGoal(id) {
      this.myGoals = this.myGoals.filter(g => g.id !== id)
    },

    complete(id) {
      const q = this.quests.find(q => q.id === id)
      if (q && !q.completed) q.completed = true
    },

    claimReward(id) {
      const q = this.quests.find(q => q.id === id)
      if (!q || !q.completed || q.claimed) return false

      q.claimed = true

      const player = usePlayerStore()
      player.gainGold(q.reward)

      const goldReward = useGoldRewardStore()
      goldReward.push(q.reward, `quest_${id}`)

      return true
    },

    onBattleWin() {
      this.complete('win_1')
    },

    onPlayerLevel(level) {
      if (level >= 5) this.complete('plvl_5')
      if (level >= 25) this.complete('plvl_25')
      if (level >= 50) this.complete('plvl_50')
      if (level >= 100) this.complete('plvl_100')
      if (level >= 300) this.complete('plvl_300')
    },

    onMonsterLevel(level) {
      if (level >= 5) this.complete('mlvl_5')
      if (level >= 20) this.complete('mlvl_20')
      if (level >= 30) this.complete('mlvl_30')
      if (level >= 50) this.complete('mlvl_50')
      if (level >= 100) this.complete('mlvl_100')
    },

    onEquipWeapon() {
      this.complete('equip_wep')
    },

    onEquipArmor() {
      this.complete('equip_arm')
    },

    onBuySmallPotion() {
      this.complete('buy_small')
    },

    onBossDefeated() {
      this.complete('boss_1')
    },

    onDamageUpgrade() {
      this.damageUpgrades++
      if (this.damageUpgrades >= 5) {
        this.complete('upg_dmg_5')
      }
    },
  },
})
