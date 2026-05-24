'use client'

import { useEffect, useState } from 'react'
import { useTelegramApp, MOCK_USER } from '@/lib/telegram'
import { useAuraStore } from '@/store/useAuraStore'

export function useAuth() {
  const { user: telegramUser } = useTelegramApp()
  const setProfile = useAuraStore((s) => s.setProfile)
  const profile = useAuraStore((s) => s.profile)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function authenticate() {
      try {
        const initData = window.Telegram?.WebApp?.initData

        if (initData) {
          // Real Telegram environment
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
          })

          if (!res.ok) throw new Error('Auth failed')
          const { user } = await res.json()
          setProfile(user)
        } else {
          // Development: use mock user
          console.log('[auth] No Telegram initData, using mock user')
          // Profile is already set from mock data in store
        }
      } catch (err) {
        console.error('[auth] Error:', err)
        setError('Ошибка авторизации')
      } finally {
        setIsLoading(false)
      }
    }

    authenticate()
  }, [])

  return { profile, isLoading, error }
}
