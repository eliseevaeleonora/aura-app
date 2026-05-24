'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, Tooltip, CartesianGrid
} from 'recharts'
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
  container: { animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
}

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{
        background: 'var(--color-card3)',
        border: '1px solid var(--color-border2)',
        color: 'var(--color-text2)',
      }}
    >
      <p>{label}: <strong>{payload[0].value}%</strong></p>
    </div>
  )
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('week')
  const data = MOCK_ANALYTICS

  const activityData = data.activity.map((d) => ({
    name: d.label,
    value: d.value,
    isToday: d.isToday,
  }))

  const moodData = data.mood.map((d) => ({
    name: d.label,
    value: d.value,
  }))

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
            Аналитика <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
          </h1>
        </motion.div>

        {/* Period tabs */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Tabs tabs={PERIOD_TABS} active={period} onChange={setPeriod} />
        </motion.div>

        {/* Summary stats */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Всего XP', value: `${data.totalXP.toLocaleString()}`, emoji: '⭐' },
              { label: 'Задач сделано', value: data.totalTasks.toString(), emoji: '✅' },
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

        {/* Activity bar chart */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Card className="p-4">
            <h3
              className="font-display text-[15px] font-normal mb-4"
              style={{ color: 'var(--color-lavender2)' }}
            >
              Активность по дням
            </h3>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={activityData} barSize={24}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'var(--color-text4)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  fill="var(--color-purple3)"
                  // Future: use cell-level fill for today highlight
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Mood line chart */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Card className="p-4">
            <h3
              className="font-display text-[15px] font-normal mb-4"
              style={{ color: 'var(--color-lavender2)' }}
            >
              Настроение
            </h3>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={moodData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'var(--color-text4)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-teal)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-teal)', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: 'var(--color-teal2)' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[11px]" style={{ color: 'var(--color-text3)' }}>
              <span>Среднее: <strong style={{ color: 'var(--color-teal2)' }}>{data.avgMood.toFixed(1)}/5</strong></span>
            </div>
          </Card>
        </motion.div>

        {/* Habit progress */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <SectionTitle>Прогресс привычек</SectionTitle>
          <Card className="p-4 flex flex-col gap-4">
            {data.habitProgress.map(({ name, emoji, completed, target }) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm" style={{ color: 'var(--color-text2)' }}>
                    {emoji} {name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text3)' }}>
                    {completed}/{target} дней
                  </span>
                </div>
                <ProgressBar
                  value={Math.round((completed / target) * 100)}
                  color={
                    name === 'Медитация' ? 'linear-gradient(90deg, var(--color-teal), var(--color-teal2))' :
                    name === 'Тренировки' ? 'linear-gradient(90deg, var(--color-pink-dim), var(--color-pink))' :
                    name === 'Чтение' ? 'linear-gradient(90deg, var(--color-gold-dim), var(--color-gold))' :
                    undefined
                  }
                />
              </div>
            ))}
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={stagger.item} className="px-5 pb-2">
          <SectionTitle>AI Инсайты ✨</SectionTitle>
          <div className="flex flex-col gap-3">
            {AI_INSIGHTS.slice(0, 2).map((insight, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, var(--color-purple-dim), var(--color-pink-dim))'
                    : 'linear-gradient(135deg, var(--color-pink-dim), var(--color-bg3))',
                  border: '1px solid var(--color-border2)',
                }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--color-purple2)' }}
                >
                  ✨ AI Инсайт
                </div>
                <p className="text-[13px] font-light leading-relaxed" style={{ color: 'var(--color-lavender2)' }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
