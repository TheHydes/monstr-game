<template>
  <div
    class="fixed inset-0 bg-black/90 flex items-center justify-center z-15 px-3"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-3xl bg-soft-black rounded-xl p-4 flex flex-col gap-2">
      <header class="flex items-center justify-between">
        <h2>Note</h2>
        <button
          class="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 hover:ring-2 hover:ring-emerald-400"
          @click="$emit('close')"
        >
          Close
        </button>
      </header>

      <textarea
        v-model="note.text"
        class="w-full h-[200px] rounded-2xl border-0 px-3 py-2 text-base resize-none"
        placeholder="Write your note here..."
      ></textarea>

      <p class="text-xs">
        This note is shared with the Save / Load page and the sticky note on bigger desktops.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useNoteStore } from '@/stores/note'

const note = useNoteStore()

defineEmits(['close'])
</script>
