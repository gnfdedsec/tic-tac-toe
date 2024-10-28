"use client"

import { cn } from "@/lib/utils"

interface SquareProps {
  value: string | null
  onClick: () => void
  isWinningSquare?: boolean
}

export function Square({ value, onClick, isWinningSquare }: SquareProps) {
  return (
    <button
      className={cn(
        "h-20 w-20 border-2 border-gray-300 text-4xl font-bold transition-colors",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50",
        isWinningSquare && "bg-slate-300 hover:bg-grey-300"
      )}
      onClick={onClick}
    >
      {value}
    </button>
  )
}