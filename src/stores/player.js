import { defineStore } from 'pinia'
import { useCatalogStore } from './catalog'
import { useMonsterStore } from './monster'
import { useHuntStore } from './hunt'
import { useQuestStore } from './quest'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export const usePlayerStore = defineStore('player', {
  state: () => ({
    baseHp: 100,
    baseDmgMin: 8,
    baseDmgMax: 12,
    baseCrit: 0.05,
    baseDodge: 0.05,
    baseFirePct: 0.0,

    critCap: 0.55,
    dodgeCap: 0.5,

    hpUpgradeCost: 2,
    damageUpgradeCost: 3,
    critUpgradeCost: 4,
    dodgeUpgradeCost: 5,

    playerLevel: 1,
    gold: 0,

    currentHp: 100,

    weaponId: null,
    armorId: null,

    inventory: {
      weapons: [],
      armors: [],
      potions: { p_small: 2, p_medium: 0, p_large: 0 },
    },

    portraitLevelBreaks: [1, 10, 25, 50, 75, 100, 200, 300],
  }),

  getters: {
    weapon(state) {
      return state.weaponId ? useCatalogStore().weaponById(state.weaponId) : null
    },
    armor(state) {
      return state.armorId ? useCatalogStore().armorById(state.armorId) : null
    },
    ownsWeapon: (s) => (id) => s.inventory.weapons.includes(id),
    ownsArmor: (s) => (id) => s.inventory.armors.includes(id),

    maxHp(state) {
      const armor = this.armor
      const extra = armor ? Math.round(state.baseHp * armor.hpScalePct) : 0
      return state.baseHp + extra
    },
    dmgMin(state) {
      return Math.round(state.baseDmgMin * (1 + (this.weapon?.dmgPct ?? 0)))
    },
    dmgMax(state) {
      return Math.round(state.baseDmgMax * (1 + (this.weapon?.dmgPct ?? 0)))
    },

    critChance(state) {
      const base = clamp(state.baseCrit, 0, this.critCap)
      const weaponBonus = this.weapon?.critPct ?? 0
      return clamp(base + weaponBonus, 0, 1)
    },

    dodgeChance(state) {
      const base = clamp(state.baseDodge, 0, this.dodgeCap)
      return clamp(base, 0, 1)
    },

    firePct(state) {
      return clamp(state.baseFirePct + (this.weapon?.firePct ?? 0), 0, 1)
    },
    damageReduction() {
      return clamp(this.armor?.drPct ?? 0, 0, 0.95)
    },
    portraitKey(state) {
      if (state.playerLevel >= 300) return 'stage-8'
      if (state.playerLevel >= 200) return 'stage-7'
      if (state.playerLevel >= 100) return 'stage-6'
      if (state.playerLevel >= 75) return 'stage-5'
      if (state.playerLevel >= 50) return 'stage-4'
      if (state.playerLevel >= 25) return 'stage-3'
      if (state.playerLevel >= 10) return 'stage-2'
      return 'stage-1'
    },
    potionCount: (s) => (id) => s.inventory.potions[id] ?? 0,
    canUsePotion: (state) => (id) => {
      const count = state.inventory.potions[id] ?? 0
      return count > 0 && state.currentHp < state.maxHp
    },
  },

  actions: {
    incBaseHp(amount = 10) {
      this.baseHp += amount
      this.currentHp += amount
      this.playerLevel++
      useQuestStore().onPlayerLevel(this.playerLevel)
      this.hpUpgradeCost = Math.round(this.hpUpgradeCost * 1.3)
    },
    incDamage(minInc = 2, maxInc = 3) {
      this.baseDmgMin += minInc
      this.baseDmgMax += maxInc
      this.playerLevel++
      useQuestStore().onPlayerLevel(this.playerLevel)
      useQuestStore().onDamageUpgrade()
      this.damageUpgradeCost = Math.round(this.damageUpgradeCost * 1.3)
    },

    incCrit(p = 0.01) {
      this.baseCrit = clamp(this.baseCrit + p, 0, this.critCap)
      this.playerLevel++
      useQuestStore().onPlayerLevel(this.playerLevel)
      this.critUpgradeCost = Math.round(this.critUpgradeCost * 1.3)
    },

    incDodge(p = 0.01) {
      this.baseDodge = clamp(this.baseDodge + p, 0, this.dodgeCap)
      this.playerLevel++
      useQuestStore().onPlayerLevel(this.playerLevel)
      this.dodgeUpgradeCost = Math.round(this.dodgeUpgradeCost * 1.3)
    },

    healPercent(p) {
      this.currentHp = Math.min(this.currentHp + Math.round(this.maxHp * p), this.maxHp)
    },
    takeDamage(amount) {
      this.currentHp = Math.max(0, this.currentHp - amount)
    },
    setToPercent(p) {
      this.currentHp = Math.round(this.maxHp * p)
    },

    gainGold(n) {
      this.gold += n
    },
    spendGold(n) {
      if (this.gold >= n) {
        this.gold -= n
        return true
      }
      return false
    },

    equipWeapon(id) {
      this.weaponId = id
      useQuestStore().onEquipWeapon()
    },
    equipArmor(id) {
      this.armorId = id
      useQuestStore().onEquipArmor()
    },
    addWeapon(id) {
      if (!this.ownsWeapon(id)) this.inventory.weapons.push(id)
    },
    addArmor(id) {
      if (!this.ownsArmor(id)) this.inventory.armors.push(id)
    },

    addPotionCount(id, qty = 1) {
      const q = Math.max(1, Math.floor(qty))
      this.inventory.potions[id] = (this.inventory.potions[id] ?? 0) + q
    },

    reviveFainted() {
      const monster = useMonsterStore()
      monster.currentLevel = Math.max(1, monster.currentLevel - 1)

      monster.spawn(monster.currentLevel)

      const hunt = useHuntStore()
      hunt.rollVisuals(monster.isBoss)

      this.setToPercent(0.25)
    },

    usePotion(potionId) {
      const cat = useCatalogStore()
      const p = cat.potionById(potionId)
      if (!p) return false
      if (!this.canUsePotion(potionId)) return false
      this.inventory.potions[potionId] -= 1
      this.healPercent(p.healPct)
      return true
    },
  },
})
