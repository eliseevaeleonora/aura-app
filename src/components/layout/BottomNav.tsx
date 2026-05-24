'use client'

import { motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { haptic } from '@/lib/telegram'
import type { NavTab } from '@/types'

const NAV_ITEMS: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    tab: 'home',
    label: 'Главная',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    tab: 'analytics',
    label: 'Аналитика',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    tab: 'tasks',
    label: 'Задачи',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    tab: 'wellness',
    label: 'Wellness',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    tab: 'shop',
    label: 'Магазин',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const activeTab = useAuraStore((s) => s.activeTab)
  const setActiveTab = useAuraStore((s) => s.setActiveTab)

  const handleTab = (tab: NavTab) => {
    if (tab === activeTab) return
    haptic('light')
    setActiveTab(tab)
  }

  return (
    <nav
      className="flex-shrink-0 glass-dark border-t pb-safe z-50"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map(({ tab, label, icon }) => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors flex-1"
              style={{
                color: isActive ? 'var(--color-purple2)' : 'var(--color-text4)',
              }}
            >
              <div className="w-5 h-5">{icon}</div>
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--color-purple)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
