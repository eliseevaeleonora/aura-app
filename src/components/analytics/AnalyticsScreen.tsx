'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { useAuraStore } from '@/store/useAuraStore'
import { MOCK_ANALYTICS, AI_INSIGHTS } from '@/lib/mockData'
import { SectionTitle, Tabs, Card, ProgressBar } from '@/components/ui'
import type { AnalyticsPeriod } from '@/types'

const PERIOD_TABS = [
  { value: 'week' as AnalyticsPeriod, label: 'Неделя' },
  { value: 'month' as AnalyticsPeriod, label: 'Месяц' },
  { value: 'year' as AnalyticsPeriod, label: 'Год' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-xs"
      style={{ background: 'var(--color-card3)', border: '1px solid var(--color-border2)', color: 'var(--color-text2)' }}>
      {label}: <strong>{payload[0].value}%</strong>
    </div>
  )
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('week')
  const tasks = useAuraStore((s) => s.tasks)
  const wellness = useAuraStore((s) => s.wellness)
  const setWellness = useAuraStore((s) => s.setWellness)
  const addXP = useAuraStore((s) => s.addXP)
  const showXPToast = useAuraStore((s) => s.showXPToast)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  const completedTasks = tasks.filter(t => t.completed)
  const totalXP = completedTasks.reduce((sum, t) => sum + t.xpReward, 0)

  const data = {
    ...MOCK_ANALYTICS,
    totalTasks: completedTasks.length,
    totalXP,
  }

  const saveNote = () => {
    if (!note.trim()) return
    setNoteSaved(true)
    addXP(15)
    showXPToast(15)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  return (
    <div className="h-full overflow-y-auto scroll-hide">
      <motion.div variants={stagger.container} initial="initial" animate="animate" className="pb-6">

        <motion.div variants={stagger.item} className="px-5 pt-12 pb-4">
          <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
            Аналитика <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Tabs tabs={PERIOD_TABS} active={period} onChange={setPeriod} />
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Всего XP', value: totalXP > 0 ? totalXP.toLocaleString() : '0', emoji: '⭐' },
              { label: 'Задач сделано', value: completedTasks.length.toString(), emoji: '✅' },
              { label: 'Средн. настрой', value: `${data.avgMood.toFixed(1)}/5`, emoji: '😊' },
              { label: 'Средн. сон', value: `${data.avgSleep}ч`, emoji: '🌙' },
            ].map(({ label, value, emoji }) => (
              <Card key={label} className="p-4">
                <div className="text-base mb-0.5">{emoji}</div>
                <div className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{value}</div>
                <div className="text-[11px] font-light" style={{ color: 'var(--color-text3)' }}>{label}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Card className="p-4">
            <h3 className="font-display text-[15px] font-normal mb-4" style={{ color: 'var(--color-lavender2)' }}>
              Активность по дням
            </h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={data.activity} barSize={24}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--color-purple3)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Card className="p-4">
            <h3 className="font-display text-[15px] font-normal mb-4" style={{ color: 'var(--color-lavender2)' }}>
              Настроение
            </h3>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={data.mood}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-teal)" strokeWidth={2}
                  dot={{ fill: 'var(--color-teal)', r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Прогресс привычек</SectionTitle>
          <Card className="p-4 flex flex-col gap-4">
            {data.habitProgress.map(({ name, emoji, completed, target }) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm" style={{ color: 'var(--color-text2)' }}>{emoji} {name}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text3)' }}>{completed}/{target} дней</span>
                </div>
                <ProgressBar value={Math.round((completed / target) * 100)} />
              </div>
            ))}
          </Card>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>AI Инсайты ✨</SectionTitle>
          <div className="flex flex-col gap-3">
            {AI_INSIGHTS.slice(0, 2).map((insight, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, var(--color-purple-dim), var(--color-pink-dim))'
                    : 'linear-gradient(135deg, var(--color-pink-dim), var(--color-bg3))',
                  border: '1px solid var(--color-border2)',
                }}>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-purple2)' }}>
                  ✨ AI Инсайт
                </div>
                <p className="text-[13px] font-light leading-relaxed" style={{ color: 'var(--color-lavender2)' }}>{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Дневник настроения</SectionTitle>
          <Card className="p-4">
            <div className="flex gap-2 mb-3 justify-between">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button key={mood} onClick={() => setWellness({ mood: mood as any })}
                  className="flex-1 py-2 rounded-xl text-xl transition-all"
                  style={{
                    background: wellness.mood === mood ? 'var(--color-purple-dim)' : 'var(--color-bg4)',
                    border: `1px solid ${wellness.mood === mood ? 'var(--color-purple)' : 'var(--color-border)'}`,
                  }}>
                  {['😔', '😐', '🙂', '😊', '✨'][mood - 1]}
                </button>
              ))}
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Как прошёл твой день?..."
              rows={3} className="w-full bg-transparent text-sm outline-none resize-none"
              style={{ color: 'var(--color-text2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 12 }}
            />
            <button onClick={saveNote} className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: noteSaved ? 'var(--color-purple)' : 'var(--color-purple-dim)',
                color: 'var(--color-purple2)',
                border: '1px solid var(--color-purple)',
              }}>
              {noteSaved ? '✓ Сохранено +15 XP' : 'Сохранить запись'}
            </button>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}