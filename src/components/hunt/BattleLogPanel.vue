<template>
  <div class="p-3 bg-soft-black/90 pb-24">
    <h3 class="font-semibold mb-2">Battle Log</h3>
    <ol class="list-decimal list-inside space-y-1">
      <li v-for="(line, idx) in battle.log" :key="idx">
        {{ line }}
      </li>
    </ol>
  </div>
</template>

<script setup>
import { useHuntStore } from '@/stores/hunt'
const battle = useHuntStore()
</script>
