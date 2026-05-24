// ─── Database Types ────────────────────────────────────────────────────────

export interface DbUser {
  id: string
  telegram_id: number
  username: string
  first_name: string
  last_name?: string
  avatar_url?: string
  diamonds: number
  level: number
  xp: number
  xp_to_next: number
  streak: number
  best_streak: number
  energy: number
  theme: ThemeName
  created_at: string
  updated_at: string
}

export interface DbTask {
  id: string
  user_id: string
  title: string
  category: TaskCategory
  completed: boolean
  completed_at?: string
  xp_reward: number
  diamond_reward: number
  duration_minutes: number
  emoji: string
  streak_days: number
  created_at: string
}

export interface DbHabit {
  id: string
  user_id: string
  title: string
  emoji: string
  category: TaskCategory
  streak: number
  best_streak: number
  xp_reward: number
  target_days_per_week: number
  created_at: string
}

export interface DbWellnessLog {
  id: string
  user_id: string
  date: string
  mood: MoodLevel
  sleep_hours: number
  meditation_minutes: number
  focus_minutes: number
  steps: number
  water_liters: number
  notes?: string
  created_at: string
}

export interface DbShopItem {
  id: string
  name: string
  description: string
  emoji: string
  type: ShopItemType
  price_diamonds: number
  theme?: ThemeName
}

export interface DbUserItem {
  id: string
  user_id: string
  item_id: string
  equipped: boolean
  purchased_at: string
}

// ─── App Types ─────────────────────────────────────────────────────────────

export type TaskCategory = 'mandatory' | 'work' | 'personal' | 'wellness'

export type MoodLevel = 1 | 2 | 3 | 4 | 5

export type ThemeName = 'midnight' | 'soft-beige' | 'lavender-dream' | 'sage-green'

export type ShopItemType = 'theme' | 'decoration' | 'boost' | 'protection'

export type NavTab = 'home' | 'analytics' | 'tasks' | 'wellness' | 'shop'

export type AnalyticsPeriod = 'week' | 'month' | 'year'

export type WellnessTab = 'meditations' | 'sleep' | 'breathing' | 'music'

// ─── View Models ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  telegramId: number
  username: string
  firstName: string
  lastName?: string
  avatarUrl?: string
  diamonds: number
  level: number
  xp: number
  xpToNext: number
  xpProgress: number // 0-100 percentage
  streak: number
  bestStreak: number
  energy: number
  theme: ThemeName
}

export interface Task {
  id: string
  title: string
  category: TaskCategory
  completed: boolean
  xpReward: number
  diamondReward: number
  durationMinutes: number
  emoji: string
  streakDays: number
}

export interface WellnessStats {
  mood: MoodLevel
  sleepHours: number
  meditationMinutes: number
  focusMinutes: number
  steps: number
  waterLiters: number
}

export interface StreakDay {
  date: string
  label: string
  dayLetter: string
  completed: boolean
  isToday: boolean
  dayNumber: number
}

export interface AnalyticsData {
  period: AnalyticsPeriod
  activity: { label: string; value: number; isToday?: boolean }[]
  mood: { label: string; value: number }[]
  habitProgress: { name: string; emoji: string; completed: number; target: number }[]
  totalXP: number
  totalTasks: number
  avgMood: number
  avgSleep: number
}

export interface MeditationSession {
  id: string
  title: string
  subtitle: string
  durationMinutes: number
  timeOfDay: 'morning' | 'evening' | 'anytime'
  accent: 'purple' | 'pink' | 'teal'
  xpReward: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  emoji: string
  type: ShopItemType
  priceDiamonds: number
  theme?: ThemeName
  owned: boolean
  equipped?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  earned: boolean
  earnedAt?: string
  progress?: number
  target?: number
}

// ─── Theme System ──────────────────────────────────────────────────────────

export interface ThemeConfig {
  name: ThemeName
  label: string
  emoji: string
  bg: string
  bg2: string
  bg3: string
  accent: string
  accent2: string
  accentDim: string
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  midnight: {
    name: 'midnight',
    label: 'Midnight',
    emoji: '🌙',
    bg: '#0d0b14',
    bg2: '#13101e',
    bg3: '#1a1628',
    accent: '#9b8ae8',
    accent2: '#c4b8f7',
    accentDim: '#3d3466',
  },
  'soft-beige': {
    name: 'soft-beige',
    label: 'Soft Beige',
    emoji: '☕',
    bg: '#1a1510',
    bg2: '#221c14',
    bg3: '#2a231a',
    accent: '#e8c97a',
    accent2: '#f5e4b0',
    accentDim: '#6b5020',
  },
  'lavender-dream': {
    name: 'lavender-dream',
    label: 'Lavender Dream',
    emoji: '💜',
    bg: '#110d1a',
    bg2: '#180f24',
    bg3: '#1f1530',
    accent: '#c4b8f7',
    accent2: '#e8e4fa',
    accentDim: '#4a3a7a',
  },
  'sage-green': {
    name: 'sage-green',
    label: 'Sage Green',
    emoji: '🌿',
    bg: '#0c130e',
    bg2: '#101a12',
    bg3: '#162018',
    accent: '#7dc9c0',
    accent2: '#b0e8e4',
    accentDim: '#2a5550',
  },
}

// ─── XP / Leveling ─────────────────────────────────────────────────────────

export function getXpForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(1.3, level - 1))
}

export function calculateLevel(totalXp: number): { level: number; xp: number; xpToNext: number; progress: number } {
  let level = 1
  let remaining = totalXp
  while (remaining >= getXpForLevel(level)) {
    remaining -= getXpForLevel(level)
    level++
  }
  const xpToNext = getXpForLevel(level)
  return {
    level,
    xp: remaining,
    xpToNext,
    progress: Math.floor((remaining / xpToNext) * 100),
  }
}
