import { defineStore } from 'pinia'

export const useGoldRewardStore = defineStore('goldReward', {
  state: () => ({
    current: null, 
  }),

  actions: {
    push(amount, source = 'generic') {
      const now = Date.now()
      const MIN_CHAIN_MS = 2400

      if (this.current && now - this.current.ts < MIN_CHAIN_MS) {
        this.current = {
          gold: this.current.gold + amount,
          source,
          ts: now,
        }
      } else {
        this.current = {
          gold: amount,
          source,
          ts: now,
        }
      }
    },

    clear() {
      this.current = null
    },
  },
})
