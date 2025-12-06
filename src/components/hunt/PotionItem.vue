<template>
  <button
    class="btn-potion btn-lg disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed justify-items-center"
    :disabled="disabled"
    @click="$emit('use')"
  >
    <img :src="potion.img" class="wh-12" :alt="potion.name" />
    {{ potion.name }} ({{ count }})
    <br />
    (Restore {{ healAmount }} HP, Hotkey: {{ hotkey }})
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  potion: Object,
  count: Number,
  disabled: Boolean,
  hotkey: {
    type: String,
    default: '',
  },
})

const player = usePlayerStore()

const healAmount = computed(() => Math.round(player.maxHp * props.potion.healPct))
</script>
