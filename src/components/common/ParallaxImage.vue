<template>
  <div class="relative overflow-hidden" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <img
      :src="src"
      :alt="alt"
      class="pointer-events-none select-none absolute inset-0 w-full h-full object-cover"
      :style="imageStyle"
    />

    <div class="relative z-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  maxTranslate: {
    type: Number,
    default: 30,
  },
  scale: {
    type: Number,
    default: 1.08,
  },
})

const relX = ref(0)
const relY = ref(0)

const imageStyle = computed(() => ({
  transform: `scale(${props.scale}) translate3d(${-relX.value * props.maxTranslate}px, ${
    -relY.value * props.maxTranslate
  }px, 0)`,
  transition: 'transform 0.08s ease-out',
}))

function onMouseMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  relX.value = Math.max(-0.5, Math.min(0.5, x))
  relY.value = Math.max(-0.5, Math.min(0.5, y))
}

function onMouseLeave() {
  relX.value = 0
  relY.value = 0
}
</script>
