<template>
  <section class="h-screen flex items-center justify-center">
    <div class="w-full h-screen absolute justify-items-center">
      <img
        :src="notFoundImg"
        alt="You seem lost"
        class="absolute w-screen h-screen object-cover inset-0 blur-lg"
      />

      <ParallaxImage
        :src="notFoundImg"
        alt="You seem lost"
        :max-translate="30"
        :scale="1.08"
        class="relative max-w-7xl w-screen h-screen overflow-hidden bg-slate-900/80 border border-slate-700/60"
      >
        <div
          class="relative z-1 flex flex-col items-center justify-center py-16 gap-6 text-center px-6 inset-0 bg-slate-950/50"
        >
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-100 drop-shadow">
            You are lost, my friend.
          </h1>
          <p key="quote" class="text-slate-200/90 text-lg max-w-xl">
            {{ randomQuote }}
          </p>

          <RouterLink :to="{ name: ROUTE.HUNT }">
            <button type="button" class="nav-btn mt-2 px-6 py-2 text-lg cursor-pointer">
              ⬅ Back to Hunt
            </button>
          </RouterLink>
        </div>
      </ParallaxImage>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import notFoundImg from '@/assets/Images/Misc/NotFound.png'
import { ROUTE } from '@/router/routes.js'
import ParallaxImage from '@/components/common/ParallaxImage.vue'
import { ref } from 'vue'

const quotes = [
  'Even heroes lose their way sometimes.',
  'Not all who wander are lost… but you might be.',
  "This place wasn't meant to be found.",
  'You seem far from the beaten path, traveler.',
  'The monsters aren’t here… but nothing else is either.',
  'You took a wrong turn in the realm of code.',
  'Every great journey has a misstep.',
  'Paths end, but adventures continue elsewhere.',
  'The map ends here, but your story doesn’t.',
  "You've reached a land without legends.",
  'Let me help you find your way back to safer grounds.',
]

const randomQuote = ref(quotes[Math.floor(Math.random() * quotes.length)])
</script>
