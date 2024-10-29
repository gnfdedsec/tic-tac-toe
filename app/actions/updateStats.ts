'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface GameStats {
  total_score: number
  total_games: number
  streak: number
}

export async function updateGameStats(stats: GameStats) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('ไม่พบข้อมูลผู้ใช้')

    // เปลี่ยนจาก user_id เป็น id
    const { data: currentStats } = await supabase
      .from('game_stats')
      .select('max_streak')
      .eq('id', session.user.id)
      .single()

    const newMaxStreak = currentStats?.max_streak 
      ? Math.max(currentStats.max_streak, stats.streak)
      : stats.streak

    // อัพเดทข้อมูล โดยใช้ id แทน user_id
    const { data, error } = await supabase
      .from('game_stats')
      .upsert({
        id: session.user.id, // เปลี่ยนจาก user_id เป็น id
        total_score: stats.total_score,
        total_games: stats.total_games,
        max_streak: newMaxStreak,
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Error updating stats:', error)
    return { success: false, error }
  }
} 