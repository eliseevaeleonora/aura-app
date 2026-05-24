import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, Task, WellnessStats, NavTab, ThemeName } from '@/types'
import { MOCK_TASKS, MOCK_WELLNESS } from '@/lib/mockData'

interface AuraState {
  activeTab: NavTab
  setActiveTab: (tab: NavTab) => void
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  addXP: (amount: number) => void
  addDiamonds: (amount: number) => void
  spendDiamonds: (amount: number) => boolean
  setTheme: (theme: ThemeName) => void
  tasks: Task[]
  toggleTask: (taskId: string) => void
  addTask: (task: Task) => void
  wellness: WellnessStats
  setWellness: (stats: Partial<WellnessStats>) => void
  xpToast: { visible: boolean; amount: number; label: string }
  showXPToast: (amount: number, label?: string) => void
  isLoading: boolean
  setLoading: (v: boolean) => void
}

export const useAuraStore = create<AuraState>()(
  persist(
    (set, get) => ({
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      profile: null,
      setProfile: (profile) => set({ profile }),

      addXP: (amount) => {
        const { profile } = get()
        if (!profile) return
        const newXP = profile.xp + amount
        const leveledUp = newXP >= profile.xpToNext
        set({
          profile: {
            ...profile,
            xp: leveledUp ? newXP - profile.xpToNext : newXP,
            level: leveledUp ? profile.level + 1 : profile.level,
            xpProgress: leveledUp ? 0 : Math.floor((newXP / profile.xpToNext) * 100),
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

      tasks: MOCK_TASKS,
      toggleTask: (taskId) => {
        const { tasks, addXP, addDiamonds, showXPToast } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task || task.completed) return
        set({ tasks: tasks.map((t) => t.id === taskId ? { ...t, completed: true } : t) })
        addXP(task.xpReward)
        addDiamonds(task.diamondReward)
        showXPToast(task.xpReward)
      },

      addTask: (task) => {
        set((state) => ({ tasks: [...state.tasks, task] }))
      },

      wellness: MOCK_WELLNESS,
      setWellness: (stats) => {
        set((state) => ({ wellness: { ...state.wellness, ...stats } }))
      },

      xpToast: { visible: false, amount: 0, label: 'отличная работа ✨' },
      showXPToast: (amount, label = 'отличная работа ✨') => {
        set({ xpToast: { visible: true, amount, label } })
        setTimeout(() => {
          set({ xpToast: { visible: false, amount, label } })
        }, 1800)
      },

      isLoading: false,
      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'aura-storage-v3',
      partialize: (state) => ({
        profile: state.profile,
        tasks: state.tasks,
        wellness: state.wellness,
      }),
    }
  )
)