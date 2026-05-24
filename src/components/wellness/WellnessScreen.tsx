'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
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

const MEDITATIONS = [
  { id: 'm1', title: 'Утренняя ясность', subtitle: 'Мягкая медитация для пробуждения разума и сердца.', duration: 5, accent: 'purple', xp: 40, emoji: '🌅' },
  { id: 'm2', title: 'Отпускание дня', subtitle: 'Глубокое расслабление перед сном.', duration: 10, accent: 'pink', xp: 50, emoji: '🌙' },
  { id: 'm3', title: 'Поток настоящего', subtitle: 'Верни себя в момент здесь и сейчас.', duration: 3, accent: 'teal', xp: 25, emoji: '✨' },
  { id: 'm4', title: 'Сканирование тела', subtitle: 'Глубокое расслабление каждой клетки тела.', duration: 7, accent: 'purple', xp: 45, emoji: '🧘' },
]

const BREATH_PHASES = [
  { label: 'Вдох...', duration: 4000 },
  { label: 'Задержка...', duration: 7000 },
  { label: 'Выдох...', duration: 8000 },
  { label: 'Пауза...', duration: 2000 },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

export default function WellnessScreen() {
  const [activeTab, setActiveTab] = useState<WellnessTab>('meditations')
  const wellness = useAuraStore((s) => s.wellness)
  const setWellness = useAuraStore((s) => s.setWellness)
  const addXP = useAuraStore((s) => s.addXP)
  const showXPToast = useAuraStore((s) => s.showXPToast)
  const [selectedMood, setSelectedMood] = useState(wellness.mood)

  // Meditation timer
  const [activeMed, setActiveMed] = useState<string | null>(null)
  const [medSeconds, setMedSeconds] = useState(0)
  const [medTotal, setMedTotal] = useState(0)
  const medInterval = useRef<NodeJS.Timeout | null>(null)

  const startMeditation = (med: typeof MEDITATIONS[0]) => {
    if (activeMed === med.id) {
      if (medInterval.current) clearInterval(medInterval.current)
      setActiveMed(null)
      setMedSeconds(0)
      return
    }
    setActiveMed(med.id)
    setMedSeconds(0)
    setMedTotal(med.duration * 60)
    haptic('light')
    medInterval.current = setInterval(() => {
      setMedSeconds(prev => {
        if (prev + 1 >= med.duration * 60) {
          clearInterval(medInterval.current!)
          setActiveMed(null)
          addXP(med.xp)
          showXPToast(med.xp)
          haptic('success')
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => { if (medInterval.current) clearInterval(medInterval.current) }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Breathing
  const [breathPhase, setBreathPhase] = useState(-1)
  const breathTimer = useRef<NodeJS.Timeout | null>(null)

  const startBreathing = () => {
    if (breathPhase >= 0) {
      if (breathTimer.current) clearTimeout(breathTimer.current)
      setBreathPhase(-1)
      return
    }
    haptic('light')
    runPhase(0)
  }

  const runPhase = (phase: number) => {
    setBreathPhase(phase)
    breathTimer.current = setTimeout(() => runPhase((phase + 1) % BREATH_PHASES.length), BREATH_PHASES[phase].duration)
  }

  useEffect(() => {
    return () => { if (breathTimer.current) clearTimeout(breathTimer.current) }
  }, [])

  const ACCENT: Record<string, { bg: string; border: string; color: string }> = {
    purple: { bg: 'linear-gradient(135deg, var(--color-bg3), var(--color-card3))', border: 'var(--color-border2)', color: 'var(--color-lavender2)' },
    pink: { bg: 'linear-gradient(135deg, var(--color-pink-dim), var(--color-bg3))', border: 'rgba(232,164,200,0.2)', color: 'var(--color-pink2)' },
    teal: { bg: 'linear-gradient(135deg, rgba(42,85,80,0.3), var(--color-bg3))', border: 'rgba(125,201,192,0.2)', color: 'var(--color-teal2)' },
  }

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div variants={stagger.container} initial="initial" animate="animate" className="pb-6">

        <motion.div variants={stagger.item} className="px-5 pt-12 pb-4">
          <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
            Wellness <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Как ты сейчас?</SectionTitle>
          <div className="flex gap-2">
            {MOODS.map(({ level, emoji, label }) => (
              <button key={level}
                onClick={() => { setSelectedMood(level as any); setWellness({ mood: level as any }); haptic('light') }}
                className="flex-1 py-2.5 rounded-2xl text-center flex flex-col items-center gap-1 transition-all active:scale-95"
                style={{
                  background: selectedMood === level ? 'var(--color-purple-dim)' : 'var(--color-card)',
                  border: `1px solid ${selectedMood === level ? 'var(--color-purple)' : 'var(--color-border)'}`,
                }}>
                <span className="text-lg">{emoji}</span>
                <span className="text-[10px]" style={{ color: selectedMood === level ? 'var(--color-purple2)' : 'var(--color-text3)' }}>{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Tabs tabs={WELLNESS_TABS} active={activeTab} onChange={setActiveTab} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {activeTab === 'meditations' && (
              <div className="px-5 flex flex-col gap-3">
                {MEDITATIONS.map(med => {
                  const s = ACCENT[med.accent]
                  const isActive = activeMed === med.id
                  const progress = medTotal > 0 ? (medSeconds / medTotal) * 100 : 0
                  return (
                    <div key={med.id} className="rounded-2xl p-4 relative overflow-hidden"
                      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[11px] mb-1" style={{ color: 'var(--color-text3)' }}>
                            {med.emoji} {med.duration} мин · +{med.xp} XP
                          </p>
                          <h4 className="font-display text-[17px] font-normal mb-1" style={{ color: s.color }}>{med.title}</h4>
                          <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--color-text3)' }}>{med.subtitle}</p>
                        </div>
                      </div>

                      {isActive && (
                        <div className="mb-3">
                          <div className="text-2xl font-semibold text-center mb-2" style={{ color: s.color }}>
                            {formatTime(medTotal - medSeconds)}
                          </div>
                          <div className="xp-bar-track" style={{ height: 4 }}>
                            <div className="xp-bar-fill" style={{ width: `${progress}%`, height: '100%' }} />
                          </div>
                        </div>
                      )}

                      <button onClick={() => startMeditation(med)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium mt-2"
                        style={{ background: isActive ? 'rgba(232,164,200,0.15)' : 'var(--color-purple-dim)', color: s.color, border: `1px solid ${s.border}` }}>
                        {isActive ? '⏹ Остановить' : '▶ Начать сессию'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'sleep' && (
              <div className="px-5 flex flex-col gap-3">
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-3xl font-semibold" style={{ color: 'var(--color-lavender2)' }}>
                        {wellness.sleepHours}<span className="text-lg font-light ml-1" style={{ color: 'var(--color-text3)' }}>ч</span>
                      </div>
                      <div className="text-xs font-light mt-0.5" style={{ color: 'var(--color-text3)' }}>прошлой ночью</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-teal2)' }}>😊 Хорошо</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Глубокий', value: '2.1ч', color: 'var(--color-purple2)' },
                      { label: 'REM', value: '1.8ч', color: 'var(--color-teal2)' },
                      { label: 'Лёгкий', value: '3.6ч', color: 'var(--color-lavender)' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center rounded-xl py-2.5" style={{ background: 'var(--color-bg4)' }}>
                        <div className="text-sm font-semibold mb-0.5" style={{ color }}>{value}</div>
                        <div className="text-[10px]" style={{ color: 'var(--color-text3)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <SectionTitle className="mt-1">Звуки для сна</SectionTitle>
                {[
                  { icon: '🌧️', name: 'Дождь за окном', color: 'var(--color-teal2)' },
                  { icon: '🌊', name: 'Морские волны', color: 'var(--color-lavender)' },
                  { icon: '🌲', name: 'Лес ночью', color: 'var(--color-teal)' },
                ].map(({ icon, name, color }) => (
                  <Card key={name} className="flex items-center gap-3 px-4 py-3 mb-2" onClick={() => haptic('light')}>
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</div>
                    </div>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)' }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill={color}><path d="M2.5 1.5l8 4.5-8 4.5V1.5z"/></svg>
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'breathing' && (
              <div className="px-5 flex flex-col items-center gap-4">
                <p className="text-sm font-light text-center px-4" style={{ color: 'var(--color-text3)' }}>
                  Техника 4-7-8 снижает стресс и помогает заснуть
                </p>
                <div className="relative flex items-center justify-center my-4" style={{ width: 200, height: 200 }}>
                  <motion.div className="absolute inset-0 rounded-full"
                    style={{ border: '2px solid var(--color-purple)', opacity: breathPhase >= 0 ? 0.4 : 0.15 }}
                    animate={breathPhase >= 0 ? { scale: [1, 1.22, 1.22, 1], opacity: [0.4, 0.15, 0.15, 0.4] } : { scale: 1 }}
                    transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                  />
                  <motion.button onClick={startBreathing}
                    className="w-32 h-32 rounded-full flex flex-col items-center justify-center z-10"
                    style={{ background: 'linear-gradient(135deg, var(--color-purple-dim), var(--color-pink-dim))', border: '1.5px solid var(--color-border2)' }}
                    whileTap={{ scale: 0.95 }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-purple2)' }}>
                      {breathPhase < 0 ? '4-7-8' : BREATH_PHASES[breathPhase].label.replace('...', '')}
                    </span>
                    {breathPhase < 0 && <span className="text-xs font-light mt-0.5" style={{ color: 'var(--color-text3)' }}>нажми</span>}
                  </motion.button>
                </div>
                {breathPhase >= 0 && (
                  <motion.p key={breathPhase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="text-base font-medium" style={{ color: 'var(--color-lavender2)' }}>
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

            {activeTab === 'music' && (
              <div className="px-5 flex flex-col gap-3">
                {[
                  { icon: '🎵', name: 'Focus Flow', desc: 'Инструментал для глубокой работы', tag: 'Фокус', color: 'var(--color-purple2)' },
                  { icon: '🎶', name: 'Morning Ritual', desc: 'Мягкая музыка для пробуждения', tag: 'Утро', color: 'var(--color-gold)' },
                  { icon: '🎼', name: 'Evening Wind', desc: 'Успокаивающие мелодии вечером', tag: 'Вечер', color: 'var(--color-teal2)' },
                  { icon: '✨', name: 'Deep Rest', desc: 'Частоты для глубокого расслабления', tag: 'Сон', color: 'var(--color-lavender)' },
                ].map(({ icon, name, desc, tag, color }) => (
                  <Card key={name} className="flex items-center gap-3 px-4 py-3.5" onClick={() => haptic('light')}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--color-bg4)' }}>{icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</div>
                      <div className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>{desc}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                      style={{ background: 'var(--color-bg4)', color, border: '1px solid var(--color-border)' }}>{tag}</span>
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