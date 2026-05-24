'use client'

import { useEffect, useState } from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    auth_date: number
    hash: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  ready: () => void
  expand: () => void
  close: () => void
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (callback: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
  }
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

export function getTelegramUser(): TelegramUser | null {
  const webApp = getTelegramWebApp()
  return webApp?.initDataUnsafe?.user ?? null
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  const webApp = getTelegramWebApp()
  if (!webApp) return
  if (type === 'success') {
    webApp.HapticFeedback.notificationOccurred('success')
  } else if (type === 'error') {
    webApp.HapticFeedback.notificationOccurred('error')
  } else {
    webApp.HapticFeedback.impactOccurred(type)
  }
}

export function useTelegramApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    const app = getTelegramWebApp()
    if (app) {
      app.ready()
      app.expand()
      app.setHeaderColor('#0d0b14')
      app.setBackgroundColor('#0d0b14')
      setWebApp(app)
      setUser(app.initDataUnsafe?.user ?? null)
    }
  }, [])

  return { webApp, user }
}

// Mock user for development (when not in Telegram)
export const MOCK_USER: TelegramUser = {
  id: 123456789,
  first_name: 'Элеонора',
  last_name: 'М.',
  username: 'eleonora',
  language_code: 'ru',
}
