import { defineStore } from 'pinia'
import { useMonsterStore } from './monster'
import { usePlayerStore } from './player'
import { useQuestStore } from './quest'
import { useGoldRewardStore } from './goldReward'

const basicEnemies = Object.values(
  import.meta.glob('@/assets/Images/Enemies/BasicEnemies/*', {
    eager: true,
    import: 'default',
  })
)

const bossEnemies = Object.values(
  import.meta.glob('@/assets/Images/Enemies/Bosses/*', {
    eager: true,
    import: 'default',
  })
)

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

export const useHuntStore = defineStore('hunt', {
  state: () => ({
    log: [],
    running: false,
    lastResult: null, // 'win' | 'faint'

    skipBattle: false,

    currentMonsterSprite: null,
  }),

  actions: {
    pushLog(line) {
      this.log.push(line)
      if (this.log.length > 200) this.log.shift()
    },

    clearLog() {
      this.log = []
    },

    rollVisuals(isBoss) {
      this.currentMonsterSprite = pickRandom(isBoss ? bossEnemies : basicEnemies)
    },

    start() {
      const monster = useMonsterStore()

      monster.spawn(monster.currentLevel)

      this.clearLog()
      this.running = true
      this.lastResult = null

      this.pushLog(
        `Encounter: L${monster.currentLevel} ${monster.isBoss ? 'BOSS ' : ''}Monster (HP ${
          monster.maxHp
        }, DMG ${monster.damage})`
      )
    },

    handleMonsterWin(advance = true) {
      const player = usePlayerStore()
      const monster = useMonsterStore()
      const quest = useQuestStore()
      const goldFx = useGoldRewardStore()
      const reward = Math.round(1 + monster.currentLevel * (monster.isBoss ? 2 : 1.2))

      player.gainGold(reward)
      this.pushLog(`Loot: +${reward} gold`)

      goldFx.push(reward, 'battle')

      quest.onBattleWin()
      if (monster.isBoss) {
        quest.onBossDefeated()
      }

      monster.unlockNextOnWin()
      if (advance) {
        this.goNext()
      }

      this.running = false
      this.lastResult = 'win'
    },

    runAuto(advance = true) {
      const player = usePlayerStore()
      const monster = useMonsterStore()
      if (!this.running) return

      while (this.running) {
        const pDmgRoll = randInt(player.dmgMin, player.dmgMax)
        let pHit = pDmgRoll

        if (Math.random() < player.critChance) {
          pHit = Math.round(pHit * 2)
          this.pushLog(`Player CRIT! (${pHit})`)
        } else {
          this.pushLog(`Player hits for ${pHit}`)
        }

        if (player.firePct > 0) {
          const fire = Math.round(pHit * player.firePct)
          pHit += fire
          if (fire > 0) this.pushLog(`  + fire bonus ${fire}`)
        }

        monster.takeDamage(pHit)

        if (monster.hp <= 0) {
          this.pushLog('Monster defeated!')
          this.handleMonsterWin(advance)
          break
        }

        if (Math.random() < player.dodgeChance) {
          this.pushLog('Player DODGED')
        } else {
          let taken = Math.ceil(monster.damage * (1 - player.damageReduction))
          taken = Math.max(1, taken)
          player.takeDamage(taken)
          this.pushLog(`Monster hits for ${taken}`)

          if (player.currentHp <= 0) {
            this.pushLog('Player fainted…')
            player.reviveFainted()
            this.running = false
            this.lastResult = 'faint'
            break
          }
        }
      }
    },

    goPrev() {
      const monster = useMonsterStore()
      if (!monster.canGoPrev) return this.pushLog('Already at the first level.')
      monster.setLevel(monster.currentLevel - 1)
      this.rollVisuals(monster.isBoss)
      this.clearLog()
    },

    goNext() {
      const monster = useMonsterStore()
      if (!monster.canGoNext) {
        return this.pushLog('Next level is locked. Defeat the current level first.')
      }
      monster.setLevel(monster.currentLevel + 1)
      this.rollVisuals(monster.isBoss)
    },

    goCurrentMax() {
      const monster = useMonsterStore()
      monster.setLevel(monster.highestUnlockedLevel)
      this.rollVisuals(monster.isBoss)
      this.clearLog()
    }
  },
})
