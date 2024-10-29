'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getGameStats() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('ไม่พบข้อมูลผู้ใช้')

    // ดึงข้อมูลหรือสร้างข้อมูลใหม่ถ้ายังไม่มี
    const { data, error } = await supabase
      .from('game_stats')
      .upsert({
        id: session.user.id,
        username: session.user.email?.split('@')[0], // ใช้ส่วนแรกของอีเมลเป็น username
        total_score: 0,
        total_games: 0
      }, {
        onConflict: 'id',
        ignoreDuplicates: true
      })
      .select('total_score, total_games')
      .single()

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Error fetching stats:', error)
    return { success: false, error }
  }
} 