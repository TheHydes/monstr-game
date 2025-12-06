import { usePlayerStore } from '@/stores/player'
import { useMonsterStore } from '@/stores/monster'
import { useHuntStore } from '@/stores/hunt'
import { useCartStore } from '@/stores/cart'
import { useNoteStore } from '@/stores/note'
import { useQuestStore } from '@/stores/quest'

export function createSavePayload(saveName) {
  const player = usePlayerStore()
  const monster = useMonsterStore()
  const hunt = useHuntStore()
  const cart = useCartStore()
  const note = useNoteStore()
  const quest = useQuestStore()

  const payload = {
    meta: {
      version: 1,
      saveName: saveName || 'monstr-save',
      createdAt: new Date().toISOString(),
      note: note.text,
    },
    player: { ...player.$state },
    monster: { ...monster.$state },
    hunt: {
      // ...hunt.$state?
      log: [...hunt.log],
      running: false,
      lastResult: hunt.lastResult,
      skipBattle: hunt.skipBattle,
      currentMonsterSprite: hunt.currentMonsterSprite,
    },
    cart: {
      weapons: Array.from(cart.weapons),
      armors: Array.from(cart.armors),
      potions: { ...cart.potions },
    },
    quest: {
      ...quest.$state,
    },
  }

  return payload
}

export function applySavePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid save payload')
  }

  const player = usePlayerStore()
  const monster = useMonsterStore()
  const hunt = useHuntStore()
  const cart = useCartStore()
  const note = useNoteStore()
  const quest = useQuestStore()

  if (payload.player) player.$patch(payload.player)
  if (payload.monster) monster.$patch(payload.monster)

  if (payload.hunt) {
    hunt.$patch({
      ...hunt.$state,
      ...payload.hunt,
      running: false,
    })
  }

  if (payload.cart) {
    cart.weapons = new Set(payload.cart.weapons || [])
    cart.armors = new Set(payload.cart.armors || [])
    cart.potions = { ...(payload.cart.potions || {}) }
  }
  
  if (payload.quest) {
    quest.$patch(payload.quest)
  }

  const noteText =
    payload.meta?.note ??
    payload.note ??
    ''
  note.setText(noteText)
}
