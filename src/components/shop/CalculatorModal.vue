<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/85" @click.self="$emit('close')">
    <div class="w-full max-w-xs">
      <Calculator @close="$emit('close')" />
    </div>
  </div>
</template>

<script setup>
import Calculator from '@/components/shop/Calculator.vue'

defineEmits(['close'])
</script>
