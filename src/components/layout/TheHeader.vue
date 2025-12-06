<template>
  <header class="sticky top-0 z-10 shadow bg-light-black">
    <PotionDiscountBar />
    <nav class="max-w-7xl mx-auto w-full flex items-center justify-between py-5 px-3">
      <RouterLink :to="{ name: ROUTE.HUNT }">
        <img :src="logo" alt="MonstR logo" class="w-40 animate-pulse-scale" />
      </RouterLink>

      <div class="hidden md:flex gap-4 items-center">
        <button
          class="nav-btn"
          :class="{ 'is-active': isCharacterOpen }"
          @click="$emit('toggle-character')"
        >
          <img :src="character" class="wh-11-12" /> Character
        </button>

        <RouterLink
          :to="{ name: ROUTE.SHOP.ROOT }"
          class="nav-btn"
          :class="{ 'is-active': isOnShop }"
        >
          <img :src="shop" class="wh-11-12" /> Shop
        </RouterLink>

        <button
          class="nav-btn xxl:hidden"
          :class="{ 'is-active': isNoteOpen }"
          @click="$emit('toggle-note')"
        >
          <img :src="note" class="wh-11-12" /> Note
        </button>

        <RouterLink :to="{ name: ROUTE.SAVE }" class="nav-btn" :class="{ 'is-active': isOnSave }">
          <img :src="floppy" class="wh-11-12" /> Save / Load
        </RouterLink>

        <RouterLink
          :to="{ name: ROUTE.QUESTS }"
          class="nav-btn"
          :class="{ 'is-active': isOnQuests }"
        >
          <img :src="quest" class="wh-11-12" /> Quests
        </RouterLink>
      </div>

      <button class="md:hidden nav-btn wh-12 px-0 py-0" @click="toggleMobile">
        <div v-if="!mobileOpen">
          <img :src="hamburger" />
        </div>
        <div v-else>
          <img :src="close" />
        </div>
      </button>

      <div class="shrink-0 flex items-center gap-2">
        <img :src="gold" class="wh-11-12" />
        <p class="font-semibold">{{ goldAmount }}</p>
      </div>
    </nav>

    <transition name="mobile-menu">
      <div v-if="mobileOpen" class="md:hidden bg-light-black py-3 w-full">
        <button
          class="nav-btn w-full rounded-none"
          :class="{ 'is-active': isCharacterOpen }"
          @click="$emit('toggle-character'), closeMobile()"
        >
          <img :src="character" class="wh-11-12" /> Character
        </button>

        <RouterLink
          :to="{ name: ROUTE.SHOP.ROOT }"
          class="nav-btn w-full rounded-none"
          :class="{ 'is-active': isOnShop }"
          @click="closeMobile"
        >
          <img :src="shop" class="wh-11-12" /> Shop
        </RouterLink>

        <button
          class="nav-btn w-full rounded-none"
          :class="{ 'is-active': isNoteOpen }"
          @click="$emit('toggle-note'), closeMobile()"
        >
          <img :src="note" class="wh-11-12" /> Note
        </button>

        <RouterLink
          :to="{ name: ROUTE.SAVE }"
          class="nav-btn w-full rounded-none"
          :class="{ 'is-active': isOnSave }"
          @click="closeMobile"
        >
          <img :src="floppy" class="wh-11-12" />
          Save / Load
        </RouterLink>

        <RouterLink
          :to="{ name: ROUTE.QUESTS }"
          class="nav-btn w-full rounded-none"
          :class="{ 'is-active': isOnQuests }"
          @click="closeMobile"
        >
          <img :src="quest" class="wh-11-12" />
          Quests
        </RouterLink>
      </div>
    </transition>
  </header>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import logo from '@/assets/Images/Misc/MonstR-logo.png'
import gold from '@/assets/Images/Misc/gold.png'
import shop from '@/assets/Images/Misc/shop.png'
import character from '@/assets/Images/Misc/character.png'
import note from '@/assets/Images/Misc/note.png'
import floppy from '@/assets/Images/Misc/floppy.png'
import hamburger from '@/assets/Images/Misc/hamburger.png'
import close from '@/assets/Images/Misc/close.png'
import quest from '@/assets/Images/Misc/quests.png'
import { PATHS, ROUTE } from '@/router/routes.js'
import PotionDiscountBar from '@/components/shop/PotionDiscountBar.vue'

export default {
  name: 'TheHeader',
  emits: ['toggle-character', 'toggle-note'],

  components: { PotionDiscountBar },

  props: {
    isCharacterOpen: {
      type: Boolean,
      default: false,
    },
    isNoteOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      logo,
      gold,
      shop,
      character,
      note,
      floppy,
      hamburger,
      close,
      quest,
      mobileOpen: false,
      ROUTE,
    }
  },

  computed: {
    goldAmount() {
      return usePlayerStore().gold
    },

    isOnShop() {
      return this.$route.path.startsWith(PATHS.SHOP)
    },

    isOnSave() {
      return this.$route.name === ROUTE.SAVE
    },
    isOnQuests() {
      return this.$route.name === ROUTE.QUESTS
    },
  },

  methods: {
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen
    },
    closeMobile() {
      this.mobileOpen = false
    },
  },
}
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
  transform-origin: top;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}

.is-active {
  background-color: var(--color-soft-black);
}
</style>
