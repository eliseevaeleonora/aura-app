import { supabase } from './supabase'
import type { DbUser, DbTask, DbWellnessLog, UserProfile, Task } from '@/types'

// ─── User ──────────────────────────────────────────────────────────────────

export async function getOrCreateUser(telegramUser: {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}): Promise<UserProfile | null> {
  // Try to find existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramUser.id)
    .single()

  if (existing) {
    return mapDbUserToProfile(existing)
  }

  // Create new user
  const { data: created, error } = await supabase
    .from('users')
    .insert({
      telegram_id: telegramUser.id,
      username: telegramUser.username ?? null,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name ?? null,
      avatar_url: telegramUser.photo_url ?? null,
      diamonds: 100, // Welcome bonus
      level: 1,
      xp: 0,
      xp_to_next: 1000,
      streak: 0,
      best_streak: 0,
      energy: 100,
      theme: 'midnight',
    })
    .select()
    .single()

  if (error || !created) return null
  return mapDbUserToProfile(created)
}

export async function updateUserXP(userId: string, xpGained: number) {
  const { data: user } = await supabase
    .from('users')
    .select('xp, xp_to_next, level, diamonds')
    .eq('id', userId)
    .single()

  if (!user) return

  let newXP = user.xp + xpGained
  let newLevel = user.level
  let newXPToNext = user.xp_to_next

  // Level up check
  while (newXP >= newXPToNext) {
    newXP -= newXPToNext
    newLevel++
    newXPToNext = Math.floor(1000 * Math.pow(1.3, newLevel - 1))
  }

  await supabase
    .from('users')
    .update({ xp: newXP, level: newLevel, xp_to_next: newXPToNext })
    .eq('id', userId)
}

function mapDbUserToProfile(db: DbUser): UserProfile {
  const progress = Math.floor((db.xp / db.xp_to_next) * 100)
  return {
    id: db.id,
    telegramId: db.telegram_id,
    username: db.username ?? '',
    firstName: db.first_name,
    lastName: db.last_name,
    avatarUrl: db.avatar_url,
    diamonds: db.diamonds,
    level: db.level,
    xp: db.xp,
    xpToNext: db.xp_to_next,
    xpProgress: Math.min(progress, 100),
    streak: db.streak,
    bestStreak: db.best_streak,
    energy: db.energy,
    theme: db.theme as any,
  }
}

// ─── Tasks ─────────────────────────────────────────────────────────────────

export async function getTodayTasks(userId: string): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('created_at', { ascending: true })

  return (data ?? []).map(mapDbTaskToTask)
}

export async function completeTask(taskId: string, userId: string) {
  const { data } = await supabase
    .from('tasks')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single()

  if (data) {
    await updateUserXP(userId, data.xp_reward)
    // Also add diamonds
    await supabase.rpc('increment_diamonds', { user_id: userId, amount: data.diamond_reward })
  }
  return data
}

function mapDbTaskToTask(db: DbTask): Task {
  return {
    id: db.id,
    title: db.title,
    category: db.category as any,
    completed: db.completed,
    xpReward: db.xp_reward,
    diamondReward: db.diamond_reward,
    durationMinutes: db.duration_minutes,
    emoji: db.emoji,
    streakDays: db.streak_days,
  }
}

// ─── Wellness Logs ─────────────────────────────────────────────────────────

export async function upsertWellnessLog(
  userId: string,
  log: Partial<Omit<DbWellnessLog, 'id' | 'user_id' | 'created_at'>>
) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('wellness_logs')
    .upsert({
      user_id: userId,
      date: today,
      ...log,
    }, { onConflict: 'user_id,date' })
    .select()
    .single()

  return { data, error }
}

export async function getWellnessHistory(userId: string, days = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data } = await supabase
    .from('wellness_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  return data ?? []
}

// ─── Shop ──────────────────────────────────────────────────────────────────

export async function purchaseItem(userId: string, itemId: string, priceDiamonds: number) {
  // Check diamonds
  const { data: user } = await supabase
    .from('users')
    .select('diamonds')
    .eq('id', userId)
    .single()

  if (!user || user.diamonds < priceDiamonds) {
    return { success: false, error: 'Недостаточно кристаллов' }
  }

  // Deduct diamonds
  const { error: deductError } = await supabase
    .from('users')
    .update({ diamonds: user.diamonds - priceDiamonds })
    .eq('id', userId)

  if (deductError) return { success: false, error: 'Ошибка покупки' }

  // Add item
  const { error: itemError } = await supabase
    .from('user_items')
    .insert({ user_id: userId, item_id: itemId })

  return { success: !itemError }
}

export async function getUserItems(userId: string) {
  const { data } = await supabase
    .from('user_items')
    .select(`*, shop_items(*)`)
    .eq('user_id', userId)

  return data ?? []
}
