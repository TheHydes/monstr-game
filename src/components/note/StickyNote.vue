<template>
  <div class="fixed z-11" :style="{ left: posX + 'px', top: posY + 'px' }">
    <div
      class="relative"
      :class="expanded ? 'w-[300px] aspect-657/714' : 'w-[300px] aspect-657/200'"
    >
      <img :src="expanded ? parchmentOpen : parchmentClosed" class="absolute" />

      <div class="absolute top-0 left-0 right-0 flex z-10">
        <div
          class="flex-1 cursor-move h-[90px] select-none"
          @mousedown="onDragStart"
          @touchstart.prevent="onDragStartTouch"
        ></div>

        <button
          class="rounded-l-none btn-primary w-[50px] h-[77px] text-[30px]"
          @click.stop="toggleExpanded"
        >
          {{ expanded ? '−' : '+' }}
        </button>
      </div>

      <transition name="fade-slide">
        <div v-if="expanded" class="absolute z-10 left-0 right-0 bottom-0 top-20 h-42 px-12 flex">
          <textarea
            v-model="note.text"
            class="w-full h-full p-2.5 rounded-2xl resize-none box-black"
            placeholder="Write your notes here..."
          ></textarea>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNoteStore } from '@/stores/note'

import parchmentOpen from '@/assets/Images/Misc/parchment-open.png'
import parchmentClosed from '@/assets/Images/Misc/parchment-closed.png'

const note = useNoteStore()
const expanded = ref(false)

const posX = ref(16)
const posY = ref(200)

const dragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

function toggleExpanded() {
  expanded.value = !expanded.value
}

function clampPosition(x, y) {
  if (typeof window === 'undefined') return { x, y }

  const padding = 8
  const width = 300
  const height = expanded.value ? (714 / 657) * 300 : 200

  const maxX = window.innerWidth - width - padding
  const maxY = window.innerHeight - height - padding

  return {
    x: Math.min(Math.max(x, padding), maxX),
    y: Math.min(Math.max(y, padding), maxY),
  }
}

function updatePosition(clientX, clientY) {
  const { x, y } = clampPosition(clientX - dragOffsetX.value, clientY - dragOffsetY.value)
  posX.value = x
  posY.value = y
}

function onDragStart(e) {
  dragging.value = true
  dragOffsetX.value = e.clientX - posX.value
  dragOffsetY.value = e.clientY - posY.value
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

function onDragStartTouch(e) {
  const t = e.touches[0]
  dragging.value = true
  dragOffsetX.value = t.clientX - posX.value
  dragOffsetY.value = t.clientY - posY.value
  window.addEventListener('touchmove', onDragMoveTouch, { passive: false })
  window.addEventListener('touchend', onDragEndTouch)
}

function onDragMove(e) {
  if (dragging.value) updatePosition(e.clientX, e.clientY)
}

function onDragMoveTouch(e) {
  if (!dragging.value) return
  const t = e.touches[0]
  updatePosition(t.clientX, t.clientY)
}

function onDragEnd() {
  dragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

function onDragEndTouch() {
  dragging.value = false
  window.removeEventListener('touchmove', onDragMoveTouch)
  window.removeEventListener('touchend', onDragEndTouch)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const midY = window.innerHeight / 2 - 150
    const { x, y } = clampPosition(16, midY)
    posX.value = x
    posY.value = y
  }
})

onUnmounted(() => {
  onDragEnd()
  onDragEndTouch()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
