<template>
  <section>
    <div v-if="isInShop" class="py-4 bg-soft-black w-full border-b-2 border-b-emerald-500">
      <div class="flex flex-wrap gap-2 flex-col md:flex-row max-w-7xl w-full justify-between px-3">
        <nav class="flex flex-wrap gap-2 flex-col md:flex-row">
          <RouterLink
            v-if="routing.name !== ROUTE.SHOP.WEAPON"
            :to="{ name: ROUTE.SHOP.WEAPON }"
            class="btn-primary text-center"
          >
            Weapon
          </RouterLink>
          <RouterLink
            v-if="routing.name !== ROUTE.SHOP.ARMOR"
            :to="{ name: ROUTE.SHOP.ARMOR }"
            class="btn-primary text-center"
          >
            Armor
          </RouterLink>
          <RouterLink
            v-if="routing.name !== ROUTE.SHOP.POTION"
            :to="{ name: ROUTE.SHOP.POTION }"
            class="btn-primary text-center"
          >
            Potion
          </RouterLink>
          <RouterLink
            v-if="routing.name !== ROUTE.SHOP.CHECKOUT"
            :to="{ name: ROUTE.SHOP.CHECKOUT }"
            class="btn-primary text-center"
          >
            Checkout
          </RouterLink>
        </nav>

        <button class="btn-secondary" @click="showCalculator = true">Open Calculator</button>
      </div>
    </div>

    <RouterView />

    <KeepAlive>
      <CalculatorModal v-if="showCalculator" @close="showCalculator = false" />
    </KeepAlive>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PATHS, ROUTE } from '@/router/routes.js'
import CalculatorModal from '@/components/shop/CalculatorModal.vue'

const routing = useRoute()
const path = computed(() => routing.path)
const isInShop = computed(() => path.value.startsWith(PATHS.SHOP))

const showCalculator = ref(false)
</script>
