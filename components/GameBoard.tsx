"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Icon } from '@iconify/react';
// Or if you want to define your own interface
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

  // Add state to track if current game stats have been updated
  const [hasUpdated, setHasUpdated] = useState(false)

  // Add useEffect to fetch initial data
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
    
    if (user?.id) { // Wait until we have a user before fetching
      fetchInitialStats()
    }
  }, [user]) // Add user as dependency

  // Show loading state if no data
  useEffect(() => {
    console.log("Current stats:", stats) // debug 
  }, [stats])

  // เพิ่มฟังก์ชันเล่นเสียง
  const playSound = useCallback((soundType: 'win' | 'lose' | 'draw') => {
    const audio = new Audio(`/sounds/${soundType}.mp3`)
    audio.volume = 0.5 // ปรับระดับเสียง 0-1
    audio.play()
  }, [])

  useEffect(() => {
    if (winner) {
      if (winner === "X") {
        playSound('win')
        if (streak % 3 === 0) {
          toast({
            title: "🎉 ยินดีด้วย! คุณชนะ",
            description: `ชนะต่อเนื่อง ${streak} ครั้ง! ได้คะแนนโบนัสพิเศษ +1 คะแนน 🌟`,
            variant: "success",
            className: "font-krub"
          })
        } else if (streak % 3 === 2) {
          toast({
            title: "🎉 คุณชนะ!",
            description: `ชนะต่อเนื่อง ${streak} ครั้ง อีก 1 ครั้งจะได้โบนัส! 🎯`,
            variant: "success",
            className: "font-krub"
          })
        } else {
          toast({
            title: "🎉 คุณชนะ!",
            description: `ชนะแล้ว ${streak} ครั้ง เอาชนะให้ได้อีกนะ!`,
            variant: "success",
            className: "font-krub"
          })
        }
      } else if (winner === "O") {
        playSound('lose')
        toast({
          title: "😔 บอทชนะ!",
          description: "โชคดีในครั้งหน้านะ",
          variant: "destructive",
          className: "font-krub"
        })
      }
    } else if (board.every(square => square !== null)) {
      playSound('draw')
      toast({
        title: "🤝 เสมอ!",
        description: "เกมที่สนุกมาก",
        variant: "success",
        className: "font-krub"
      })
    }
  }, [winner, board, streak, toast, playSound])

  // Update stats when game ends
  useEffect(() => {
    const updateStats = async () => {
      if ((winner || board.every(square => square !== null)) && !hasUpdated) {
        let scoreChange = 0;
        if (winner === 'X') {
          scoreChange = 1; // Win +1
        } else if (winner === 'O') {
          scoreChange = -1; // Lose -1
        } // Draw +0

        const newStats = {
          total_score: stats.total_score + scoreChange,
          total_games: stats.total_games + 1,
          streak: streak
        }
        
        const result = await updateGameStats(newStats)
        
        if (result.success) {
          // update current_rank 
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
            className: "font-krub [&>div>h1]:text-xl [&>div>h1]:font-bold"
          })
        }
      }
    }
    
    updateStats()
  }, [winner, board, streak, stats.total_score, stats.total_games, hasUpdated])

  // Reset hasUpdated when starting a new game
  useEffect(() => {
    if (!winner && !board.every(square => square !== null)) {
      setHasUpdated(false)
    }
  }, [winner, board])

  // color rank
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

//rank icon ??
  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'Immortal God':
        return ''; 
      case 'Diamond':
        return ''; 
      case 'Platinum':
        return ''; 
      case 'Gold':
        return ''; 
      case 'Silver':
        return ''; 
      default:
        return ''; 
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1200px] w-full">
      {/* Game Board Section */}
      <div className="lg:col-span-8 lg:order-2 order-1">
        <Card className="shadow-lg mb-6 lg:mb-4">
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
                    <span className="font-medium">เริ่มเกมใหม่</span>
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
                : `ผู้เล่น คือ : ${currentPlayer}`}
              <span className="ml-2 text-gray-500">
                (เกมที่ {gamesPlayed + (winner || board.every(square => square !== null) ? 0 : 1)})
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="lg:col-span-4 lg:order-1 order-2">
        <Card className="shadow-md hover:shadow-lg transition-shadow mb-6 lg:mb-0">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <Icon icon="mdi:person-details-outline" />สถิติของคุณ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div>
              <p className="text-sm text-gray-500 leading-relaxed"> 🗡️ แรงค์ปัจจุบัน</p>
              <p className={`text-sm sm:text-base font-medium ${getRankColor(stats.current_rank)} flex items-center gap-2`}>
                <span>{getRankEmoji(stats.current_rank)}</span>
                <span>{stats.current_rank}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-relaxed">คะแนนรวมทั้งหมด</p>
              <p className="text-sm sm:text-base font-medium text-slate-500">{stats.total_score} คะแนน</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-relaxed">เกมที่เล่นทั้งหมด</p>
              <p className="text-sm sm:text-base font-medium text-slate-500">{stats.total_games} เกม</p>
            </div>
            <Link href="/leaderboards" className="block mt-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 bg-gray-50 hover:bg-blue-50 text-gray-700 text-sm flex items-center justify-center gap-2"
                onClick={() => {
                  resetGame()
                }}
              >
                <span>🏆</span>
                <span>ดูอันดับทั้งหมด</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Rules Section */}
      <div className="lg:col-span-8 lg:col-start-5 lg:order-3 order-3">
        <Card className="bg-gray-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <Icon icon="fluent:pen-sparkle-32-light" />กติกาการเล่น
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc list-inside text-base md:text-base text-gray-800 space-y-2">
              <li>ผู้เล่นเลือกช่องวาง X โดยการคลิก</li>
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
