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
import { updateGameStats } from '@/app/actions/updateStats'
import { getGameStats } from "@/app/actions/getStats"
import { User } from '@supabase/auth-helpers-nextjs'

// หรือถ้าต้องการกำหนด interface เอง
interface GameBoardProps {
  user: User | null
}

export function GameBoard({ user }: GameBoardProps) {
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
    gamesPlayed,
    initialStats
  } = useGameStore()

  const [stats, setStats] = useState({
    total_score: 0,
    total_games: 0,
    current_rank: 'Bronze'
  })

  const [leaderboard, setLeaderboard] = useState([])
  const supabase = createClientComponentClient()

  // เพิ่ม state เพื่อติดตามอัพดทสถิติของเกมปัจจุบันแล้วหรือยัง
  const [hasUpdated, setHasUpdated] = useState(false)

  // เพิ่ม useEffect สำหรับดึงข้อมูลเริ่มต้น
  useEffect(() => {
    const fetchInitialStats = async () => {
      console.log("Fetching initial stats...") // debug
      const result = await getGameStats()
      console.log("Result from getGameStats:", result) // debug
      
      if (result.success && result.data) {
        console.log("Setting stats with:", result.data) // debug
        setStats({
          total_score: result.data.total_score || 0,
          total_games: result.data.total_games || 0,
          current_rank: result.data.current_rank || 'Bronze'
        })
      } else {
        console.error("Failed to fetch stats:", result) // debug error
      }
    }
    
    if (user?.id) { // เพิ่มเงื่อนไขให้รอจนกว่าจะมี user
      fetchInitialStats()
    }
  }, [user]) // เพิ่ม user เป็น dependency

  // แสดง loading state ถ้ายังไม่มีข้อมูล
  useEffect(() => {
    console.log("Current stats:", stats) // debug current stats
  }, [stats])

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
    } else if (board.every(square => square !== null)) {
      toast({
        title: "🤝 เสมอ!",
        description: "เกมี่สนุกมาก",
      })
    }
  }, [winner, board, streak, toast])

  // อัพเดทสถิติเมื่อจบเกม
  useEffect(() => {
    const updateStats = async () => {
      if ((winner || board.every(square => square !== null)) && !hasUpdated) {
        let scoreChange = 0;
        if (winner === 'X') {
          scoreChange = 1; // ชนะ +1
        } else if (winner === 'O') {
          scoreChange = -1; // แพ้ -1
        } // เสมอ +0

        const newStats = {
          total_score: stats.total_score + scoreChange,
          total_games: stats.total_games + 1,
          streak: streak
        }
        
        const result = await updateGameStats(newStats)
        
        if (result.success) {
          // ดึงข้อมูลใหม่หลังจากอัพเดท เพื่อให้ได้ current_rank ที่ถูกต้อง
          const updatedStats = await getGameStats()
          if (updatedStats.success && updatedStats.data) {
            setStats({
              total_score: updatedStats.data.total_score,
              total_games: updatedStats.data.total_games,
              current_rank: updatedStats.data.current_rank
            })
          }
          setHasUpdated(true)
        } else {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถอัพเดทสถิติได้",
            variant: "destructive",
          })
        }
      }
    }
    
    updateStats()
  }, [winner, board, streak, stats.total_score, stats.total_games, hasUpdated])

  // รีเซ็ต hasUpdated เมื่อเริ่มเกมใหม่
  useEffect(() => {
    if (!winner && !board.every(square => square !== null)) {
      setHasUpdated(false)
    }
  }, [winner, board])

  // เพิ่มฟังก์ชันสำหรับกำหนดสีตามแรงค์
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

  // เพิ่มฟังก์ชันสำหรับ emoji ตามแรงค์
  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'Immortal God':
        return ''; // ดาบคู่
      case 'Diamond':
        return ''; // ดาบแฟนตาซี
      case 'Platinum':
        return ''; // มีดสั้น
      case 'Gold':
        return ''; // ดาบคู่
      case 'Silver':
        return ''; // ดาบแฟนตาซี
      default:
        return ''; // มีดสั้น (Bronze)
    }
  }

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
              <p className="text-xs text-gray-500"> 🗡️ แรงค์ปัจจุบัน</p>
              <p className={`text-sm font-medium ${getRankColor(stats.current_rank)} flex items-center gap-2`}>
                <span>{getRankEmoji(stats.current_rank)}</span>
                <span>{stats.current_rank}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">คะแนนรวมทั้งหมด</p>
              <p className="text-sm font-medium text-gray-700">{stats.total_score} คะแนน</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">เกมที่เล่นทั้งหมด</p>
              <p className="text-sm font-medium text-gray-700">{stats.total_games} เกม</p>
            </div>
            <Link href="/leaderboards" className="block mt-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 text-sm flex items-center justify-center gap-2"
                onClick={() => {
                  resetGame() // เรียกใช้ resetGame ก่อนไปหน้า leaderboards
                }}
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
            <CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-gray-800">Score: {score}</span>
                {(winner !== null || board.every(square => square !== null)) && (
                  <Button
                    variant="outline"
                    onClick={resetGame}
                    className="flex items-center gap-2 px-4 h-9 hover:bg-gray-100"
                  >
                    <RotateCw className="h-4 w-4" /> 
                    <span className="font-medium">เริ่มเกมส์ใหม่</span>
                  </Button>
                )}
              </div>
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
              <span className="ml-2 text-gray-500">
                (เกมที่ {gamesPlayed + (winner || board.every(square => square !== null) ? 0 : 1)})
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-gray-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">กติกาการเล่น</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>ผู้เล่นลือกช่องที่ต้องการวาง X โดยการคลิก</li>
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
