<template>
  <article class="rounded-lg bg-slate-900/80 border border-slate-700 overflow-hidden">
    <button
      class="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 transition"
      @click="toggleOpen"
    >
      <div class="flex items-center gap-3">
        <input type="checkbox" :checked="goal.done" @click.stop @change="$emit('toggle')" />

        <span class="cursor-pointer" :class="{ 'line-through opacity-60': goal.done }">
          {{ goal.title }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn-sm btn-primary" @click.stop="onEditClick">Edit</button>
        <button class="btn-sm btn-secondary" @click.stop="$emit('remove')">Delete</button>

        <span class="text-xs text-slate-400">
          <span v-if="open">▲</span>
          <span v-else>▼</span>
        </span>
      </div>
    </button>

    <transition name="collapse">
      <div v-if="open" class="px-3 pb-3 pt-1 text-sm text-slate-200 space-y-2">
        <div v-if="editMode" class="space-y-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400">Title</label>
            <input
              v-model="editTitle"
              class="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-sm"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400">Description</label>
            <textarea
              v-model="editDesc"
              rows="3"
              class="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-sm resize-none"
            />
          </div>

          <div class="flex justify-end gap-2">
            <button class="btn-sm btn-primary" @click="onSave">Save</button>
            <button class="btn-sm btn-secondary" @click="onCancel">Cancel</button>
          </div>
        </div>

        <p v-else-if="goal.desc" class="text-slate-200 whitespace-pre-line">
          {{ goal.desc }}
        </p>

        <p v-else class="text-slate-500 text-xs">No description added yet.</p>
      </div>
    </transition>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'remove', 'update'])

const open = ref(false)
const editMode = ref(false)

const editTitle = ref(props.goal.title)
const editDesc = ref(props.goal.desc ?? '')

watch(
  () => props.goal,
  (g) => {
    if (!editMode.value) {
      editTitle.value = g.title
      editDesc.value = g.desc ?? ''
    }
  },
  { deep: true }
)

function toggleOpen() {
  open.value = !open.value
}

function onEditClick() {
  editMode.value = true
  open.value = true
}

function onSave() {
  const title = editTitle.value.trim()
  const desc = editDesc.value.trim()
  if (!title) return
  emit('update', title, desc)
  editMode.value = false
}

function onCancel() {
  editMode.value = false
  editTitle.value = props.goal.title
  editDesc.value = props.goal.desc ?? ''
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.18s ease-out, opacity 0.18s ease-out;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 200px;
  opacity: 1;
}
</style>
