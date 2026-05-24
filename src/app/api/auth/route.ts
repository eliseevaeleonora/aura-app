import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createServerSupabase } from '@/lib/supabase'

// Verify Telegram WebApp data integrity
function verifyTelegramData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return false

  params.delete('hash')

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest()

  const calculatedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  return calculatedHash === hash
}

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json()

    if (!initData) {
      return NextResponse.json({ error: 'No initData provided' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN!

    // Verify in production (skip in development)
    if (process.env.NODE_ENV === 'production') {
      const isValid = verifyTelegramData(initData, botToken)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 401 })
      }
    }

    // Parse user data
    const params = new URLSearchParams(initData)
    const userJson = params.get('user')
    if (!userJson) {
      return NextResponse.json({ error: 'No user data' }, { status: 400 })
    }

    const telegramUser = JSON.parse(userJson)
    const supabase = createServerSupabase()

    // Get or create user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single()

    if (existingUser) {
      // Update user info
      await supabase
        .from('users')
        .update({
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
        })
        .eq('telegram_id', telegramUser.id)

      return NextResponse.json({ user: existingUser, isNew: false })
    }

    // Create new user with welcome diamonds
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramUser.id,
        username: telegramUser.username ?? null,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name ?? null,
        diamonds: 100,
        level: 1,
        xp: 0,
        xp_to_next: 1000,
        streak: 0,
        best_streak: 0,
        energy: 100,
        theme: 'midnight',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Give midnight theme for free
    const { data: midnightTheme } = await supabase
      .from('shop_items')
      .select('id')
      .eq('theme_key', 'midnight')
      .single()

    if (midnightTheme) {
      await supabase.from('user_items').insert({
        user_id: newUser.id,
        item_id: midnightTheme.id,
        equipped: true,
      })
    }

    return NextResponse.json({ user: newUser, isNew: true })
  } catch (error) {
    console.error('[auth] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
