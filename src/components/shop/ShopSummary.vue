<template>
  <p>
    Total: {{ cart.totalPrice }}g (Your gold: {{ player.gold }}g, Remaining: {{ remainingGold }}g)
  </p>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { usePlayerStore } from '@/stores/player'

const cart = useCartStore()
const player = usePlayerStore()

const remainingGold = computed(() => player.gold - cart.totalPrice)
</script>
