'use client'

import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { getGreeting, getWeekDays, getMoodEmoji, formatNumber } from '@/lib/utils'
import { MOCK_WELLNESS } from '@/lib/mockData'
import { SectionTitle, XPBar, Card } from '@/components/ui'
import { useState } from 'react'
import TaskCard from '@/components/tasks/TaskCard'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  },
}

export default function HomeScreen() {
  const profile = useAuraStore((s) => s.profile)
const addXP = useAuraStore((s) => s.addXP)
const showXPToast = useAuraStore((s) => s.showXPToast)
  const tasks = useAuraStore((s) => s.tasks)
  const weeconst [habits, setHabits] = useState([
  { id: 'h1', emoji: '🧘', title: 'Медитация', streak: 0, done: false, xp: 30 },
  { id: 'h2', emoji: '🏃', title: 'Спорт', streak: 0, done: false, xp: 50 },
  { id: 'h3', emoji: '📚', title: 'Чтение', streak: 0, done: false, xp: 40 },
  { id: 'h4', emoji: '💧', title: 'Вода 2л', streak: 0, done: false, xp: 20 },
  { id: 'h5', emoji: '🌙', title: 'Сон до 23:00', streak: 0, done: false, xp: 25 },
])

const toggleHabit = (id: string) => {
  setHabits(prev => prev.map(h => {
    if (h.id !== id) return h
    if (!h.done) {
      addXP(h.xp)
      showXPToast(h.xp)
    }
    return { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }
  }))
}kDays = getWeekDays()

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length

  if (!profile) return null

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="pb-6"
      >
        {/* ── Header ── */}
        <motion.div variants={stagger.item} className="px-5 pt-12 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-light mb-1" style={{ color: 'var(--color-text4)' }}>
                {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })} ✦
              </p>
              <h1 className="font-display text-2xl leading-tight" style={{ color: 'var(--color-text)' }}>
                {getGreeting(profile.firstName).split(',')[0]},
              </h1>
              <h1 className="font-display text-2xl italic leading-tight" style={{ color: 'var(--color-purple2)' }}>
                {profile.firstName} ✨
              </h1>
            </div>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-purple3), var(--color-pink-dim))',
                border: '1.5px solid var(--color-border2)',
              }}
            >
              ✦
            </div>
          </div>
        </motion.div>

        {/* ── Stat Chips ── */}
        <motion.div variants={stagger.item}>
          <div className="flex gap-2 px-5 pb-5 overflow-x-auto scroll-hide">
            {[
              { icon: '🔥', value: `${profile.streak}`, label: 'дней' },
              { icon: '⚡', value: `${profile.energy}%`, label: 'энергия' },
              { icon: '💎', value: formatNumber(profile.diamonds), label: 'кристаллы' },
              { icon: '✦', value: `Lv ${profile.level}`, label: 'уровень' },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full"
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span className="text-sm">{icon}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{value}</span>
                <span className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── XP Progress Card ── */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Card gradient className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-display text-base font-normal"
                style={{ color: 'var(--color-lavender2)' }}
              >
                Путь к уровню {profile.level + 1}
              </h3>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  background: 'var(--color-purple-dim)',
                  color: 'var(--color-purple2)',
                  border: '1px solid var(--color-border2)',
                }}
              >
                {profile.xp} / {profile.xpToNext} XP
              </span>
            </div>
            <XPBar progress={profile.xpProgress} />
            <div className="flex justify-between mt-1.5 text-[11px]" style={{ color: 'var(--color-text3)' }}>
              <span>Уровень {profile.level}</span>
              <span>{profile.xpToNext - profile.xp} XP до следующего</span>
            </div>
          </Card>
        </motion.div>

        {/* ── Weekly Streak Calendar ── */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Серия этой недели</SectionTitle>
          <div className="flex gap-1.5 justify-between">
            {weekDays.map((day, i) => (
              <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px]" style={{ color: 'var(--color-text4)' }}>{day.dayLetter}</span>
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={
                    day.isToday
                      ? {
                          background: 'linear-gradient(135deg, var(--color-purple3), var(--color-pink-dim))',
                          color: 'white',
                          boxShadow: '0 0 12px rgba(155,138,232,0.4)',
                        }
                      : day.completed
                      ? {
                          background: 'var(--color-purple-dim)',
                          border: '1px solid var(--color-purple)',
                          color: 'var(--color-purple2)',
                        }
                      : {
                          background: 'var(--color-bg4)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text4)',
                        }
                  }
                >
                  {day.completed ? '✓' : day.dayNumber}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Today's Tasks ── */}
        <motion.div variants={stagger.item} className="px-5 pb-2">
          <SectionTitle right={`${completedCount}/${totalCount} выполнено`}>
            Сегодняшние задачи
          </SectionTitle>
        </motion.div>

        {tasks.slice(0, 5).map((task, i) => (
          <motion.div
            key={task.id}
            variants={stagger.item}
            className="px-5 pb-2"
          >
            <TaskCard task={task} />
          </motion.div>
        ))}

        {/* ── Wellness <motion.div variants={stagger.item} className="px-5 pt-2 pb-2">
  <SectionTitle>Привычки</SectionTitle>
  <div className="flex flex-col gap-2">
    {habits.map(habit => (
      <div
        key={habit.id}
        onClick={() => toggleHabit(habit.id)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
        style={{
          background: habit.done ? 'var(--color-purple-dim)' : 'var(--color-card)',
          border: `1px solid ${habit.done ? 'var(--color-purple)' : 'var(--color-border)'}`,
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: habit.done ? 'var(--color-purple)' : 'var(--color-bg4)' }}
        >
          {habit.done ? '✓' : habit.emoji}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium" style={{ color: habit.done ? 'var(--color-purple2)' : 'var(--color-text)' }}>
            {habit.title}
          </div>
          {habit.streak > 0 && (
            <div className="text-xs" style={{ color: 'var(--color-text3)' }}>
              🔥 {habit.streak} дней подряд
            </div>
          )}
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-gold)' }}>
          +{habit.xp} XP
        </span>
      </div>
    ))}
  </div>
</motion.div>Mini Stats ── */}

        <motion.div variants={stagger.item} className="px-5 pt-2 pb-2">
          <SectionTitle>Самочувствие сегодня</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🌙', value: `${MOCK_WELLNESS.sleepHours}ч`, label: 'Сон' },
              { icon: getMoodEmoji(MOCK_WELLNESS.mood), value: `${MOCK_WELLNESS.mood}/5`, label: 'Настрой' },
              { icon: '👣', value: formatNumber(MOCK_WELLNESS.steps), label: 'Шагов' },
              { icon: '💧', value: `${MOCK_WELLNESS.waterLiters}л`, label: 'Вода' },
            ].map(({ icon, value, label }) => (
              <Card key={label} className="p-3 text-center">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{value}</div>
                <div className="text-[10px] font-light" style={{ color: 'var(--color-text3)' }}>{label}</div>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
