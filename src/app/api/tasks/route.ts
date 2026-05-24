import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tasks: data ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, ...task } = body

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const supabase = createServerSupabase()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      date: today,
      ...task,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}

export async function PATCH(req: NextRequest) {
  const { taskId, userId, completed } = await req.json()
  if (!taskId || !userId) return NextResponse.json({ error: 'taskId and userId required' }, { status: 400 })

  const supabase = createServerSupabase()

  const { data: task } = await supabase
    .from('tasks')
    .select('xp_reward, diamond_reward')
    .eq('id', taskId)
    .single()

  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Grant rewards if completing
  if (completed && task) {
    await supabase.rpc('add_user_rewards', {
      p_user_id: userId,
      p_xp: task.xp_reward,
      p_diamonds: task.diamond_reward,
    })
  }

  return NextResponse.json({ task: data })
}
