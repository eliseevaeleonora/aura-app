'use client'

import { haptic } from '@/lib/telegram'

export function useHaptic() {
  return {
    tap: () => haptic('light'),
    success: () => haptic('success'),
    error: () => haptic('error'),
    heavy: () => haptic('heavy'),
    select: () => haptic('light'),
  }
}
