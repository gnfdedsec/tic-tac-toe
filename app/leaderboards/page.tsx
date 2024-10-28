'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('game_stats')
        .select('*, users:auth.users(email)')
        .order('total_score', { ascending: false })
        .limit(100)

      if (data) {
        setLeaderboard(data)
      }
      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                กลับหน้าหลัก
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">อันดับผู้เล่นทั้งหมด</h1>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-2xl text-purple-800">Leaderboards</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-600">
                  <div className="col-span-1">อันดับ</div>
                  <div className="col-span-5">ผู้เล่น</div>
                  <div className="col-span-2 text-center">คะแนน</div>
                  <div className="col-span-2 text-center">เกมที่เล่น</div>
                  <div className="col-span-2 text-center">ชนะติดต่อสูงสุด</div>
                </div>

                {/* Leaderboard Items */}
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.id}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors
                      ${index < 3 ? 'bg-opacity-10' : ''}
                      ${index === 0 ? 'bg-yellow-50' : 
                        index === 1 ? 'bg-gray-50' : 
                        index === 2 ? 'bg-orange-50' : ''}`}
                  >
                    <div className="col-span-1">
                      <span className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-bold
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-50 text-blue-700'}
                      `}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-5 flex items-center">
                      <span className="truncate">{player.users?.email}</span>
                    </div>
                    <div className="col-span-2 text-center font-bold text-purple-600">
                      {player.total_score}
                    </div>
                    <div className="col-span-2 text-center text-gray-600">
                      {player.total_games}
                    </div>
                    <div className="col-span-2 text-center text-green-600 font-medium">
                      {player.max_streak}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
