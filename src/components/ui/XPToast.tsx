'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface XPToastProps {
  visible: boolean
  amount: number
  label: string
}

export default function XPToast({ visible, amount, label }: XPToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-[200]"
        >
          <div
            className="px-8 py-4 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(61,52,102,0.95), rgba(107,58,84,0.95))',
              border: '1px solid var(--color-purple)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px rgba(155,138,232,0.35)',
            }}
          >
            <div
              className="text-3xl font-semibold mb-0.5"
              style={{ color: 'var(--color-purple2)' }}
            >
              +{amount} XP
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text3)' }}>
              {label}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
