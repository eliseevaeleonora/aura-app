'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { haptic } from '@/lib/telegram'
import { formatDuration } from '@/lib/utils'
import type { Task, TaskCategory } from '@/types'

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  mandatory: 'var(--color-purple)',
  work: 'var(--color-gold)',
  personal: 'var(--color-pink)',
  wellness: 'var(--color-teal)',
}

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const toggleTask = useAuraStore((s) => s.toggleTask)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (task.completed) return
    setIsAnimating(true)
    haptic('medium')
    toggleTask(task.id)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const accent = CATEGORY_COLORS[task.category]

  return (
    <motion.div
      layout
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        opacity: task.completed ? 0.6 : 1,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: accent }}
      />

      <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border transition-all"
          animate={isAnimating ? { scale: [1, 1.3, 0.9, 1] } : {}}
          transition={{ duration: 0.35 }}
          style={{
            background: task.completed ? 'var(--color-purple)' : 'transparent',
            borderColor: task.completed ? 'var(--color-purple)' : 'var(--color-border2)',
          }}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                width="12" height="12" viewBox="0 0 12 12" fill="none"
              >
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-medium leading-snug"
            style={{
              color: task.completed ? 'var(--color-text3)' : 'var(--color-text)',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.emoji} {task.title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px]" style={{ color: 'var(--color-text3)' }}>
              {formatDuration(task.durationMinutes)}
            </span>
            {task.streakDays > 0 && (
              <span className="text-[11px]" style={{ color: 'var(--color-text4)' }}>
                🔥 {task.streakDays} дн
              </span>
            )}
          </div>
        </div>

        {/* XP Badge */}
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded-lg flex-shrink-0"
          style={{
            background: 'rgba(232,201,122,0.1)',
            color: 'var(--color-gold)',
            border: '1px solid rgba(232,201,122,0.2)',
          }}
        >
          +{task.xpReward} XP
        </span>
      </div>
    </motion.div>
  )
}
