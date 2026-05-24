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

 const profile = useAuraStore((s) => s.profile)

if (!profile) return (
  <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0b14',
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    color: '#c4b8f7',
  }}>
    Aura ✦
  </div>
)
