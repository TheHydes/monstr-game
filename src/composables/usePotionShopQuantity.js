import { reactive, computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCartStore } from '@/stores/cart'
import { usePlayerStore } from '@/stores/player'
import { usePotionDiscountStore } from '@/stores/potionDiscount'

export function usePotionShopQuantity() {
  const cat = useCatalogStore()
  const cart = useCartStore()
  const player = usePlayerStore()
  const discount = usePotionDiscountStore()

  const qty = reactive({})

  const remainingGold = computed(() => player.gold - cart.totalPrice)

  function displayQty(id) {
    return qty[id] ?? 0
  }

  function inCartQty(id) {
    return cart.potionQty(id)
  }

  function inc(id) {
    qty[id] = (qty[id] ?? 0) + 1
  }

  function dec(id) {
    qty[id] = Math.max(0, (qty[id] ?? 0) - 1)
  }

  function effectivePotionPrice(pot) {
    if (!pot) return 0
    if (discount.active && discount.discountPercent) {
      const raw = pot.price * discount.multiplier
      return Math.max(1, Math.round(raw))
    }
    return pot.price
  }

  function hasEnoughGold(cost) {
    return remainingGold.value >= cost
  }

  function canAdd(id) {
    const n = displayQty(id)
    const pot = cat.potionById(id)
    if (!pot) return false
    if (n <= 0) return false

    const unitPrice = effectivePotionPrice(pot)
    return hasEnoughGold(unitPrice * n)
  }

  function add(id) {
    if (!canAdd(id)) return false
    const n = displayQty(id)
    cart.addPotion(id, n)
    qty[id] = 0
    return true
  }

  function removeCount(id) {
    const desired = displayQty(id)
    const have = inCartQty(id)
    return Math.max(0, Math.min(desired, have))
  }

  function canRemove(id) {
    return removeCount(id) > 0
  }

  function remove(id) {
    const n = removeCount(id)
    if (n <= 0) return
    cart.removePotion(id, n)
    qty[id] = 0
  }

  function canRemoveAll(id) {
    return inCartQty(id) > 0
  }

  function removeAll(id) {
    if (!canRemoveAll(id)) return
    cart.clearPotion(id)
    qty[id] = 0
  }

  function showNotEnoughGold(id) {
    const n = displayQty(id)
    if (n <= 0) return false
    const pot = cat.potionById(id)
    if (!pot) return false

    const unitPrice = effectivePotionPrice(pot)
    return !hasEnoughGold(unitPrice * n)
  }

  return {
    qty,
    remainingGold,
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
  }
}
