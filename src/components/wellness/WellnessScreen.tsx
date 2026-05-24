'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { MOCK_MEDITATIONS } from '@/lib/mockData'
import { getMoodEmoji, getMoodLabel } from '@/lib/utils'
import { haptic } from '@/lib/telegram'
import { SectionTitle, Card, Tabs } from '@/components/ui'
import type { WellnessTab } from '@/types'

const WELLNESS_TABS: { value: WellnessTab; label: string }[] = [
  { value: 'meditations', label: 'Медитации' },
  { value: 'sleep', label: 'Сон' },
  { value: 'breathing', label: 'Дыхание' },
  { value: 'music', label: 'Музыка' },
]

const MOODS = [
  { level: 1, emoji: '😔', label: 'Тяжело' },
  { level: 2, emoji: '😐', label: 'Нейтрально' },
  { level: 3, emoji: '🙂', label: 'Хорошо' },
  { level: 4, emoji: '😊', label: 'Отлично' },
  { level: 5, emoji: '✨', label: 'Прекрасно' },
]

const BREATH_PHASES = [
  { label: 'Вдох...', duration: 4000, scale: 1.22 },
  { label: 'Задержка...', duration: 7000, scale: 1.22 },
  { label: 'Выдох...', duration: 8000, scale: 1 },
  { label: 'Пауза...', duration: 2000, scale: 1 },
]

