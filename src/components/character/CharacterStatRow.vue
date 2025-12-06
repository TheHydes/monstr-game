<template>
  <div>
    <span class="opacity-70">{{ label }}: </span>
    <span class="font-semibold">
      {{ value }}
      <span v-if="suffix">{{ suffix }}</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  suffix: {
    type: String,
    default: '',
  },
})
</script>
