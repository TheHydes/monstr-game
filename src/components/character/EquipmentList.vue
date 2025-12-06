<template>
  <div class="rounded-lg bg-blue p-3">
    <h3 class="pb-2">{{ title }}</h3>

    <div v-if="items.length === 0" class="opacity-70 text-sm">
      No {{ title.toLowerCase() }} owned.
    </div>

    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="it in items"
        :key="it.id"
        class="flex items-center justify-between bg-dark-blue p-3 rounded-2xl"
      >
        <div class="flex items-center gap-3">
          <img v-if="it.img" :src="it.img" :alt="it.name || it.id" class="wh-12" />
          <div class="text-sm flex flex-col gap-1">
            <div class="font-bold">
              {{ it.name ?? it.id }}
            </div>

            <div class="text-xs flex flex-col gap-0.5">
              <template v-if="itemType === 'weapon'">
                <div>Damage: +{{ Math.round((it.dmgPct ?? 0) * 100) }}%</div>
                <div v-if="it.critPct">Crit: +{{ Math.round((it.critPct ?? 0) * 100) }}%</div>
                <div v-if="it.firePct">Fire: +{{ Math.round((it.firePct ?? 0) * 100) }}%</div>
              </template>

              <template v-else-if="itemType === 'armor'">
                <div>Max HP: +{{ Math.round((it.hpScalePct ?? 0) * 100) }}%</div>
                <div>Damage Reduction: {{ Math.round((it.drPct ?? 0) * 100) }}%</div>
              </template>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <span v-if="selectedId === it.id" class="text-emerald-400 text-sm"> Equipped </span>
          <button v-else class="btn-blue btn-md" @click="$emit('equip', it.id)">Equip</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: [String, Number, null],
    default: null,
  },
  // 'weapon' | 'armor'
  itemType: {
    type: String,
    required: true,
  },
})

defineEmits(['equip'])
</script>
