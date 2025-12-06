<template>
  <TheHeader
    :is-character-open="showCharacter"
    :is-note-open="showNoteMobile"
    @toggle-character="toggleCharacter"
    @toggle-note="toggleNoteMobile"
  />

  <div class="app-content">
    <router-view v-slot="{ Component, route }">
      <transition name="route-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>

  <transition name="modal-blur">
    <CharacterModal v-if="showCharacter" @close="toggleCharacter" />
  </transition>

  <div class="hidden xxl:block">
    <StickyNote />
  </div>

  <div class="block xxl:hidden">
    <transition name="modal-blur">
      <NoteModalMobile v-if="showNoteMobile" @close="toggleNoteMobile" />
    </transition>
  </div>
  <GoldRewardAnimation />
  <h1 class="hidden">Zsolt Péter Takács</h1>
</template>

<script>
import { useWeatherStore } from '@/stores/weather'
import TheHeader from '@/components/layout/TheHeader.vue'
import CharacterModal from '@/components/character/CharacterModal.vue'
import StickyNote from '@/components/note/StickyNote.vue'
import NoteModalMobile from '@/components/note/NoteModalMobile.vue'
import GoldRewardAnimation from '@/components/quests/GoldRewardAnimation.vue'

export default {
  name: 'App',
  components: { TheHeader, CharacterModal, StickyNote, NoteModalMobile, GoldRewardAnimation },

  data() {
    return {
      showCharacter: false,
      showNoteMobile: false,
      weatherIntervalId: null,
    }
  },

  methods: {
    toggleCharacter() {
      this.showCharacter = !this.showCharacter
    },
    toggleNoteMobile() {
      this.showNoteMobile = !this.showNoteMobile
    },
  },

  mounted() {
    const weather = useWeatherStore()
    weather.refreshIfStale()

    const TWENTY_MINUTES = 20 * 60 * 1000
    this.weatherIntervalId = setInterval(() => {
      weather.refreshIfStale()
    }, TWENTY_MINUTES)
  },

  beforeUnmount() {
    clearInterval(this.weatherIntervalId)
  },
}
</script>

<style scoped>
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}

.modal-blur-enter-active,
.modal-blur-leave-active {
  transition: opacity 0.2s ease-out, filter 0.2s ease-out;
}

.modal-blur-enter-from,
.modal-blur-leave-to {
  opacity: 0;
  filter: blur(60px);
}
</style>
