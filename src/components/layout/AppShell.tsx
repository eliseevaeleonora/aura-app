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

const screens: Record<string, React.ComponentType> = {
  home: HomeScreen,
  tasks: TasksScreen,
  analytics: AnalyticsScreen,
  wellness: WellnessScreen,
  shop: ShopScreen,
  profile: ProfileScreen,
}

export default function AppShell() {
  const activeTab = useAuraStore((s) => s.activeTab)
  const xpToast = useAuraStore((s) => s.xpToast)
  const profile = useAuraStore((s) => s.profile)

  if (!profile) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0b14',
        gap: 12,
      }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#c4b8f7' }}>✦</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#e8e4fa' }}>Aura</div>
        <div style={{ fontSize: 13, color: '#5a5278' }}>загрузка...</div>
      </div>
    )
  }

  const ActiveScreen = screens[activeTab] ?? HomeScreen

  return (
    <div className="flex flex-col h-full w-full overflow-hidden"
      style={{ background: '#0d0b14' }}>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="h-full"
          >
            <ActiveScreen />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
      <XPToast visible={xpToast.visible} amount={xpToast.amount} label={xpToast.label} />
    </div>
  )
}