<template>
  <section class="space-y-4 text-white mt-2.5 mx-3">
    <h2>Checkout</h2>

    <div
      class="rounded border border-slate-700 p-3 bg-slate-800/60 flex flex-col md:flex-row gap-6"
    >
      <div class="flex-1">
        <div class="font-semibold mb-2 border-slate-700 border-b">Cart</div>

        <div v-if="cartEmpty" class="text-slate-200">Your cart is empty.</div>

        <div v-else class="space-y-3">
          <div v-if="cart.items.weapons.length" class="border-b border-slate-700 py-2">
            <div class="font-semibold">Weapons</div>
            <ul class="list-disc list-inside">
              <li v-for="id in cart.items.weapons" :key="id">
                {{ cat.weaponById(id)?.name }} — {{ cat.weaponById(id)?.price }}g
                <button class="btn-remove btn-md ml-2" @click="cart.remove('weapon', id)">
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <div v-if="cart.items.armors.length" class="border-b border-slate-700 py-2">
            <div class="font-semibold">Armors</div>
            <ul class="list-disc list-inside">
              <li v-for="id in cart.items.armors" :key="id">
                {{ cat.armorById(id)?.name }} — {{ cat.armorById(id)?.price }}g
                <button class="btn-remove btn-md ml-2" @click="cart.remove('armor', id)">
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <div v-if="cart.items.potions.length">
            <div class="font-semibold">Potions</div>
            <ul class="list-disc list-inside space-y-4">
              <li v-for="p in cart.items.potions" :key="p.id" class="flex items-center gap-2">
                <span>
                  {{ cat.potionById(p.id)?.name }}
                  × {{ p.qty }} — {{ potionTotal(p) }}g
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  class="w-16 text-center bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-sm"
                  :value="potionQtyInCart(p.id)"
                  @change="onPotionQtyInput(p.id, $event.target.value)"
                />

                <div class="inline-flex items-center gap-1 ml-2">
                  <button
                    class="btn-md btn-plus-minus disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!canDecPotion(p.id)"
                    @click="decPotion(p.id)"
                  >
                    -
                  </button>

                  <button
                    class="btn-md btn-plus-minus disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!canIncPotion(p.id)"
                    @click="incPotion(p.id)"
                  >
                    +
                  </button>

                  <button
                    class="btn-remove btn-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!canClearPotion(p.id)"
                    @click="clearPotion(p.id)"
                  >
                    Remove All
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div class="pt-2 border-t border-slate-700 mt-2 flex items-center justify-between">
            <ShopSummary />

            <div class="flex gap-4 ml-2">
              <button class="btn-remove btn-md" @click="cart.clear()" :disabled="cartEmpty">
                Clear
              </button>
              <button
                class="btn-add btn-md disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="cartEmpty || player.gold < cart.totalPrice"
                @click="buy"
              >
                Buy
              </button>
            </div>
          </div>

          <div v-if="player.gold < cart.totalPrice" class="text-amber-300 text-sm mt-1">
            Not enough gold.
          </div>
        </div>
      </div>

      <div class="md:w-1/3 flex items-center justify-center" v-if="!cartEmpty">
        <img
          :src="merchantImg"
          alt="Merchant"
          class="max-h-72 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.7)]"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { usePlayerStore } from '@/stores/player'
import { usePotionDiscountStore } from '@/stores/potionDiscount'
import { useQuestStore } from '@/stores/quest'
import ShopSummary from '@/components/shop/ShopSummary.vue'
import merchantImg from '@/assets/Images/Shop/merchant.png'

const cart = useCartStore()
const cat = useCatalogStore()
const player = usePlayerStore()
const discount = usePotionDiscountStore()
const quest = useQuestStore()

const cartEmpty = computed(
  () => cart.weapons.size === 0 && cart.armors.size === 0 && cart.items.potions.length === 0
)

const remainingGold = computed(() => player.gold - cart.totalPrice)

function effectivePotionPrice(pot) {
  if (!pot) return 0
  if (discount.active && discount.discountPercent) {
    const raw = pot.price * discount.multiplier
    return Math.max(1, Math.round(raw))
  }
  return pot.price
}

function potionTotal(p) {
  const pot = cat.potionById(p.id)
  const price = effectivePotionPrice(pot)
  return price * p.qty
}

function potionQtyInCart(id) {
  return cart.potionQty(id)
}

function canDecPotion(id) {
  return potionQtyInCart(id) > 0
}

function canIncPotion(id) {
  const pot = cat.potionById(id)
  if (!pot) return false
  const price = effectivePotionPrice(pot)
  return remainingGold.value >= price
}

function canClearPotion(id) {
  return potionQtyInCart(id) > 0
}

function decPotion(id) {
  if (canDecPotion(id)) cart.removePotion(id, 1)
}

function incPotion(id) {
  if (canIncPotion(id)) cart.addPotion(id, 1)
}

function clearPotion(id) {
  if (canClearPotion(id)) cart.clearPotion(id)
}

function onPotionQtyInput(id, raw) {
  const pot = cat.potionById(id)
  if (!pot) return

  let qty = parseInt(raw, 10)
  if (isNaN(qty) || qty < 0) qty = 0

  const current = cart.potionQty(id)

  if (qty === 0) {
    if (current > 0) cart.clearPotion(id)
    return
  }

  const diff = qty - current
  const price = effectivePotionPrice(pot)

  if (diff > 0) {
    const maxAffordable = Math.floor(remainingGold.value / price)
    const addCount = Math.min(diff, maxAffordable)
    if (addCount > 0) cart.addPotion(id, addCount)
  } else {
    const removeCount = Math.min(current, -diff)
    if (removeCount > 0) cart.removePotion(id, removeCount)
  }
}

function buy() {
  const total = cart.totalPrice
  if (total <= 0 || player.gold < total) return
  if (!player.spendGold(total)) return

  for (const id of cart.weapons) player.addWeapon(id)
  for (const id of cart.armors) player.addArmor(id)

  let boughtSmallPotion = false

  for (const { id, qty } of cart.items.potions) {
    player.addPotionCount(id, qty)

    if (id === 'p_small' && qty > 0) {
      boughtSmallPotion = true
    }
  }

  if (boughtSmallPotion) {
    quest.onBuySmallPotion()
  }

  cart.clear()
}
</script>
