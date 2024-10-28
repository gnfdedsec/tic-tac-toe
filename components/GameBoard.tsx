"use client"

import { useEffect } from "react"
import { Square } from "@/components/Square"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RotateCw } from "lucide-react"
import useGameStore from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Score: {score}</h2>
            <Button
              variant="outline"
              onClick={resetGame}
              className="flex items-center gap-2 px-3 h-8"
            >
              <RotateCw className="h-4 w-4" /> 
              <span className="text-lg font-semibold text-gray-600">เริ่มเกมส์ใหม่</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-3 gap-2">
            {board.map((value, index) => (
              <Square
                key={index}
                value={value}
                onClick={() => currentPlayer === "X" && makeMove(index)}
                isWinningSquare={winningLine?.includes(index)}
              />
            ))}
          </div>

          <p className="text-lg font-medium">
            {winner
              ? `Winner: ${winner}`
              : board.every((square) => square !== null)
              ? "Draw!"
              : `Current player: ${currentPlayer}`}
          </p>
        </CardContent>
      </Card>

      <Card className="w-full bg-gray-50">
        <CardHeader>
          <CardTitle className="text-xl"> กติกาการเล่น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>เลือกช่องที่ต้องการวาง X โดยการคลิก</li>
            <li>ชนะ: ได้ 1 คะแนน</li>
            <li>แพ้: เสีย 1 คะแนน</li>
            <li>ชนะ 3 ครั้งติดต่อกัน: ได้โบนัส 1 คะแนน</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
