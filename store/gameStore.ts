import { create } from "zustand"

type Player = "X" | "O"

interface GameState {
  board: (string | null)[]
  currentPlayer: Player
  winner: Player | null
  winningLine: number[] | null
  score: number
  streak: number
  gamesPlayed: number
  initialStats: {
    total_score: number
    total_games: number
  }
  makeMove: (index: number) => void
  resetGame: () => void
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
]

function calculateWinner(board: (string | null)[]): { winner: Player | null; line: number[] | null } {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] }
    }
  }
  return { winner: null, line: null }
}

function getBotMove(board: (string | null)[]): number {
  // Try to win
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = [...board]
      testBoard[i] = "O"
      if (calculateWinner(testBoard).winner === "O") {
        return i
      }
    }
  }

  // Block player from winning
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = [...board]
      testBoard[i] = "X"
      if (calculateWinner(testBoard).winner === "X") {
        return i
      }
    }
  }

  // Try to take center
  if (!board[4]) return 4

  // Take any corner
  const corners = [0, 2, 6, 8]
  const availableCorners = corners.filter(i => !board[i])
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)]
  }

  // Take any available space
  const availableSpaces = board.map((_, i) => i).filter(i => !board[i])
  return availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
}

const useGameStore = create<GameState>((set, get) => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  winningLine: null,
  score: 0,
  streak: 0,
  gamesPlayed: 0,
  initialStats: {
    total_score: 0,
    total_games: 0
  },

  makeMove: (index: number) => {
    const state = get()
    if (state.board[index] || state.winner) return

    const newBoard = [...state.board]
    newBoard[index] = state.currentPlayer

    const { winner, line } = calculateWinner(newBoard)
    
    // ถ้าผู้เล่นชนะ
    if (winner === "X") {
      const newStreak = state.streak + 1
      const bonusScore = newStreak % 3 === 0 ? 1 : 0

      set(state => ({
        board: newBoard,
        winner,
        winningLine: line,
        score: state.score + 1 + bonusScore,
        streak: newStreak,
        gamesPlayed: state.gamesPlayed + 1 // เพิ่มจำนวนเกมเมื่อจบเกม
      }))
      return
    }

    // เช็คเกมเสมอหลังจากผู้เล่นเดิน
    if (newBoard.every(square => square !== null)) {
      set(state => ({
        board: newBoard,
        winner: null,
        winningLine: null,
        gamesPlayed: state.gamesPlayed + 1 // เพิ่มจำนวนเกมเมื่อเสมอ
      }))
      return
    }

    // Bot's turn
    const botMove = getBotMove(newBoard)
    newBoard[botMove] = "O"
    const botResult = calculateWinner(newBoard)
    
    // ถ้า bot ชนะ
    if (botResult.winner === "O") {
      set(state => ({
        board: newBoard,
        winner: botResult.winner,
        winningLine: botResult.line,
        score: state.score - 1,
        streak: 0,
        gamesPlayed: state.gamesPlayed + 1 // เพิ่มจำนวนเกมเมื่อ bot ชนะ
      }))
      return
    }

    // เช็คเกมเสมอหลังจาก bot เดิน
    if (newBoard.every(square => square !== null)) {
      set(state => ({
        board: newBoard,
        winner: null,
        winningLine: null,
        gamesPlayed: state.gamesPlayed + 1 // เพิ่มจำนวนเกมเมื่อเสมอ
      }))
      return
    }

    // ถ้าเกมยังไม่จบ
    set({
      board: newBoard,
      currentPlayer: "X"
    })
  },

  resetGame: () => {
    set(state => ({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      winningLine: null
      // ไม่ต้องรีเซ็ต gamesPlayed
    }))
  }
}))

export default useGameStore
