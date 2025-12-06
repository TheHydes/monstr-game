# MonstR – Vue Practice / Showcase Game

This is a practice / showcase project built with **Vue 3 + Vite**, using **Pinia** for state management, **Vue Router**, and a mix of the **Composition API** and **Options API**.

It’s a small but fairly feature-rich game that lets you fight monsters, upgrade your character, buy gear and potions, complete quests, manage your own goals, and save / load your progress. Styling is done with **Tailwind CSS** plus some custom CSS and animations.

---

## Features

- **Battle system**
  - Auto-battle mode or animated battle modal
  - Monster levels, bosses every 10 levels
  - Player stats: HP, damage, crit chance, dodge, fire damage, damage reduction
  - Battle log with last event display

- **Dynamic backgrounds via Weather API**
  - Background image changes based on **current real-world weather**
  - Snow / heavy rain / light rain / sunny / night backgrounds
  - Safe fallback based on local time if API fails

- **E-commerce style shop system (Weapon, Armor, Potion, Checkout)**
  - Weapon & Armor shops with ownership tracking
  - Potion shop with:
    - **Global potion discount bar** (random discount %, random activation time, 5-minute duration)
    - Discounted potion price + original price display
  - Shared cart (weapons, armors, potions) with live total price
  - Gold check and “Not enough gold” feedback

- **Calculator feature**
  - Accessible from the Shop
  - Supports keyboard and mouse input

- **Quests & My Goals (To-do list app)**
  - **Predefined quests** with gold rewards:
    - Win your first battle
    - Reach specific player levels (5, 25, 50, 100, 300)
    - Reach specific monster levels (5, 20, 30, 50, 100)
    - Defeat your first boss
    - Equip a weapon, equip an armor
    - Upgrade damage 5 times
  - Progress tracking per quest (e.g. `currentLevel / targetLevel`, `0/1` for simple objectives)
  - Completed quests can be **claimed** once, with a gold reward animation
  - **My Goals** tab:
    - Custom goals (To-Do style)
    - Title + expandable description
    - Mark as done / undone
    - Edit & delete existing goals

- **Save form / Load system**
  - Save your full game state via a small form
  - **Note text** is also stored as part of the save
  - Load restores:
    - Player state
    - Monster state
    - Hunt state
    - Cart contents
    - Note text
    - Quest progress & custom goals

- **Sticky Note / Note Modal**
  - Draggable sticky note on large screens
  - Mobile note modal on smaller screens
  - Synced with Save / Load system

- **Character progression**
  - Upgrade HP, damage, crit chance, dodge
  - Weapons & armors affect stats (damage %, HP %, damage reduction, fire chance)
  - Player portrait changes at specific level breakpoints

- **Keyboard shortcuts**
  - Potions can be used with hotkeys (`1` / `2` / `3`) on the Hunt page
  - Calculator supports keyboard input
  - Navigation is keyboard friendly

- **UI / UX**
  - Tailwind + custom CSS + gradients
  - Nav buttons with animated gradient underlines
  - Buttons with hover / active glow and scale animations
  - Smooth route transitions & modal transitions
  - Gold gain animation (quest reward + monster loot)
  - Parallax animation usage on some pages

- **Not Found page**
  - Parallax Image
  - Randomly generated quotes to guide back the player to existing pages
---

## Tech Stack

- **Vue 3** + **Vite**
- **Pinia** (state management)
- **Vue Router**
- **Tailwind CSS** (+ custom CSS / keyframe animations)
- **Weather API (weatherapi.com)** (current weather → background)
- Deployed on **Vercel**

---

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### Compile and Hot-Reload for Development (or you can use start-vite-vue.bat (on Windows) to launch the project in VS Code if installed, and start the localhost (localhost:5173 is the current setting))

```sh
npm run dev
```

### If you want to check out the project locally, you will need to update a few parts of the weather.js store, you can copy-paste the following: to override it:

