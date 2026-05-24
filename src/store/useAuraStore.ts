import { create } from 'zustand'
import { persist } from 'zustand/middleware'import { immer } from 'zustand/middleware/immer' // we'll use plain zustand
import type { UserProfile, Task, WellnessStats, NavTab, ThemeName } from '@/types'
import { MOCK_PROFILE, MOCK_TASKS, MOCK_WELLNESS } from '@/lib/mockData'

interface AuraState {
  // Navigation
  activeTab: NavTab
  setActiveTab: (tab: NavTab) => void

  // User
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  addXP: (amount: number) => void
  addDiamonds: (amount: number) => void
  spendDiamonds: (amount: number) => boolean
  setTheme: (theme: ThemeName) => void

  // Tasks
  tasks: Task[]
  toggleTask: (taskId: string) => { xp: number; diamonds: number } | null
  addTask: (task: Task) => void

  // Wellness
  wellness: WellnessStats
  setWellness: (stats: Partial<WellnessStats>) => void

  // XP Toast
  xpToast: { visible: boolean; amount: number; label: string }
  showXPToast: (amount: number, label?: string) => void

  // Hydration
  isLoading: boolean
  setLoading: (v: boolean) => void
}

export const useAuraStore = create<AuraState>()(
  persist(
    (set, get) => ({  // Navigation
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // User
  profile: null,
  setProfile: (profile) => set({ profile }),

  addXP: (amount) => {
    const { profile } = get()
    if (!profile) return
    const newXP = profile.xp + amount
    const xpProgress = Math.min(Math.floor((newXP / profile.xpToNext) * 100), 100)
    const leveledUp = newXP >= profile.xpToNext
    set({
      profile: {
        ...profile,
        xp: leveledUp ? newXP - profile.xpToNext : newXP,
        level: leveledUp ? profile.level + 1 : profile.level,
        xpProgress: leveledUp ? 0 : xpProgress,
      },
    })
  },

  addDiamonds: (amount) => {
    const { profile } = get()
    if (!profile) return
    set({ profile: { ...profile, diamonds: profile.diamonds + amount } })
  },

  spendDiamonds: (amount) => {
    const { profile } = get()
    if (!profile || profile.diamonds < amount) return false
    set({ profile: { ...profile, diamonds: profile.diamonds - amount } })
    return true
  },

  setTheme: (theme) => {
    const { profile } = get()
    if (!profile) return
    set({ profile: { ...profile, theme } })
  },

  // Tasks
  tasks: MOCK_TASKS,
  toggleTask: (taskId) => {
    const { tasks, addXP, addDiamonds, showXPToast } = get()
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.completed) return null

    set({
      tasks: tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      ),
    })

    addXP(task.xpReward)
    addDiamonds(task.diamondReward)
    showXPToast(task.xpReward)

    return { xp: task.xpReward, diamonds: task.diamondReward }
  },

  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }))
  },

  // Wellness
  wellness: MOCK_WELLNESS,
  setWellness: (stats) => {
    set((state) => ({ wellness: { ...state.wellness, ...stats } }))
  },

  // XP Toast
  xpToast: { visible: false, amount: 0, label: 'отличная работа ✨' },
  showXPToast: (amount, label = 'отличная работа ✨') => {
    set({ xpToast: { visible: true, amount, label } })
    setTimeout(() => {
      set({ xpToast: { visible: false, amount, label } })
    }, 1800)
  },

  // Loading
  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}),
    {
      name: 'aura-storage',
      partialize: (state) => ({
        profile: state.profile,
        tasks: state.tasks,
        wellness: state.wellness,
      }),
    }
  )
)