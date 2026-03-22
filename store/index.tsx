import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type StandsLog = Record<string, number[]> // YYYY-MM-DD -> confirmed slot minutes-since-midnight

interface StoreState {
  loaded: boolean
  onboarded: boolean
  activeStart: number  // hour 0-23, default 9
  activeEnd: number    // hour 0-23, default 18
  interval: number     // minutes between nudges, default 60
  standsLog: StandsLog
  streak: number
  lastStreakDate: string | null
}

interface StoreActions {
  completeOnboarding: () => Promise<void>
  setActiveWindow: (start: number, end: number) => Promise<void>
  setInterval: (mins: number) => Promise<void>
  confirmStand: (slotMinute: number) => Promise<void>
  resetStreak: () => Promise<void>
}

type Store = StoreState & StoreActions

const StoreContext = createContext<Store | null>(null)

const todayStr = () => new Date().toISOString().split('T')[0]
const yesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({
    loaded: false,
    onboarded: false,
    activeStart: 9,
    activeEnd: 18,
    interval: 60,
    standsLog: {},
    streak: 0,
    lastStreakDate: null,
  })

  useEffect(() => {
    async function load() {
      const keys = ['onboarded', 'activeStart', 'activeEnd', 'interval', 'standsLog', 'streak', 'lastStreakDate']
      const pairs = await AsyncStorage.multiGet(keys)
      const map = Object.fromEntries(pairs.map(([k, v]) => [k, v ?? null]))
      setState({
        loaded: true,
        onboarded: map.onboarded === '1',
        activeStart: map.activeStart ? parseInt(map.activeStart) : 9,
        activeEnd: map.activeEnd ? parseInt(map.activeEnd) : 18,
        interval: map.interval ? parseInt(map.interval) : 60,
        standsLog: map.standsLog ? JSON.parse(map.standsLog) : {},
        streak: map.streak ? parseInt(map.streak) : 0,
        lastStreakDate: map.lastStreakDate,
      })
    }
    load()
  }, [])

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem('onboarded', '1')
    setState(s => ({ ...s, onboarded: true }))
  }, [])

  const setActiveWindow = useCallback(async (start: number, end: number) => {
    await AsyncStorage.multiSet([
      ['activeStart', String(start)],
      ['activeEnd', String(end)],
    ])
    setState(s => ({ ...s, activeStart: start, activeEnd: end }))
  }, [])

  const setInterval = useCallback(async (mins: number) => {
    await AsyncStorage.setItem('interval', String(mins))
    setState(s => ({ ...s, interval: mins }))
  }, [])

  const confirmStand = useCallback(async (slotMinute: number) => {
    setState(prev => {
      const date = todayStr()
      const newLog = { ...prev.standsLog }
      if (!newLog[date]) newLog[date] = []
      if (!newLog[date].includes(slotMinute)) {
        newLog[date] = [...newLog[date], slotMinute]
      }

      const confirmedToday = newLog[date].length
      const threshold = 3
      let newStreak = prev.streak
      let newLastDate = prev.lastStreakDate

      if (confirmedToday >= threshold && date !== prev.lastStreakDate) {
        if (prev.lastStreakDate === null || prev.lastStreakDate === yesterdayStr()) {
          newStreak = prev.streak + 1
        } else {
          newStreak = 1
        }
        newLastDate = date
      }

      const pairs: [string, string][] = [
        ['standsLog', JSON.stringify(newLog)],
        ['streak', String(newStreak)],
      ]
      if (newLastDate) pairs.push(['lastStreakDate', newLastDate])
      AsyncStorage.multiSet(pairs)

      return { ...prev, standsLog: newLog, streak: newStreak, lastStreakDate: newLastDate }
    })
  }, [])

  const resetStreak = useCallback(async () => {
    await AsyncStorage.multiSet([['streak', '0'], ['lastStreakDate', '']])
    setState(s => ({ ...s, streak: 0, lastStreakDate: null }))
  }, [])

  return (
    <StoreContext.Provider value={{ ...state, completeOnboarding, setActiveWindow, setInterval, confirmStand, resetStreak }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
