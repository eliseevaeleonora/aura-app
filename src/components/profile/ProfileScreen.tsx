'use client'

import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { MOCK_ACHIEVEMENTS } from '@/lib/mockData'
import { getLevelTitle, formatNumber } from '@/lib/utils'
import { SectionTitle, XPBar, Card } from '@/components/ui'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

export default function ProfileScreen() {
  const profile = useAuraStore((s) => s.profile)
  if (!profile) return null

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="pb-6"
      >
        {/* Avatar & name */}
        <motion.div variants={stagger.item} className="flex flex-col items-center pt-14 pb-6 px-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3"
            style={{
              background: 'linear-gradient(135deg, var(--color-purple3), var(--color-pink-dim))',
              border: '2px solid var(--color-border2)',
              boxShadow: '0 0 32px rgba(155,138,232,0.3)',
            }}
          >
            ✦
          </div>
          <h2 className="font-display text-2xl font-normal mb-0.5" style={{ color: 'var(--color-text)' }}>
            {profile.firstName}
          </h2>
          <p className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>
            Уровень {profile.level} · {getLevelTitle(profile.level)} ✨
          </p>
        </motion.div>

        {/* XP bar */}
        <motion.div variants={stagger.item} className="px-5 pb-5">
          <XPBar progress={profile.xpProgress} />
          <div className="flex justify-between mt-1.5 text-[11px]" style={{ color: 'var(--color-text3)' }}>
            <span>{profile.xp.toLocaleString()} XP</span>
            <span>До уровня {profile.level + 1}: {(profile.xpToNext - profile.xp).toLocaleString()} XP</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div variants={stagger.item} className="px-5 pb-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: '🔥', value: profile.streak, label: 'Дней серии' },
              { emoji: '💎', value: formatNumber(profile.diamonds), label: 'Кристаллы' },
              { emoji: '⭐', value: 47, label: 'Задач всего' },
              { emoji: '🧘', value: 21, label: 'Медитаций' },
              { emoji: '🏃', value: 14, label: 'Тренировок' },
              { emoji: '📚', value: 8, label: 'Книг' },
            ].map(({ emoji, value, label }) => (
              <Card key={label} className="p-3 text-center">
                <div className="text-lg mb-0.5">{emoji} {value}</div>
                <div className="text-[10px] font-light" style={{ color: 'var(--color-text3)' }}>{label}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={stagger.item} className="px-5 pb-5">
          <SectionTitle>Достижения</SectionTitle>
          <div className="flex gap-2 overflow-x-auto scroll-hide pb-1">
            {MOCK_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className="flex-shrink-0 flex flex-col items-center text-center p-3 rounded-2xl min-w-[72px]"
                style={{
                  background: ach.earned ? 'rgba(232,201,122,0.07)' : 'var(--color-card)',
                  border: `1px solid ${ach.earned ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  opacity: ach.earned ? 1 : 0.6,
                }}
              >
                <span className="text-2xl mb-1.5 block">{ach.emoji}</span>
                <span
                  className="text-[10px] font-light leading-tight block"
                  style={{ color: ach.earned ? 'var(--color-gold2)' : 'var(--color-text3)' }}
                >
                  {ach.title}
                </span>
                {!ach.earned && ach.progress !== undefined && ach.target && (
                  <span className="text-[9px] mt-1 block" style={{ color: 'var(--color-text4)' }}>
                    {ach.progress}/{ach.target}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div variants={stagger.item} className="px-5">
          <SectionTitle>Настройки</SectionTitle>
          <div className="flex flex-col gap-2">
            {[
              { icon: '🔔', label: 'Уведомления', value: 'Включены' },
              { icon: '🎨', label: 'Тема', value: 'Midnight', accent: true },
              { icon: '🌍', label: 'Язык', value: 'Русский' },
              { icon: '🔒', label: 'Конфиденциальность', value: '→' },
            ].map(({ icon, label, value, accent }) => (
              <Card
                key={label}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer"
              >
                <span className="text-sm" style={{ color: 'var(--color-text2)' }}>
                  {icon} {label}
                </span>
                <span
                  className="text-xs"
                  style={{ color: accent ? 'var(--color-purple2)' : 'var(--color-text3)' }}
                >
                  {value}
                </span>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