const ACCENT_STYLES: Record<string, { bg: string; border: string; color: string; playBg: string; playColor: string }> = {
  purple: {
    bg: 'linear-gradient(135deg, var(--color-bg3), var(--color-card3))',
    border: 'var(--color-border2)',
    color: 'var(--color-lavender2)',
    playBg: 'var(--color-purple-dim)',
    playColor: 'var(--color-purple2)',
  },
  pink: {
    bg: 'linear-gradient(135deg, var(--color-pink-dim), var(--color-bg3))',
    border: 'rgba(232,164,200,0.2)',
    color: 'var(--color-pink2)',
    playBg: 'rgba(107,58,84,0.5)',
    playColor: 'var(--color-pink2)',
  },
  teal: {
    bg: 'linear-gradient(135deg, rgba(42,85,80,0.3), var(--color-bg3))',
    border: 'rgba(125,201,192,0.2)',
    color: 'var(--color-teal2)',
    playBg: 'rgba(42,85,80,0.5)',
    playColor: 'var(--color-teal2)',
  },
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

export default function WellnessScreen() {
  const [activeTab, setActiveTab] = useState<WellnessTab>('meditations')
  const wellness = useAuraStore((s) => s.wellness)
  const setWellness = useAuraStore((s) => s.setWellness)
  const [selectedMood, setSelectedMood] = useState(wellness.mood)
  const [breathPhase, setBreathPhase] = useState(-1) // -1 = idle
  const [breathScale, setBreathScale] = useState(1)
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null)

  const startBreathing = () => {
    if (breathPhase >= 0) {
      // Stop
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current)
      setBreathPhase(-1)
      setBreathScale(1)
      return
    }
    haptic('light')
    runBreathPhase(0)
  }

  const runBreathPhase = (phase: number) => {
    setBreathPhase(phase)
    setBreathScale(BREATH_PHASES[phase].scale)
    breathTimerRef.current = setTimeout(() => {
      runBreathPhase((phase + 1) % BREATH_PHASES.length)
    }, BREATH_PHASES[phase].duration)
  }

  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current)
    }
  }, [])

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="pb-6"
      >
        {/* Header */}
        <motion.div variants={stagger.item} className="px-5 pt-12 pb-4">
          <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
            Wellness <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
        </motion.div>

        {/* Mood check-in */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Как ты сейчас?</SectionTitle>
          <div className="flex gap-2">
            {MOODS.map(({ level, emoji, label }) => (
              <button
                key={level}
                onClick={() => {
                  setSelectedMood(level as any)
                  setWellness({ mood: level as any })
                  haptic('light')
                }}
                className="flex-1 py-2.5 rounded-2xl text-center flex flex-col items-center gap-1 transition-all active:scale-95"
                style={{
                  background: selectedMood === level ? 'var(--color-purple-dim)' : 'var(--color-card)',
                  border: `1px solid ${selectedMood === level ? 'var(--color-purple)' : 'var(--color-border)'}`,
                }}
              >
                <span className="text-lg">{emoji}</span>
                <span
                  className="text-[10px]"
                  style={{ color: selectedMood === level ? 'var(--color-purple2)' : 'var(--color-text3)' }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Tabs tabs={WELLNESS_TABS} active={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Content by tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* MEDITATIONS */}
            {activeTab === 'meditations' && (
              <div className="px-5 flex flex-col gap-3">
                {MOCK_MEDITATIONS.map((med) => {
                  const style = ACCENT_STYLES[med.accent]
                  return (
                    <div
                      key={med.id}
                      className="rounded-2xl p-4 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                      style={{ background: style.bg, border: `1px solid ${style.border}` }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
                        style={{ background: style.color, transform: 'translate(20%, -20%)' }}
                      />
                      <p className="text-[11px] mb-1.5" style={{ color: 'var(--color-text3)' }}>
                        {med.durationMinutes} мин · {
                          med.timeOfDay === 'morning' ? 'Утро' :
                          med.timeOfDay === 'evening' ? 'Вечер' : 'Любое время'
                        }
                      </p>
                      <h4
                        className="font-display text-[17px] font-normal mb-1.5"
                        style={{ color: style.color }}
                      >
                        {med.title}
                      </h4>
                      <p className="text-xs font-light leading-relaxed mb-3"
                        style={{ color: 'var(--color-text3)' }}>
                        {med.subtitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium"
                          style={{ background: style.playBg, color: style.playColor, border: `1px solid ${style.border}` }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M2.5 1.5l8 4.5-8 4.5V1.5z" />
                          </svg>
                          Начать сессию
                        </button>
                        <span className="text-[11px]" style={{ color: 'var(--color-gold)' }}>
                          +{med.xpReward} XP
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* SLEEP */}
            {activeTab === 'sleep' && (
              <div className="px-5 flex flex-col gap-3">
                {/* Sleep summary */}
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div
                        className="text-3xl font-semibold"
                        style={{ color: 'var(--color-lavender2)' }}
                      >
                        {wellness.sleepHours}
                        <span className="text-lg font-light ml-1" style={{ color: 'var(--color-text3)' }}>ч</span>
                      </div>
                      <div className="text-xs font-light mt-0.5" style={{ color: 'var(--color-text3)' }}>
                        прошлой ночью
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-teal2)' }}>
                        😊 Хорошо
                      </div>
                      <div className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>
                        23:14 — 06:47
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Глубокий', value: '2.1ч', color: 'var(--color-purple2)' },
                      { label: 'REM', value: '1.8ч', color: 'var(--color-teal2)' },
                      { label: 'Лёгкий', value: '3.6ч', color: 'var(--color-lavender)' },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="text-center rounded-xl py-2.5"
                        style={{ background: 'var(--color-bg4)' }}
                      >
                        <div className="text-sm font-semibold mb-0.5" style={{ color }}>{value}</div>
                        <div className="text-[10px]" style={{ color: 'var(--color-text3)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sleep sounds */}
                <SectionTitle className="mt-1">Звуки для сна</SectionTitle>
                {[
                  { icon: '🌧️', name: 'Дождь за окном', duration: '∞', color: 'var(--color-teal2)' },
                  { icon: '🌊', name: 'Морские волны', duration: '∞', color: 'var(--color-lavender)' },
                  { icon: '🌲', name: 'Лес ночью', duration: '∞', color: 'var(--color-teal)' },
                ].map(({ icon, name, duration, color }) => (
                  <Card
                    key={name}
                    className="flex items-center gap-3 px-4 py-3 mb-2"
                    onClick={() => haptic('light')}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text3)' }}>{duration}</div>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill={color}>
                        <path d="M2.5 1.5l8 4.5-8 4.5V1.5z" />
                      </svg>
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {/* BREATHING */}
            {activeTab === 'breathing' && (
              <div className="px-5 flex flex-col items-center gap-4">
                <p className="text-sm font-light text-center px-4" style={{ color: 'var(--color-text3)' }}>
                  Техника 4-7-8 снижает стресс и помогает заснуть
                </p>

                {/* Breath circle */}
                <div className="relative flex items-center justify-center my-4" style={{ width: 200, height: 200 }}>
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '2px solid var(--color-purple)', opacity: breathPhase >= 0 ? 0.4 : 0.15 }}
                    animate={breathPhase >= 0 ? { scale: breathScale, opacity: [0.4, 0.15, 0.4] } : { scale: 1 }}
                    transition={{ duration: (BREATH_PHASES[breathPhase >= 0 ? breathPhase : 0]?.duration ?? 1000) / 1000, ease: 'easeInOut' }}
                  />

                  {/* Main circle */}
                  <motion.button
                    onClick={startBreathing}
                    className="w-32 h-32 rounded-full flex flex-col items-center justify-center cursor-pointer z-10"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-purple-dim), var(--color-pink-dim))',
                      border: '1.5px solid var(--color-border2)',
                    }}
                    animate={breathPhase >= 0 ? { scale: breathScale } : { scale: 1 }}
                    transition={{ duration: (BREATH_PHASES[breathPhase >= 0 ? breathPhase : 0]?.duration ?? 1000) / 1000, ease: 'easeInOut' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-purple2)' }}>
                      {breathPhase < 0 ? '4-7-8' : BREATH_PHASES[breathPhase].label.replace('...', '')}
                    </span>
                    {breathPhase < 0 && (
                      <span className="text-xs font-light mt-0.5" style={{ color: 'var(--color-text3)' }}>
                        нажми
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Phase indicator */}
                {breathPhase >= 0 && (
                  <motion.p
                    key={breathPhase}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base font-medium"
                    style={{ color: 'var(--color-lavender2)' }}
                  >
                    {BREATH_PHASES[breathPhase].label}
                  </motion.p>
                )}

                <div className="flex gap-6 text-center mt-2">
                  {[
                    { label: 'Вдох', seconds: '4с', color: 'var(--color-purple2)' },
                    { label: 'Задержка', seconds: '7с', color: 'var(--color-lavender)' },
                    { label: 'Выдох', seconds: '8с', color: 'var(--color-teal2)' },
                  ].map(({ label, seconds, color }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold" style={{ color }}>{seconds}</span>
                      <span className="text-[11px] font-light" style={{ color: 'var(--color-text3)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MUSIC */}
            {activeTab === 'music' && (
              <div className="px-5 flex flex-col gap-3">
                {[
                  { icon: '🎵', name: 'Focus Flow', desc: 'Инструментал для глубокой работы', tag: 'Фокус', color: 'var(--color-purple2)' },
                  { icon: '🎶', name: 'Morning Ritual', desc: 'Мягкая музыка для пробуждения', tag: 'Утро', color: 'var(--color-gold)' },
                  { icon: '🎼', name: 'Evening Wind', desc: 'Успокаивающие мелодии вечером', tag: 'Вечер', color: 'var(--color-teal2)' },
                  { icon: '✨', name: 'Deep Rest', desc: 'Частоты для глубокого расслабления', tag: 'Сон', color: 'var(--color-lavender)' },
                ].map(({ icon, name, desc, tag, color }) => (
                  <Card
                    key={name}
                    className="flex items-center gap-3 px-4 py-3.5"
                    onClick={() => haptic('light')}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'var(--color-bg4)' }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</div>
                      <div className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>{desc}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        style={{
                          background: 'var(--color-bg4)',
                          color,
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {tag}
                      </span>
                      <button className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)' }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill={color}>
                          <path d="M2.5 1.5l8 4.5-8 4.5V1.5z" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
