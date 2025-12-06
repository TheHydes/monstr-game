import { defineStore } from 'pinia'

export const useNoteStore = defineStore('note', {
  state: () => ({
    text: '',
  }),
  actions: {
    setText(value) {
      this.text = value ?? ''
    },
    clear() {
      this.text = ''
    },
  },
})
