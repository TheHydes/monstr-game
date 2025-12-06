import { defineStore } from 'pinia'

const randInt = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export const usePotionDiscountStore = defineStore('potionDiscount', {
  state: () => ({
    active: false,
    discountPercent: null,
    remainingSeconds: 0,
    bannerVisible: true,

    _delayTimeoutId: null,
    _tickIntervalId: null,
  }),

  getters: {
    multiplier(state) {
      if (!state.active || !state.discountPercent) return 1
      return Math.max(0, 1 - state.discountPercent / 100)
    },
  },

  actions: {
    startCycleIfNeeded() {
      if (this._delayTimeoutId || this._tickIntervalId || this.active) return
      this._scheduleNextDiscount()
    },

    _scheduleNextDiscount() {
      this._clearTimers()

      const minutes = randInt(5, 35)
      const delayMs = minutes * 60 * 1000

      this._delayTimeoutId = setTimeout(() => {
        this._delayTimeoutId = null
        this._startDiscount()
      }, delayMs)
    },

    _startDiscount() {
      this._clearTimers()

      this.active = true
      this.bannerVisible = true
      this.discountPercent = randInt(10, 40)
      this.remainingSeconds = 5 * 60

      this._tickIntervalId = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--
        } else {
          this._endDiscount()
        }
      }, 1000)
    },

    _endDiscount() {
      this.active = false
      this.discountPercent = null
      this.remainingSeconds = 0
      this.bannerVisible = false

      this._clearTimers()
      this._scheduleNextDiscount()
    },

    hideBanner() {
      this.bannerVisible = false
    },

    _clearTimers() {
      if (this._delayTimeoutId) {
        clearTimeout(this._delayTimeoutId)
        this._delayTimeoutId = null
      }
      if (this._tickIntervalId) {
        clearInterval(this._tickIntervalId)
        this._tickIntervalId = null
      }
    },
  },
})
