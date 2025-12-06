<template>
  <section class="min-h-screen flex justify-center box-black">
    <img
      :src="armorShopBg"
      alt="Armor shop background"
      class="absolute inset-0 w-full h-full object-cover blur-xl opacity-60 pointer-events-none -z-10"
    />

    <ParallaxImage
      :src="armorShopBg"
      alt="Armor shop"
      :max-translate="25"
      :scale="1.05"
      class="relative max-w-7xl w-full overflow-hidden bg-slate-900/80"
    >
      <div class="py-8 px-3 bg-slate-950/60 hover:bg-slate-950/95 transition-colors space-y-4">
        <h2>Armor Shop</h2>

        <ShopGrid :items="cat.armors" type="armor" :owned-ids="ownedArmors">
          <template #stats="{ item }">
            <div>Max HP: +{{ Math.round(item.hpScalePct * 100) }}%</div>
            <div>Damage Reduction: {{ Math.round(item.drPct * 100) }}%</div>
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
import armorShopBg from '@/assets/Images/Shop/Armorshop/ArmorShop.png'

const cat = useCatalogStore()
const player = usePlayerStore()

const ownedArmors = computed(() => player.inventory.armors)
</script>
