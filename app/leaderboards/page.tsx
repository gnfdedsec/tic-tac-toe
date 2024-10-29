'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('game_stats')
        .select('username, current_rank, total_score, total_games')
        .order('total_score', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return
      }

      setLeaderboard(data || [])
    }

    fetchLeaderboard()
  }, [])

  // Function to set color based on rank
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Immortal God':
        return 'text-red-600';
      case 'Diamond':
        return 'text-blue-500';
      case 'Platinum':
        return 'text-cyan-500';
      case 'Gold':
        return 'text-yellow-500';
      case 'Silver':
        return 'text-gray-400';
      default:
        return 'text-amber-700'; // Bronze
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
            <CardTitle className="text-xl md:text-2xl font-bold text-center">🏆 อันดับนักเล่นเกมส์ TIC TAE TOE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base">อันดับ</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base">ชื่อผู้เล่น</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base">แรงค์</th>
                    <th className="px-2 sm:px-4 py-3 text-right text-sm sm:text-base">คะแนน</th>
                    <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-right text-sm sm:text-base">เกมที่เล่น</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base">
                        {index + 1 <= 3 ? (
                          <span className="text-lg sm:text-xl">
                            {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="px-2 text-xl">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base">{player.username}</td>
                      <td className={`px-2 sm:px-4 py-3 text-sm sm:text-base ${getRankColor(player.current_rank)}`}>
                        {player.current_rank}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-right font-medium text-sm sm:text-base">
                        {player.total_score}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-3 text-right text-gray-600 text-sm sm:text-base">
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
