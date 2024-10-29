'use client'
import { GameBoard } from "@/components/GameBoard"
import { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getGameStats } from "@/app/actions/getStats"
import useGameStore from "@/store/gameStore"
import { Icon } from '@iconify/react';
export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUserAndStats = async () => {
      try {
        setIsLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }
        
        setUser(session.user)
        
        // ดึงข้อมูลสถิติทันทีที่ login สำเร็จ
        const result = await getGameStats()
        if (result.success && result.data) {
          // อัพเดทข้อมูลใน store
          useGameStore.setState({
            initialStats: {
              total_score: result.data.total_score,
              total_games: result.data.total_games
            }
          })
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUserAndStats()
  }, [router, supabase])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>
  }

  if (!user) {
    return null
  }

  return (
    <>
   
      <main className="flex flex-col bg-gray-50 min-h-screen">
        <Header user={user} />
        
        <div className="container mx-auto p-8 flex-1">
          <h1 className="text-4xl font-krub font-semibold text-center mb-8 text-gray-600 flex items-center justify-center gap-1">
          <Icon icon="material-symbols-light:background-dot-small-outline-sharp" />เกมส์ Tic Tac Toe
          </h1>
          <div className="flex justify-center">
            <GameBoard user={user} />
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  )
}
