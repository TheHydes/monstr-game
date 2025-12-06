import { defineStore } from 'pinia'
import { useCatalogStore } from './catalog'
import { usePotionDiscountStore } from './potionDiscount'

export const useCartStore = defineStore('cart', {
  state: () => ({
    weapons: new Set(),
    armors:  new Set(),
    potions: {},
  }),

  getters: {
    inCart: (s) => (type, id) =>
      type === 'weapon' ? s.weapons.has(id)
    : type === 'armor'  ? s.armors.has(id)
    : false,

    potionQty: (s) => (id) => s.potions[id] ?? 0,

    items(state) {
      return {
        weapons: Array.from(state.weapons),
        armors:  Array.from(state.armors),
        potions: Object.entries(state.potions).map(([id, qty]) => ({ id, qty })),
      }
    },

    totalPrice() {
      const cat = useCatalogStore()
      const discount = usePotionDiscountStore()

      const wSum = Array.from(this.weapons).reduce(
        (sum, id) => sum + (cat.weaponById(id)?.price ?? 0),
        0
      )

      const aSum = Array.from(this.armors).reduce(
        (sum, id) => sum + (cat.armorById(id)?.price ?? 0),
        0
      )

      const pSum = Object.entries(this.potions).reduce((sum, [id, qty]) => {
        const pot = cat.potionById(id)
        const base = pot?.price ?? 0

        let price = base
        if (discount.active && discount.discountPercent) {
          const raw = base * discount.multiplier
          price = Math.max(1, Math.round(raw))
        }

        return sum + price * qty
      }, 0)

      return wSum + aSum + pSum
    },
  },

  actions: {
    add(type, id)      {
      if (type === 'weapon') this.weapons.add(id)
      else if (type === 'armor') this.armors.add(id)
    },
    remove(type, id)   {
      if (type === 'weapon') this.weapons.delete(id)
      else if (type === 'armor') this.armors.delete(id)
    },

    addPotion(id, qty = 1) {
      this.potions[id] = (this.potions[id] ?? 0) + Math.max(1, qty)
    },

    removePotion(id, qty = 1) {
      if (!this.potions[id]) return
      const n = Math.max(1, Math.floor(qty))
      const newQty = this.potions[id] - n
      if (newQty > 0) this.potions[id] = newQty
      else delete this.potions[id]
    },

    clearPotion(id) {
      delete this.potions[id]
    },

    clear() {
      this.weapons.clear()
      this.armors.clear()
      this.potions = {}
    },
  },
})
