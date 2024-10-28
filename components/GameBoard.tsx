"use client"

import { useEffect, useState } from "react"
import { Square } from "@/components/Square"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RotateCw } from "lucide-react"
import useGameStore from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export function GameBoard() {
  const { toast } = useToast()
  const {
    board,
    currentPlayer,
    winner,
    winningLine,
    score,
    streak,
    makeMove,
    resetGame,
  } = useGameStore()

  const [stats, setStats] = useState({
    currentRank: 'Bronze',
    maxStreak: 0,
    totalGames: 0
  })
  const [leaderboard, setLeaderboard] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (winner) {
      if (winner === "X") {
        if (streak % 3 === 0) { // ทุกๆ 3 ครั้ง (3, 6, 9, ...)
          toast({
            title: "🎉 ยินดีด้วย! คุณชนะ",
            description: `ชนะต่อเนื่อง ${streak} ครั้ง! ได้คะแนนโบนัสพิเศษ +1 คะแนน 🌟`,
          })
        } else if (streak % 3 === 2) { // ก่อนจะครบ 3 ครั้ง (2, 5, 8, ...)
          toast({
            title: "🎉 คุณชนะ!",
            description: `ชนะต่อเนื่อง ${streak} ครั้ง อีก 1 ครั้งจะได้โบนัส! 🎯`,
          })
        } else { // ครั้งอื่นๆ
          toast({
            title: "🎉 คุณชนะ!",
            description: `ชนะต่อเนื่อง ${streak} ครั้ง`,
          })
        }
      } else if (winner === "O") {
        toast({
          title: "😔 บอทชนะ!",
          description: "โชคดีในครั้งหน้านะ",
          variant: "destructive",
        })
      }
    } else if (board.every((square) => square !== null)) {
      toast({
        title: "🤝 เสมอ!",
        description: "เกมที่สนุกมาก",
      })
    }
  }, [winner, board, streak, toast])

  // เพิ่ม function ดึงข้อมูล
  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .single()
    
    if (data) {
      setStats(data)
    }
  }

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*, users:auth.users(email)')
      .order('total_score', { ascending: false })
      .limit(5)
    
    if (data) {
      setLeaderboard(data)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchLeaderboard()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px] w-full">
      {/* Stats Section */}
      <div className="w-full lg:w-80">
        {/* Stats Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-medium text-gray-800">สถิติของคุณ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div>
              <p className="text-xs text-gray-500">อันดับปัจจุบัน</p>
              <p className="text-sm font-medium text-gray-700">{stats.currentRank}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">สถิติชนะติดต่อกันสูงสุด</p>
              <p className="text-sm font-medium text-gray-700">{stats.maxStreak} ครั้ง</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">เกมที่เล่นทั้งหมด</p>
              <p className="text-sm font-medium text-gray-700">{stats.totalGames} เกม</p>
            </div>
            <Link href="/leaderboards" className="block mt-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 text-sm flex items-center justify-center gap-2"
              >
                <span>🏆</span>
                <span>ดูอันดับทั้งหมด</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Game Board Section */}
      <div className="flex-1 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-4">
            <CardTitle className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Score: {score}</h2>
              <Button
                variant="outline"
                onClick={resetGame}
                className="flex items-center gap-2 px-4 h-9 hover:bg-gray-100"
              >
                <RotateCw className="h-4 w-4" /> 
                <span className="font-medium">เริ่มเกมส์ใหม่</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 p-4">
            <div className="grid grid-cols-3 gap-2 w-full max-w-[360px]">
              {board.map((value, index) => (
                <Square
                  key={index}
                  value={value}
                  onClick={() => currentPlayer === "X" && makeMove(index)}
                  isWinningSquare={winningLine?.includes(index)}
                />
              ))}
            </div>

            <p className="text-base font-medium text-gray-700">
              {winner
                ? `ผู้ชนะ: ${winner}`
                : board.every((square) => square !== null)
                ? "เสมอ!"
                : `ผู้เล่นปัจจุบัน: ${currentPlayer}`}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-gray-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">กติกาการเล่น</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>เลือกช่องที่ต้องการวาง X โดยการคลิก</li>
              <li>ชนะ: ได้ 1 คะแนน</li>
              <li>แพ้: เสีย 1 คะแนน</li>
              <li>ชนะ 3 ครั้งติดต่อกัน: ได้โบนัส 1 คะแนน</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
