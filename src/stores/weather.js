import { defineStore } from 'pinia'

import bgHeavyRain from '@/assets/Images/Backgrounds/EnemyHeavyRainBG.png'
import bgLightRain from '@/assets/Images/Backgrounds/EnemyLightRainBG.png'
import bgSnow from '@/assets/Images/Backgrounds/EnemySnowBG.png'
import bgNight from '@/assets/Images/Backgrounds/EnemyNightTimeBG.png'
import bgSunny from '@/assets/Images/Backgrounds/EnemySunnyBG.png'

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
        const location = import.meta.env.VITE_WEATHER_LOCATION || 'Budapest'

        const url = `/api/weather?location=${encodeURIComponent(location)}`

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Weather proxy error: ${res.status} ${res.statusText}`)
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