```
import { defineStore } from 'pinia'

import bgHeavyRain from '@/assets/Images/Backgrounds/EnemyHeavyRainBG.png'
import bgLightRain from '@/assets/Images/Backgrounds/EnemyLightRainBG.png'
import bgSnow from '@/assets/Images/Backgrounds/EnemySnowBG.png'
import bgNight from '@/assets/Images/Backgrounds/EnemyNightTimeBG.png'
import bgSunny from '@/assets/Images/Backgrounds/EnemySunnyBG.png'

const API_BASE = 'https://api.weatherapi.com/v1'

const snowCodes = new Set([
  1066, 1069, 1114, 1117, 1204, 1207,
  1210, 1213, 1216, 1219, 1222, 1225,
  1237, 1249, 1252, 1255, 1258, 1261, 1264,
  1279, 1282,
])

const heavyRainCodes = new Set([
  1192, 1195, 1201, 1243, 1246, 1276,
])

const lightRainCodes = new Set([
  1063, 1150, 1153, 1168, 1171,
  1180, 1183, 1186, 1189, 1198,
  1240, 1273,
])

export const useWeatherStore = defineStore('weather', {
  state: () => {
    const hour = new Date().getHours()
    const isNightTime = hour < 6 || hour >= 20
    const initialBg = isNightTime ? bgNight : bgSunny

    return {
      background: initialBg,
      loading: false,
      loaded: false,
      error: null,
      lastFetchAt: null,
    }
  },

  actions: {
    _fallbackByLocalTime() {
      const hour = new Date().getHours()
      const isNightTime = hour < 6 || hour >= 20
      this.background = isNightTime ? bgNight : bgSunny
    },

    _selectBackgroundFromCurrent(current) {
      if (!current || !current.condition) {
        this._fallbackByLocalTime()
        return
      }

      const code = current.condition.code
      const isDay = current.is_day === 1

      if (snowCodes.has(code)) {
        this.background = bgSnow
        return
      }

      if (heavyRainCodes.has(code)) {
        this.background = bgHeavyRain
        return
      }

      if (lightRainCodes.has(code)) {
        this.background = bgLightRain
        return
      }

      this.background = isDay ? bgSunny : bgNight
    },

    async _fetchWeather() {
      this.loading = true
      this.error = null
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY
        const location = import.meta.env.VITE_WEATHER_LOCATION || 'Budapest'

        if (!apiKey) {
          console.warn('[weather] No VITE_WEATHER_API_KEY, fallback background.')
          this._fallbackByLocalTime()
          this.loaded = true
          this.lastFetchAt = Date.now()
          return
        }

        const url = `${API_BASE}/current.json?key=${encodeURIComponent(
          apiKey
        )}&q=${encodeURIComponent(location)}&aqi=no`

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`WeatherAPI error: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        console.log('%c[WEATHER API RAW]', 'color: cyan; font-weight: bold;', data)

        const code = data?.current?.condition?.code
        const isDay = data?.current?.is_day === 1
        console.log('%c[WEATHER CODE]', 'color: yellow; font-weight: bold;', code)
        console.log('%c[WEATHER isDay]', 'color: yellow; font-weight: bold;', isDay)

        this._selectBackgroundFromCurrent(data.current)

        console.log(
          '%c[WEATHER BACKGROUND SELECTED]',
          'color: lightgreen; font-weight: bold;',
          this.background
        )

        this.loaded = true
        this.lastFetchAt = Date.now()
      } catch (err) {
        console.error('[weather] Fetch error:', err)
        this.error = err.message || String(err)
        this._fallbackByLocalTime()
      } finally {
        this.loading = false
      }
    },

    async refreshIfStale(maxAgeMs = 2 * 60 * 60 * 1000) {
      const now = Date.now()
      if (this.lastFetchAt && now - this.lastFetchAt < maxAgeMs) {
        return
      }
      await this._fetchWeather()
    },
  },
})
```

### You will also need a .env.local file that contains the following:

VITE_WEATHER_API_KEY=<YOUR API KEY, you can get it if you register on weatherapi.com, there are free plans>
VITE_WEATHER_LOCATION=Budapest

### Future plans for the project

- Might make the styling cleaner
- Add Options menu to enable/disable sounds and bg music
- Reduce image sizes
- Optimize a bit more

#### Thank you for checking out my project!