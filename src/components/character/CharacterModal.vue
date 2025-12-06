<template>
  <div
    class="fixed inset-0 z-15 grid place-items-center bg-black/90 px-3"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-3xl rounded-xl bg-dark-blue p-4 flex flex-col gap-3 text-white">
      <header class="flex items-center justify-between mb-4">
        <h2>Character</h2>
        <button @click="$emit('close')" class="btn-blue-reverse btn-lg tracking-wider">
          Close
        </button>
      </header>

      <div class="flex items-center gap-4">
        <img :src="portraitSrc" alt="Player portrait" class="w-34 h-34 rounded-lg bg-blue p-2" />
        <div class="text-sm">
          <CharacterStatRow label="Level" :value="player.playerLevel" />
          <CharacterStatRow label="Gold" :value="player.gold" suffix="g" />
          <CharacterStatRow label="HP" :value="`${player.currentHp} / ${player.maxHp}`" />
          <CharacterStatRow
            label="Damage Reduction"
            :value="`${(player.damageReduction * 100).toFixed(0)}%`"
          />
          <CharacterStatRow label="Damage" :value="damageDisplay" />
          <CharacterStatRow
            label="Crit Chance"
            :value="`${(player.critChance * 100).toFixed(0)}%`"
          />
          <CharacterStatRow
            label="Dodge Chance"
            :value="`${(player.dodgeChance * 100).toFixed(0)}%`"
          />
        </div>
      </div>

      <section class="rounded-lg bg-blue p-3 flex flex-col gap-2">
        <h3>Upgrades</h3>
        <ul class="flex flex-col gap-2">
          <UpgradeRow
            :icon="iconHealth"
            label="Health"
            :value="String(player.maxHp)"
            :cost="player.hpUpgradeCost"
            :disabled="player.gold < player.hpUpgradeCost"
            @buy="buyHp"
          />

          <UpgradeRow
            :icon="iconDamage"
            label="Damage"
            :value="player.dmgMin + '-' + player.dmgMax"
            :cost="player.damageUpgradeCost"
            :disabled="player.gold < player.damageUpgradeCost"
            @buy="buyDamage"
          />

          <UpgradeRow
            :icon="iconCrit"
            label="Crit Chance"
            :value="(player.critChance * 100).toFixed(0) + '%'"
            :cost="player.critUpgradeCost"
            :disabled="!canBuyCrit"
            :is-max="maxCritReached"
            @buy="buyCrit"
          />

          <UpgradeRow
            :icon="iconDodge"
            label="Dodge Chance"
            :value="(player.dodgeChance * 100).toFixed(0) + '%'"
            :cost="player.dodgeUpgradeCost"
            :disabled="!canBuyDodge"
            :is-max="maxDodgeReached"
            @buy="buyDodge"
          />
        </ul>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <EquipmentList
          title="Weapons"
          item-type="weapon"
          :items="weaponItems"
          :selected-id="player.weaponId"
          @equip="equipWeapon"
        />
        <EquipmentList
          title="Armors"
          item-type="armor"
          :items="armorItems"
          :selected-id="player.armorId"
          @equip="equipArmor"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useCatalogStore } from '@/stores/catalog'
import UpgradeRow from '@/components/character/UpgradeRow.vue'
import CharacterStatRow from '@/components/character/CharacterStatRow.vue'
import EquipmentList from '@/components/character/EquipmentList.vue'

import lvl1 from '@/assets/Images/Character/lvl1_char.png'
import lvl10 from '@/assets/Images/Character/lvl10_char.png'
import lvl25 from '@/assets/Images/Character/lvl25_char.png'
import lvl50 from '@/assets/Images/Character/lvl50_char.png'
import lvl75 from '@/assets/Images/Character/lvl75_char.png'
import lvl100 from '@/assets/Images/Character/lvl100_char.png'
import lvl200 from '@/assets/Images/Character/lvl200_char.png'
import lvl300 from '@/assets/Images/Character/lvl300_char.png'

import iconHealth from '@/assets/Images/Character/health.png'
import iconDamage from '@/assets/Images/Character/damage.png'
import iconCrit from '@/assets/Images/Character/crit.png'
import iconDodge from '@/assets/Images/Character/dodge.png'

export default {
  name: 'CharacterModal',
  components: {
    UpgradeRow,
    CharacterStatRow,
    EquipmentList,
  },
  emits: ['close'],
  setup() {
    const player = usePlayerStore()
    const cat = useCatalogStore()

    const portraitMap = {
      'stage-1': lvl1,
      'stage-2': lvl10,
      'stage-3': lvl25,
      'stage-4': lvl50,
      'stage-5': lvl75,
      'stage-6': lvl100,
      'stage-7': lvl200,
      'stage-8': lvl300,
    }

    const portraitSrc = computed(() => {
      const key = player.portraitKey
      return portraitMap[key] ?? lvl1
    })

    const damageDisplay = computed(() => {
      const base = `${player.dmgMin}-${player.dmgMax}`

      if (player.firePct > 0) {
        const pct = Math.round(player.firePct * 100)
        return `${base} (+${pct}% fire)`
      }

      return base
    })
    const weaponItems = computed(() =>
      player.inventory.weapons.map((id) => cat.weaponById(id)).filter((w) => !!w)
    )

    const armorItems = computed(() =>
      player.inventory.armors.map((id) => cat.armorById(id)).filter((a) => !!a)
    )

    const maxCritReached = computed(() => player.baseCrit >= player.critCap)
    const maxDodgeReached = computed(() => player.dodgeChance >= player.dodgeCap)

    const canBuyCrit = computed(
      () => !maxCritReached.value && player.gold >= player.critUpgradeCost
    )
    const canBuyDodge = computed(
      () => !maxDodgeReached.value && player.gold >= player.dodgeUpgradeCost
    )

    function buyHp() {
      const cost = player.hpUpgradeCost
      if (player.gold < cost) return
      if (player.spendGold(cost)) player.incBaseHp()
    }

    function buyDamage() {
      const cost = player.damageUpgradeCost
      if (player.gold < cost) return
      if (player.spendGold(cost)) player.incDamage()
    }

    function buyCrit() {
      if (!canBuyCrit.value) return
      const cost = player.critUpgradeCost
      if (player.spendGold(cost)) player.incCrit()
    }

    function buyDodge() {
      if (!canBuyDodge.value) return
      const cost = player.dodgeUpgradeCost
      if (player.spendGold(cost)) player.incDodge()
    }

    function equipWeapon(id) {
      player.equipWeapon(id)
    }

    function equipArmor(id) {
      player.equipArmor(id)
    }

    return {
      player,
      cat,
      iconHealth,
      iconDamage,
      iconCrit,
      iconDodge,
      portraitSrc,
      weaponItems,
      armorItems,
      maxCritReached,
      maxDodgeReached,
      canBuyCrit,
      canBuyDodge,
      damageDisplay,
      buyHp,
      buyDamage,
      buyCrit,
      buyDodge,
      equipWeapon,
      equipArmor,
    }
  },
}
</script>
