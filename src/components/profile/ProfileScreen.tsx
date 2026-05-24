'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useAuraStore } from '@/store/useAuraStore'

export default function HomePage() {
  const setProfile = useAuraStore((s) => s.setProfile)
  const profile = useAuraStore((s) => s.profile)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    const user = tg?.initDataUnsafe?.user

    const firstName = user?.first_name ?? 'Пользователь'
    const telegramId = user?.id ?? Math.floor(Math.random() * 999999)
    const username = user?.username ?? ''

    if (!profile) {
      setProfile({
        id: String(telegramId),
        telegramId,
        username,
        firstName,
        diamonds: 100,
        level: 1,
        xp: 0,
        xpToNext: 1000,
        xpProgress: 0,
        streak: 0,
        bestStreak: 0,
        energy: 100,
        theme: 'midnight',
      })
    }
    setReady(true)
  }, [])

  if (!ready || !profile) return (
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

  return <AppShell />
}