<template>
  <li class="flex items-center justify-between bg-dark-blue rounded-2xl px-1.5 py-1.5">
    <div class="flex items-center gap-2">
      <img
        :src="icon"
        :alt="`${label} icon`"
        class="w-8 h-8 bg-light-blue rounded-4xl transition-transform"
        :class="{ 'animate-pulse-scale-on-click': pulseIcon }"
      />
      <span class="text-sm sm:text-base">{{ label }}</span>

      <span v-if="value" class="opacity-80 text-sm">
        ( {{ value }}
        <span v-if="isMax" class="text-amber-400"> MAX</span>
        )
      </span>
    </div>

    <div v-if="!isMax" class="flex items-center gap-2">
      <span class="text-sm">{{ cost }}g</span>
      <button
        class="btn-blue btn-sm md:px-3 md:py-1.5 md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="disabled"
        @click="onBuy"
      >
        Buy
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  cost: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isMax: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['buy'])

const pulseIcon = ref(false)

function onBuy() {
  if (props.disabled) return

  emit('buy')

  pulseIcon.value = false
  requestAnimationFrame(() => {
    pulseIcon.value = true
  })

  setTimeout(() => {
    pulseIcon.value = false
  }, 600)
}
</script>
