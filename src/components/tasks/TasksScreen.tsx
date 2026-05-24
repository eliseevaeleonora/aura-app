Давай полностью перепишем проблемные файлы. Начнём с AppShell:
cmdnotepad src\components\layout\AppShell.tsx
Нажми Ctrl+A → удали всё → вставь:
tsx'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import BottomNav from './BottomNav'
import XPToast from '@/components/ui/XPToast'
import HomeScreen from '@/components/home/HomeScreen'
import TasksScreen from '@/components/tasks/TasksScreen'
import AnalyticsScreen from '@/components/analytics/AnalyticsScreen'
import WellnessScreen from '@/components/wellness/WellnessScreen'
import ShopScreen from '@/components/shop/ShopScreen'
import ProfileScreen from '@/components/profile/ProfileScreen'

const screens: Record<string, React.ComponentType> = {
  home: HomeScreen,
  tasks: TasksScreen,
  analytics: AnalyticsScreen,
  wellness: WellnessScreen,
  shop: ShopScreen,
  profile: ProfileScreen,
}

export default function AppShell() {
  const activeTab = useAuraStore((s) => s.activeTab)
  const xpToast = useAuraStore((s) => s.xpToast)
  const profile = useAuraStore((s) => s.profile)

  if (!profile) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0b14',
        gap: 12,
      }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#c4b8f7' }}>✦</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#e8e4fa' }}>Aura</div>
        <div style={{ fontSize: 13, color: '#5a5278' }}>загрузка...</div>
      </div>
    )
  }

  const ActiveScreen = screens[activeTab] ?? HomeScreen

  return (
    <div className="flex flex-col h-full w-full overflow-hidden"
      style={{ background: '#0d0b14' }}>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="h-full"
          >
            <ActiveScreen />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
      <XPToast visible={xpToast.visible} amount={xpToast.amount} label={xpToast.label} />
    </div>
  )
}
Сохрани. Теперь исправим добавление задач:
cmdnotepad src\components\tasks\TasksScreen.tsx
Нажми Ctrl+A → удали всё → вставь:
tsx'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import type { TaskCategory, Task } from '@/types'
import TaskCard from './TaskCard'
import { SectionTitle, Tabs, Card } from '@/components/ui'

const CATEGORIES: { value: TaskCategory; label: string; emoji: string; color: string }[] = [
  { value: 'mandatory', label: 'Обязательные', emoji: '⭐', color: 'var(--color-purple)' },
  { value: 'work', label: 'Работа', emoji: '💼', color: 'var(--color-gold)' },
  { value: 'wellness', label: 'Wellness', emoji: '🌸', color: 'var(--color-teal)' },
  { value: 'personal', label: 'Личное', emoji: '💕', color: 'var(--color-pink)' },
]

const CATEGORY_EMOJIS: Record<TaskCategory, string> = {
  mandatory: '⭐',
  work: '💼',
  wellness: '🌸',
  personal: '💕',
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

export default function TasksScreen() {
  const tasks = useAuraStore((s) => s.tasks)
  const addTask = useAuraStore((s) => s.addTask)
  const completed = tasks.filter((t) => t.completed).length

  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<TaskCategory>('personal')
  const [newDuration, setNewDuration] = useState('30')

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      xpReward: newCategory === 'work' ? 60 : newCategory === 'mandatory' ? 40 : 30,
      diamondReward: 3,
      durationMinutes: parseInt(newDuration) || 30,
      emoji: CATEGORY_EMOJIS[newCategory],
      streakDays: 0,
    }
    addTask(task)
    setNewTitle('')
    setNewDuration('30')
    setShowForm(false)
  }

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="pb-6"
      >
        <motion.div variants={stagger.item} className="px-5 pt-12 pb-5">
          <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
            Задачи <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
          <p className="text-xs font-light mt-1" style={{ color: 'var(--color-text3)' }}>
            {completed} из {tasks.length} выполнено сегодня
          </p>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-5">
          <div className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, var(--color-bg3), var(--color-card3))', border: '1px solid var(--color-border2)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-lavender2)' }}>Прогресс дня</span>
              <span className="text-xs" style={{ color: 'var(--color-text3)' }}>
                {tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="xp-bar-track" style={{ height: 7 }}>
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </motion.div>

        {CATEGORIES.map(({ value, label, emoji, color }) => {
          const catTasks = tasks.filter((t) => t.category === value)
          if (catTasks.length === 0) return null
          return (
            <motion.div key={value} variants={stagger.item}>
              <div className="flex items-center gap-2 px-5 py-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text4)' }}>
                  {emoji} {label}
                </span>
                <span className="text-[11px] ml-auto" style={{ color: 'var(--color-text4)' }}>
                  {catTasks.filter(t => t.completed).length}/{catTasks.length}
                </span>
              </div>
              <div className="px-5 flex flex-col gap-2 mb-2">
                {catTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            </motion.div>
          )
        })}

        <motion.div variants={stagger.item} className="px-5 pt-2">
          {showForm && (
            <div className="rounded-2xl p-4 mb-3"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border2)' }}>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Название задачи..."
                className="w-full bg-transparent text-sm mb-3 outline-none"
                style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border2)', paddingBottom: 8 }}
                autoFocus
              />
              <div className="flex gap-2 mb-3">
                {CATEGORIES.map(({ value, emoji, color }) => (
                  <button key={value}
                    onClick={() => setNewCategory(value)}
                    className="flex-1 py-2 rounded-xl text-sm transition-all"
                    style={{
                      background: newCategory === value ? 'var(--color-purple-dim)' : 'var(--color-bg4)',
                      border: `1px solid ${newCategory === value ? 'var(--color-purple)' : 'var(--color-border)'}`,
                    }}>
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs" style={{ color: 'var(--color-text3)' }}>Время (мин):</span>
                <input
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}
                  type="number"
                  className="w-16 bg-transparent text-sm outline-none text-center"
                  style={{ color: 'var(--color-text)', border: '1px solid var(--color-border2)', borderRadius: 8, padding: '4px 8px' }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--color-purple-dim)', color: 'var(--color-purple2)', border: '1px solid var(--color-purple)' }}>
                  Добавить ✓
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm"
                  style={{ color: 'var(--color-text3)', border: '1px solid var(--color-border)' }}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm transition-all active:scale-98"
            style={{ background: 'transparent', border: '1px dashed var(--color-border2)', color: 'var(--color-text3)' }}>
            + Добавить задачу
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}