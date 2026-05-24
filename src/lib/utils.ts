import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfWeek, addDays, isToday, isBefore, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { StreakDay } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekDays(): StreakDay[] {
  const today = new Date()
  const start = startOfWeek(today, { weekStartsOn: 1 }) // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i)
    const dayLetters = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'd MMM', { locale: ru }),
      dayLetter: dayLetters[i],
      completed: isBefore(date, today) && !isToday(date),
      isToday: isToday(date),
      dayNumber: date.getDate(),
    }
  })
}

export function formatDate(date: string | Date, fmt = 'd MMMM'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: ru })
}

export function getGreeting(firstName: string): string {
  const hour = new Date().getHours()
  if (hour < 5) return `Не спится, ${firstName}? 🌙`
  if (hour < 12) return `Доброе утро, ${firstName} ✨`
  if (hour < 17) return `Привет, ${firstName} ✨`
  if (hour < 21) return `Добрый вечер, ${firstName} 🌸`
  return `Спокойной ночи, ${firstName} 🌙`
}

export function getMoodEmoji(mood: number): string {
  const moods = ['', '😔', '😐', '🙂', '😊', '✨']
  return moods[mood] ?? '😊'
}

export function getMoodLabel(mood: number): string {
  const labels = ['', 'Тяжело', 'Нейтрально', 'Хорошо', 'Отлично', 'Прекрасно']
  return labels[mood] ?? 'Хорошо'
}

export function getLevelTitle(level: number): string {
  const titles = [
    '', 'Начало пути', 'Пробуждение', 'Становление', 'Равновесие',
    'Гармония', 'Сияние', 'Вознесение', 'Просветление', 'Мудрость', 'Мастер ауры',
  ]
  return titles[Math.min(level, titles.length - 1)] ?? `Уровень ${level}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}ч ${m}мин` : `${h} ч`
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
