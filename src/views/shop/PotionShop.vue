<template>
  <section class="min-h-screen flex justify-center box-black">
    <img
      :src="potionShopBg"
      alt="Potion shop background"
      class="absolute inset-0 w-full h-full object-cover blur-xl opacity-60 pointer-events-none -z-10"
    />

    <ParallaxImage
      :src="potionShopBg"
      alt="Potion shop"
      :max-translate="25"
      :scale="1.05"
      class="relative max-w-7xl w-full overflow-hidden bg-slate-900/80"
    >
      <div class="py-8 px-3 bg-slate-950/60 hover:bg-slate-950/95 transition-colors space-y-4">
        <h2>Potion Shop</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="it in cat.potions"
            :key="it.id"
            class="rounded border border-slate-700 bg-slate-800/60 p-3 flex gap-3"
          >
            <img :src="it.img" :alt="it.name" class="w-16 h-16 object-contain shrink-0" />

            <div class="flex-1">
              <div class="font-semibold text-slate-100">{{ it.name }}</div>

              <div class="text-slate-300 text-sm">
                <template v-if="discount.active && discount.discountPercent">
                  Price:
                  <span class="font-semibold text-amber-300"> {{ discountedPrice(it) }}g </span>
                  <span class="opacity-70 text-xs ml-1"> (Original: {{ it.price }}g) </span>
                </template>
                <template v-else> Price: {{ it.price }}g </template>
              </div>

              <div class="mt-1 text-slate-200 text-sm">Heals {{ it.healPct * 100 }}% HP</div>

              <div class="mt-2 flex flex-wrap items-center gap-3 place-content-center">
                <div class="flex items-center gap-1">
                  <button class="btn-plus-minus px-2 py-1 text-lg" @click="dec(it.id)">-</button>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    class="w-16 text-center bg-slate-900 border text-white border-slate-700 rounded px-1 py-0.5 text-md"
                    v-model.number="qty[it.id]"
                  />

                  <button class="btn-plus-minus px-2 py-1 text-lg" @click="inc(it.id)">+</button>
                </div>

                <button
                  class="btn-add btn-md disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="!canAdd(it.id)"
                  @click="add(it.id)"
                >
                  Add to Cart
                </button>

                <template v-if="inCartQty(it.id) > 0">
                  <span class="text-amber-300 text-sm">In cart: {{ inCartQty(it.id) }}</span>

                  <button
                    class="btn-remove btn-md disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="!canRemove(it.id)"
                    @click="remove(it.id)"
                  >
                    Remove ({{ removeCount(it.id) }})
                  </button>

                  <button
                    class="btn-remove btn-md disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="!canRemoveAll(it.id)"
                    @click="removeAll(it.id)"
                  >
                    Remove All
                  </button>
                </template>
              </div>

              <div v-if="showNotEnoughGold(it.id)" class="text-rose-300 text-sm mt-1">
                Not enough gold
              </div>
            </div>
          </article>
        </div>

        <ShopSummary class="mt-2" />
      </div>
    </ParallaxImage>
  </section>
</template>

<script setup>
import { useCatalogStore } from '@/stores/catalog'
import ShopSummary from '@/components/shop/ShopSummary.vue'
import { usePotionShopQuantity } from '@/composables/usePotionShopQuantity'
import ParallaxImage from '@/components/common/ParallaxImage.vue'
import potionShopBg from '@/assets/Images/Shop/PotionsShop/PotionShop.png'
import { usePotionDiscountStore } from '@/stores/potionDiscount'

const cat = useCatalogStore()
const discount = usePotionDiscountStore()

const {
  qty,
  displayQty,
  inCartQty,
  inc,
  dec,
  canAdd,
  add,
  removeCount,
  canRemove,
  remove,
  canRemoveAll,
  removeAll,
  showNotEnoughGold,
} = usePotionShopQuantity()

cat.potions.forEach((p) => {
  if (qty[p.id] == null) qty[p.id] = 0
})

const discountedPrice = (it) => {
  if (!discount.active || !discount.discountPercent) return it.price
  const raw = it.price * discount.multiplier
  return Math.max(1, Math.round(raw))
}
</script>

