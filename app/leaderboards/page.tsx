'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// กำหนด interface สำหรับข้อมูลผู้เล่น
interface PlayerStats {
  username: string
  current_rank: string
  total_score: number
  total_games: number
}

export default function LeaderboardPage() {
  // กำหนด type ให้กับ state
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('game_stats')
        .select('username, current_rank, total_score, total_games')
        .order('total_score', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return
      }

      setLeaderboard(data || [])
    }

    fetchLeaderboard()
  }, [supabase])

  // เพิ่มฟังก์ชันสำหรับกำหนดสีตามแรงค์
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Immortal God':
        return 'text-red-600'
      case 'Diamond':
        return 'text-blue-500'
      case 'Platinum':
        return 'text-cyan-500'
      case 'Gold':
        return 'text-yellow-500'
      case 'Silver':
        return 'text-gray-400'
      default:
        return 'text-amber-700' // Bronze
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าเกม
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-4xl font-bold text-center">🏆 อันดับนักเล่นเกมส์ TIC TAE TOE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">อันดับ</th>
                    <th className="px-4 py-3 text-left">ชื่อผู้เล่น</th>
                    <th className="px-4 py-3 text-left">แรงค์</th>
                    <th className="px-4 py-3 text-right">คะแนน</th>
                    <th className="px-4 py-3 text-right">เกมที่เล่น</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {index + 1 <= 3 ? (
                          <span className="text-xl">
                            {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="px-2 text-xl">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{player.username}</td>
                      <td className={`px-4 py-3 ${getRankColor(player.current_rank)}`}>
                        {player.current_rank}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {player.total_score}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {player.total_games}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
