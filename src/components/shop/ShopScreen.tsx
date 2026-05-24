'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import { MOCK_SHOP_ITEMS } from '@/lib/mockData'
import { haptic } from '@/lib/telegram'
import { SectionTitle, Tabs, Card } from '@/components/ui'
import type { ShopItemType, ShopItem } from '@/types'

type ShopTab = 'themes' | 'decorations' | 'boosts'

const SHOP_TABS: { value: ShopTab; label: string }[] = [
  { value: 'themes', label: 'Темы' },
  { value: 'decorations', label: 'Декор' },
  { value: 'boosts', label: 'Бонусы' },
]

const TAB_TYPES: Record<ShopTab, ShopItemType[]> = {
  themes: ['theme'],
  decorations: ['decoration'],
  boosts: ['boost', 'protection'],
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
}

export default function ShopScreen() {
  const profile = useAuraStore((s) => s.profile)
  const spendDiamonds = useAuraStore((s) => s.spendDiamonds)
  const setTheme = useAuraStore((s) => s.setTheme)
  const showXPToast = useAuraStore((s) => s.showXPToast)
  const [activeTab, setActiveTab] = useState<ShopTab>('themes')
  const [items, setItems] = useState(MOCK_SHOP_ITEMS)

  const handleBuy = (item: ShopItem) => {
    if (item.owned) {
      if (item.theme) setTheme(item.theme)
      haptic('light')
      return
    }
    if (!profile) return
    const success = spendDiamonds(item.priceDiamonds)
    if (success) {
      haptic('success')
      setItems((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, owned: true } : i)
      )
      if (item.theme) setTheme(item.theme)
      // Use XP toast for purchase confirmation
      showXPToast(0)
    } else {
      haptic('error')
    }
  }

  const filteredItems = items.filter((item) => TAB_TYPES[activeTab].includes(item.type))

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
          <div className="flex items-end justify-between">
            <h1 className="font-display text-xl" style={{ color: 'var(--color-text)' }}>
              Магазин <span className="italic" style={{ color: 'var(--color-purple2)' }}>✦</span>
            </h1>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="text-base">💎</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-purple2)' }}>
                {profile?.diamonds ?? 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={stagger.item} className="px-5 pb-4">
          <Tabs tabs={SHOP_TABS} active={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 px-5">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={stagger.item}
                  className="relative rounded-2xl p-4 cursor-pointer active:scale-[0.97] transition-all"
                  style={{
                    background: item.owned ? 'var(--color-card3)' : 'var(--color-card)',
                    border: `1px solid ${item.owned ? 'var(--color-purple)' : 'var(--color-border)'}`,
                  }}
                  onClick={() => handleBuy(item)}
                >
                  {/* Owned badge */}
                  {item.owned && (
                    <div
                      className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: 'var(--color-purple-dim)',
                        color: 'var(--color-purple2)',
                        border: '1px solid var(--color-border2)',
                      }}
                    >
                      {item.equipped ? 'Активна' : '✓'}
                    </div>
                  )}

                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    {item.name}
                  </div>
                  <div
                    className="text-[11px] font-light leading-snug mb-3"
                    style={{ color: 'var(--color-text3)' }}
                  >
                    {item.description}
                  </div>

                  {/* Price or owned indicator */}
                  {item.owned ? (
                    <div
                      className="text-xs font-medium"
                      style={{ color: item.equipped ? 'var(--color-purple2)' : 'var(--color-text3)' }}
                    >
                      {item.equipped ? '✦ Используется' : 'Нажми чтобы надеть'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">💎</span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: (profile?.diamonds ?? 0) >= item.priceDiamonds
                            ? 'var(--color-gold)'
                            : 'var(--color-text4)',
                        }}
                      >
                        {item.priceDiamonds}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Earn diamonds hint */}
        <motion.div variants={stagger.item} className="px-5 pt-4">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, var(--color-gold-dim), var(--color-bg3))',
              border: '1px solid rgba(232,201,122,0.2)',
            }}
          >
            <span className="text-2xl">💎</span>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-gold2)' }}>
                Как заработать кристаллы?
              </div>
              <div className="text-xs font-light" style={{ color: 'var(--color-text3)' }}>
                Выполняй задачи, держи серию, ставь рекорды
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
