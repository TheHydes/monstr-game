<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <article
      v-for="it in items"
      :key="it.id"
      class="rounded border border-slate-700 bg-slate-800/40 p-3 flex gap-3 items-center"
      :class="{ 'opacity-50': ownedSet.has(it.id) }"
    >
      <img :src="it.img" :alt="it.name" class="w-20 h-20 object-contain shrink-0" />
      <div class="flex-1">
        <div class="font-semibold text-slate-100">{{ it.name }}</div>
        <div class="text-slate-300 text-sm">Price: {{ it.price }}g</div>

        <div class="mt-1 text-slate-200 text-sm">
          <slot name="stats" :item="it" />
        </div>

        <div class="mt-2 flex items-center gap-2">
          <button
            v-if="!inCart(it.id)"
            class="btn-add btn-md disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="ownedSet.has(it.id) || !hasEnoughGold(it.price)"
            @click="add(it.id)"
          >
            Add to Cart
          </button>
          <button v-else class="btn-remove btn-md" @click="remove(it.id)">Remove from Cart</button>

          <span v-if="ownedSet.has(it.id)" class="text-emerald-400 text-sm">Owned</span>
          <span v-else-if="inCart(it.id)" class="text-amber-300 text-sm">In cart</span>
          <span v-else-if="!hasEnoughGold(it.price)" class="text-rose-300 text-sm">
            Not enough gold
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  items: { type: Array, required: true },
  type: { type: String, required: true }, // 'weapon' | 'armor'
  ownedIds: { type: Array, default: () => [] },
})

const cart = useCartStore()
const player = usePlayerStore()

const ownedSet = computed(() => new Set(props.ownedIds))
const inCart = (id) => cart.inCart(props.type, id)

const remainingGold = computed(() => player.gold - cart.totalPrice)
const hasEnoughGold = (cost) => remainingGold.value >= cost

const add = (id) => cart.add(props.type, id)
const remove = (id) => cart.remove(props.type, id)
</script>
