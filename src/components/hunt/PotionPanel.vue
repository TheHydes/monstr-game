<template>
  <div class="px-3 py-5 bg-soft-black/90">
    <div class="flex flex-wrap gap-3 justify-center">
      <PotionItem
        v-for="(p, idx) in potions"
        :key="p.id"
        :potion="p"
        :count="player.potionCount(p.id)"
        :disabled="!player.canUsePotion(p.id)"
        :hotkey="hotkeyForIndex(idx)"
        @use="player.usePotion(p.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useCatalogStore } from '@/stores/catalog'
import PotionItem from './PotionItem.vue'

const player = usePlayerStore()
const catalog = useCatalogStore()

const potions = computed(() => catalog.potions)

const hotkeys = ['1', '2', '3']
const hotkeyForIndex = (idx) => hotkeys[idx] ?? ''
</script>
