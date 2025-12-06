import { computed } from 'vue'

export function useHpBar(currentRef, maxRef, type = 'monster') {
  const percent = computed(() => {
    const max = maxRef.value || 0
    if (!max) return 0
    const current = Math.max(0, currentRef.value || 0)
    return Math.max(0, Math.round((current / max) * 100))
  })

  const barClass = computed(() => {
    const p = percent.value

    if (type === 'monster') {
      if (p <= 25) return 'bg-red-900'
      if (p <= 50) return 'bg-amber-500 text-black'
      return 'bg-emerald-500'
    }

    if (p <= 25) return 'bg-black text-red-200'
    if (p <= 50) return 'bg-amber-300 text-black'
    return 'bg-red-600'
  })

  return {
    percent,
    barClass,
  }
}
