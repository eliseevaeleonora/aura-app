'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import type { TaskCategory } from '@/types'
import TaskCard from './TaskCard'
import { SectionTitle, Tabs, Button } from '@/components/ui'

const CATEGORIES: { value: TaskCategory; label: string; emoji: string; color: string }[] = [
  { value: 'mandatory', label: 'Обязательные', emoji: '⭐', color: 'var(--color-purple)' },
  { value: 'work', label: 'Работа', emoji: '💼', color: 'var(--color-gold)' },
  { value: 'wellness', label: 'Wellness', emoji: '🌸', color: 'var(--color-teal)' },
  { value: 'personal', label: 'Личное', emoji: '💕', color: 'var(--color-pink)' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
}

export default function TasksScreen() {
  const tasks = useAuraStore((s) => s.tasks)
  const completed = tasks.filter((t) => t.completed).length

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="pb-6"
      >
        {/* Header */}
        <motion.div variants={stagger.item} className="px-5 pt-12 pb-5">
          <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
            Задачи <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
          <p className="text-xs font-light mt-1" style={{ color: 'var(--color-text3)' }}>
            {completed} из {tasks.length} выполнено сегодня
          </p>
        </motion.div>

        {/* Progress overview */}
        <motion.div variants={stagger.item} className="px-5 pb-5">
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, var(--color-bg3), var(--color-card3))',
              border: '1px solid var(--color-border2)',
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-lavender2)' }}>
                Прогресс дня
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text3)' }}>
                {Math.round((completed / Math.max(tasks.length, 1)) * 100)}%
              </span>
            </div>
            <div className="xp-bar-track" style={{ height: 7 }}>
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(completed / Math.max(tasks.length, 1)) * 100}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tasks by category */}
        {CATEGORIES.map(({ value, label, emoji, color }) => {
          const catTasks = tasks.filter((t) => t.category === value)
          if (catTasks.length === 0) return null

          return (
            <motion.div key={value} variants={stagger.item}>
              {/* Category header */}
              <div className="flex items-center gap-2 px-5 py-2">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--color-text4)' }}
                >
                  {emoji} {label}
                </span>
                <span
                  className="text-[11px] ml-auto"
                  style={{ color: 'var(--color-text4)' }}
                >
                  {catTasks.filter((t) => t.completed).length}/{catTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="px-5 flex flex-col gap-2 mb-2">
                {catTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* Add task button */}
        <motion.div variants={stagger.item} className="px-5 pt-2">
          <button
            className="w-full rounded-[18px] py-3.5 flex items-center justify-center gap-2 text-sm transition-all active:scale-98"
            style={{
              background: 'transparent',
              border: '1px dashed var(--color-border2)',
              color: 'var(--color-text3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="7" />
              <path d="M8 5v6M5 8h6" />
            </svg>
            Добавить задачу
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
