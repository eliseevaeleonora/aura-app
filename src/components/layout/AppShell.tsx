'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAuraStore } from '@/store/useAuraStore'
import BottomNav from './BottomNav'
import XPToast from '@/components/ui/XPToast'
import HomeScreen from '@/components/home/HomeScreen'
import TasksScreen from '@/components/tasks/TasksScreen'
import AnalyticsScreen from '@/components/analytics/AnalyticsScreen'
import WellnessScreen from '@/components/wellness/WellnessScreen'
import ShopScreen from '@/components/shop/ShopScreen'
import ProfileScreen from '@/components/profile/ProfileScreen'

const screens = {
  home: HomeScreen,
  tasks: TasksScreen,
  analytics: AnalyticsScreen,
  wellness: WellnessScreen,
  shop: ShopScreen,
  profile: ProfileScreen,
} as Record<string, React.ComponentType>

export default function AppShell() {
  const activeTab = useAuraStore((s) => s.activeTab)
  const xpToast = useAuraStore((s) => s.xpToast)

  const ActiveScreen = screens[activeTab]

  return (
    <div
      className="flex flex-col h-full w-full overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Screen area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            <ActiveScreen />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global XP Toast */}
      <XPToast
        visible={xpToast.visible}
        amount={xpToast.amount}
        label={xpToast.label}
      />
    </div>
  )
}
