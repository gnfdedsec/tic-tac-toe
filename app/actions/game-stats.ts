'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface GameStats {
  user_id: string
  total_games: number
  total_wins: number
  max_streak: number
  current_rank: string
  total_score: number
  users?: {
    email: string
  }
}

// เพิ่ม type guard function
function isGameStats(data: any): data is GameStats {
  return (
    'user_id' in data &&
    'total_games' in data &&
    'total_wins' in data &&
    'max_streak' in data &&
    'current_rank' in data &&
    'total_score' in data
  )
}

// ฟังก์ชันดึงข้อมูลสถิติเมื่อ login
export async function getPlayerStats() {
  const supabase = createServerActionClient({ cookies })

  try {
    // ดึงข้อมูล user ปัจจุบัน
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // ดึงข้อมูลสถิติจาก game_stats โดยใช้ user_id
    const { data: stats, error: statsError } = await supabase
      .from('game_stats')
      .select(`
        *,
        users:auth.users (
          email
        )
      `)
      .eq('user_id', user.id)
      .single()

    // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้น
    if (!stats) {
      const initialStats = {
        user_id: user.id,
        total_games: 0,
        total_wins: 0,
        max_streak: 0,
        current_rank: 'Bronze',
        total_score: 0
      }

      // สร้างข้อมูลเริ่มต้นใน database
      const { data: newStats, error: createError } = await supabase
        .from('game_stats')
        .insert(initialStats)
        .select(`
          *,
          users:auth.users (
            email
          )
        `)
        .single()

      if (createError) throw createError
      if (!newStats) throw new Error('Failed to create stats')
      
      return { 
        success: true, 
        data: {
          ...newStats,
          email: user.email
        } as GameStats & { email: string }
      }
    }

    if (statsError) throw statsError

    if (!isGameStats(stats)) {
      throw new Error('Invalid stats data structure')
    }

    return { 
      success: true, 
      data: {
        ...stats,
        email: user.email
      } 
    }

  } catch (error) {
    console.error('Error fetching player stats:', error)
    return { success: false, error: 'Failed to fetch stats' }
  }
}
