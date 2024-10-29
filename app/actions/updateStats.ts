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

    const { data, error } = await supabase
      .from('game_stats')
      .update({
        total_score: stats.total_score,
        total_games: stats.total_games,
        max_streak: stats.streak, // อัพเดท max_streak ถ้ามากกว่าค่าเดิม
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Error updating stats:', error)
    return { success: false, error }
  }
} 