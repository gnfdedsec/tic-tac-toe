'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getGameStats() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('ไม่พบข้อมูลผู้ใช้')

    console.log("Fetching stats for user:", session.user.id)

    // ดึงข้อมูลโดยตรงโดยไม่ใช้ upsert
    const { data, error } = await supabase
      .from('game_stats')
      .select('total_score, total_games')
      .eq('id', session.user.id)
      .single()

    if (error) throw error
    
    console.log("Retrieved data:", data)
    
    // ถ้าไม่มีข้อมูล ให้สร้างใหม่
    if (!data) {
      const newUser = {
        id: session.user.id,
        username: session.user.email?.split('@')[0],
        total_score: 0,
        total_games: 0
      }
      
      const { data: newData, error: insertError } = await supabase
        .from('game_stats')
        .insert([newUser])
        .select()
        .single()

      if (insertError) throw insertError
      return { success: true, data: newData }
    }

    return { success: true, data }

  } catch (error) {
    console.error('Error in getGameStats:', error)
    return { success: false, error }
  }
} 