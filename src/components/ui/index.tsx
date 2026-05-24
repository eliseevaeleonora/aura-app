'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Button ────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50'

  const variants = {
    primary: 'text-white',
    ghost: 'bg-transparent hover:opacity-80',
    outline: 'border',
    gold: 'text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-purple3), var(--color-purple))',
      boxShadow: '0 4px 16px rgba(155,138,232,0.3)',
    },
    ghost: {},
    outline: {
      borderColor: 'var(--color-border2)',
      color: 'var(--color-text2)',
    },
    gold: {
      background: 'linear-gradient(135deg, var(--color-gold-dim), var(--color-gold))',
      boxShadow: '0 4px 16px rgba(232,201,122,0.25)',
    },
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      style={styles[variant]}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Badge ─────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'gold' | 'teal' | 'pink' | 'default'
  className?: string
}

export function Badge({ children, variant = 'purple', className }: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    purple: {
      background: 'var(--color-purple-dim)',
      color: 'var(--color-purple2)',
      border: '1px solid var(--color-border2)',
    },
    gold: {
      background: 'rgba(107,80,32,0.4)',
      color: 'var(--color-gold)',
      border: '1px solid rgba(232,201,122,0.25)',
    },
    teal: {
      background: 'rgba(42,85,80,0.4)',
      color: 'var(--color-teal2)',
      border: '1px solid rgba(125,201,192,0.25)',
    },
    pink: {
      background: 'rgba(107,58,84,0.4)',
      color: 'var(--color-pink2)',
      border: '1px solid rgba(232,164,200,0.25)',
    },
    default: {
      background: 'var(--color-bg4)',
      color: 'var(--color-text3)',
      border: '1px solid var(--color-border)',
    },
  }

  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold', className)}
      style={styles[variant]}
    >
      {children}
    </span>
  )
}

// ─── SectionTitle ──────────────────────────────────────────────────────────

interface SectionTitleProps {
  children: React.ReactNode
  right?: React.ReactNode
  className?: string
}

export function SectionTitle({ children, right, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <h3
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text4)' }}
      >
        {children}
      </h3>
      {right && (
        <span className="text-xs" style={{ color: 'var(--color-text3)' }}>
          {right}
        </span>
      )}
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, className, gradient, onClick, style }: CardProps) {
  return (
    <div
      className={cn(
        gradient ? 'card-gradient' : 'card',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}

// ─── XP Progress Bar ───────────────────────────────────────────────────────

interface XPBarProps {
  progress: number // 0-100
  height?: number
  className?: string
}

export function XPBar({ progress, height = 7, className }: XPBarProps) {
  return (
    <div className={cn('xp-bar-track', className)} style={{ height }}>
      <motion.div
        className="xp-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        style={{ height: '100%' }}
      />
    </div>
  )
}

// ─── Progress Bar (generic) ────────────────────────────────────────────────

interface ProgressBarProps {
  value: number // 0-100
  color?: string
  height?: number
  className?: string
}

export function ProgressBar({ value, color, height = 6, className }: ProgressBarProps) {
  return (
    <div className={cn('xp-bar-track', className)} style={{ height }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        style={{
          height: '100%',
          borderRadius: 99,
          background: color ?? 'linear-gradient(90deg, var(--color-purple3), var(--color-purple2))',
        }}
      />
    </div>
  )
}

// ─── Tab Pills ─────────────────────────────────────────────────────────────

interface TabsProps<T extends string> {
  tabs: { value: T; label: string }[]
  active: T
  onChange: (v: T) => void
  className?: string
}

export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map(({ value, label }) => {
        const isActive = value === active
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: isActive ? 'var(--color-purple-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--color-purple)' : 'var(--color-border)'}`,
              color: isActive ? 'var(--color-purple2)' : 'var(--color-text3)',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
