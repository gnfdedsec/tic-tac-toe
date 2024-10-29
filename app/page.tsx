'use client'
import { GameBoard } from "@/components/GameBoard"
import { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return <div>กำลังโหลด...</div>
  }

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen">
      <Header user={user} />
      
      <div className="container mx-auto p-8 flex-1">
        <h1 className="text-4xl font-krub font-semibold text-center mb-8 text-gray-600">
          เกมส์ Tic Tac Toe
        </h1>
        <div className="flex justify-center">
          <GameBoard />
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
