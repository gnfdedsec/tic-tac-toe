"use client"

import { useEffect } from "react"
import { Square } from "@/components/Square"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RotateCw } from "lucide-react"
import useGameStore from "@/store/gameStore"

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
        toast({
          title: "You won! 🎉",
          description: `Streak: ${streak}${streak >= 3 ? " - Bonus point awarded! 🌟" : ""}`,
        })
      } else if (winner === "O") {
        toast({
          title: "Bot won!",
          description: "Better luck next time! 😊",
          variant: "destructive",
        })
      }
    } else if (board.every((square) => square !== null)) {
      toast({
        title: "It's a draw!",
        description: "Well played! 🤝",
      })
    }
  }, [winner, board, streak, toast])

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Score: {score}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={resetGame}
          className="h-8 w-8"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      
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
    </div>
  )
}