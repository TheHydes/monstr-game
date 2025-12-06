<template>
  <section class="min-h-screen flex justify-center box-black">
    <img
      :src="weaponShopBg"
      alt="Weapon shop background"
      class="absolute inset-0 w-full h-full object-cover blur-xl opacity-60 pointer-events-none -z-10"
    />

    <ParallaxImage
      :src="weaponShopBg"
      alt="Weapon shop"
      :max-translate="25"
      :scale="1.05"
      class="relative max-w-7xl w-full overflow-hidden bg-slate-900/80"
    >
      <div class="py-8 px-3 bg-slate-950/60 hover:bg-slate-950/95 transition-colors space-y-4">
        <h2>Weapon Shop</h2>

        <ShopGrid :items="cat.weapons" type="weapon" :owned-ids="ownedWeapons">
          <template #stats="{ item }">
            <div>Damage: +{{ Math.round(item.dmgPct * 100) }}%</div>
            <div>Crit: +{{ Math.round(item.critPct * 100) }}%</div>
            <div v-if="item.firePct > 0">Fire: +{{ Math.round(item.firePct * 100) }}%</div>
          </template>
        </ShopGrid>

        <ShopSummary class="mt-2" />
      </div>
    </ParallaxImage>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { usePlayerStore } from '@/stores/player'
import ShopGrid from '@/components/shop/ShopGrid.vue'
import ShopSummary from '@/components/shop/ShopSummary.vue'
import ParallaxImage from '@/components/common/ParallaxImage.vue'
import weaponShopBg from '@/assets/Images/Shop/WeaponShop/WeaponShop.png'

const cat = useCatalogStore()
const player = usePlayerStore()

const ownedWeapons = computed(() => player.inventory.weapons)
</script>
