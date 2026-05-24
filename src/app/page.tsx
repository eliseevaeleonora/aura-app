'use client'

import { useEffect } from 'react'
import { useTelegramApp } from '@/lib/telegram'
import AppShell from '@/components/layout/AppShell'

export default function HomePage() {
  const { webApp } = useTelegramApp()

  useEffect(() => {
    // Prevent pull-to-refresh on Telegram
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) e.preventDefault()
    }, { passive: false })
  }, [])

  return <AppShell />
}
