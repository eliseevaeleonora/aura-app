'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import type { TaskCategory, Task } from '@/types'
import TaskCard from './TaskCard'
import { SectionTitle, Card } from '@/components/ui'

const CATEGORIES: { value: TaskCategory; label: string; emoji: string; color: string }[] = [
  { value: 'mandatory', label: 'Обязательные', emoji: '⭐', color: 'var(--color-purple)' },
  { value: 'work', label: 'Работа', emoji: '💼', color: 'var(--color-gold)' },
  { value: 'wellness', label: 'Wellness', emoji: '🌸', color: 'var(--color-teal)' },
  { value: 'personal', label: 'Личное', emoji: '💕', color: 'var(--color-pink)' },
]

const CATEGORY_EMOJIS: Record<TaskCategory, string> = {
  mandatory: '⭐', work: '💼', wellness: '🌸', personal: '💕',
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
    addTask({
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      xpReward: newCategory === 'work' ? 60 : newCategory === 'mandatory' ? 40 : 30,
      diamondReward: 3,
      durationMinutes: parseInt(newDuration) || 30,
      emoji: CATEGORY_EMOJIS[newCategory],
      streakDays: 0,
    })
    setNewTitle('')
    setNewDuration('30')
    setShowForm(false)
  }

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div variants={stagger.container} initial="initial" animate="animate" className="pb-6">

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
              <motion.div className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 1 }}
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
                {CATEGORIES.map(({ value, emoji }) => (
                  <button key={value} onClick={() => setNewCategory(value)}
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
                <input value={newDuration} onChange={e => setNewDuration(e.target.value)} type="number"
                  className="w-16 bg-transparent text-sm outline-none text-center"
                  style={{ color: 'var(--color-text)', border: '1px solid var(--color-border2)', borderRadius: 8, padding: '4px 8px' }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--color-purple-dim)', color: 'var(--color-purple2)', border: '1px solid var(--color-purple)' }}>
                  Добавить ✓
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm"
                  style={{ color: 'var(--color-text3)', border: '1px solid var(--color-border)' }}>
                  Отмена
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setShowForm(!showForm)}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm transition-all"
            style={{ background: 'transparent', border: '1px dashed var(--color-border2)', color: 'var(--color-text3)' }}>
            + Добавить задачу
          </button>
        </motion.div>

      </motion.div>
    </div>
  )
}