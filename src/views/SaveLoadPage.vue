<template>
  <section class="max-w-3xl mx-auto text-white space-y-4 p-3">
    <div class="flex border-b border-slate-700 mb-4">
      <button
        class="px-4 py-2 text-lg font-medium border-b-2"
        :class="
          activeTab === 'save'
            ? 'text-emerald-400!'
            : 'border-transparent hover:bg-emerald-400 hover:text-black! rounded rounded-b-none'
        "
        @click="activeTab = 'save'"
      >
        Save
      </button>
      <button
        class="px-4 py-2 text-lg font-medium border-b-2"
        :class="
          activeTab === 'load'
            ? 'text-emerald-400!'
            : 'border-transparent hover:bg-emerald-400 hover:text-black! rounded rounded-b-none'
        "
        @click="activeTab = 'load'"
      >
        Load
      </button>
    </div>

    <form v-if="activeTab === 'save'" @submit.prevent="onSave" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Save name</label>
        <input
          v-model="saveName"
          type="text"
          class="w-full rounded text-base bg-slate-800/80 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="My awesome run"
          required
        />
      </div>

      <div>
        <label class="block font-medium mb-1">Note</label>
        <textarea
          v-model="note.text"
          rows="8"
          class="w-full rounded border border-slate-700 px-3 py-2 text-base resize-none"
          placeholder="Write your notes here (this will be saved into the file)."
        ></textarea>
        <p class="text-xs mt-1">
          This note is shared with the sticky Note panel and will be saved into your JSON file.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button type="submit" class="btn-primary">Download Save File</button>
        <span v-if="saveMessage" class="text-xs">
          {{ saveMessage }}
        </span>
      </div>
    </form>

    <div v-else class="space-y-4">
      <div>
        <label class="block text-lg font-medium mb-1">Load save file</label>
        <input
          ref="fileInput"
          type="file"
          accept="application/json"
          class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-black hover:file:bg-emerald-400 my-2"
          @change="onFileChange"
        />
        <p class="text-xs text-slate-400 mt-1">
          Select a JSON file previously exported from this game.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!loadedPayload"
          @click="onApplyLoaded"
        >
          Apply Loaded Save
        </button>
        <span v-if="loadMessage" class="text-xs text-slate-300">
          {{ loadMessage }}
        </span>
      </div>

      <div
        v-if="loadedMeta"
        class="mt-3 text-xs text-slate-300 border border-slate-700/70 rounded p-3 bg-slate-900/60"
      >
        <div><span class="opacity-70">File name: </span>{{ loadedFileName }}</div>
        <div><span class="opacity-70">Save name: </span>{{ loadedMeta.saveName }}</div>
        <div><span class="opacity-70">Created at: </span>{{ loadedMeta.createdAt }}</div>
        <div class="mt-2">
          <span class="opacity-70">Note preview:</span>
          <pre class="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap text-white"
            >{{ loadedMeta.note || '(empty)' }}
          </pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNoteStore } from '@/stores/note'
import { createSavePayload, applySavePayload } from '@/services/saveSystem'

const activeTab = ref('save')
const saveName = ref('')
const saveMessage = ref('')
const loadMessage = ref('')

const note = useNoteStore()

const fileInput = ref(null)
const loadedPayload = ref(null)
const loadedFileName = ref('')

const loadedMeta = computed(() => loadedPayload.value?.meta ?? null)

function downloadJsonFile(filename, dataObj) {
  const json = JSON.stringify(dataObj, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function onSave() {
  try {
    const trimmedName = saveName.value.trim() || 'monstr-save'
    const payload = createSavePayload(trimmedName)

    const fileName = `${trimmedName.replace(/\s+/g, '_')}.json`
    downloadJsonFile(fileName, payload)

    saveMessage.value = `Save file "${fileName}" generated.`
    setTimeout(() => (saveMessage.value = ''), 4000)
  } catch (err) {
    console.error('[Save] error:', err)
    saveMessage.value = 'Error while creating the save file.'
  }
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  loadedPayload.value = null
  loadedFileName.value = ''
  loadMessage.value = ''

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target.result
      const data = JSON.parse(text)
      loadedPayload.value = data
      loadedFileName.value = file.name
      loadMessage.value = 'File loaded. Click "Apply Loaded Save" to apply it.'
    } catch (err) {
      console.error('[Load] parse error:', err)
      loadMessage.value = 'Invalid JSON file.'
      loadedPayload.value = null
    }
  }
  reader.onerror = () => {
    loadMessage.value = 'Error reading file.'
  }
  reader.readAsText(file)
}

function onApplyLoaded() {
  if (!loadedPayload.value) return
  try {
    applySavePayload(loadedPayload.value)
    loadMessage.value = 'Save applied successfully.'
    setTimeout(() => (loadMessage.value = ''), 4000)
  } catch (err) {
    console.error('[Load] apply error:', err)
    loadMessage.value = 'Error applying the save file.'
  }
}
</script>
