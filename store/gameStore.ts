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

// -----------------------
// Model AI แบบที่ 1 (ง่ายกว่า) - เก็บไว้เป็น comment เผื่ออยากสลับกลับมาใช้
// -----------------------
/*
function getBotMoveModel1(board: (string | null)[]): number {
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
*/

// -----------------------
// Model AI แบบที่ 2 (ยากขึ้น) - ใช้ Minimax ทำให้ AI แทบไม่แพ้
// -----------------------
function getBotMove(board: (string | null)[]): number {
  const isMovesLeft = (b: (string | null)[]) => b.some(cell => cell === null)

  const minimax = (b: (string | null)[], isMaximizing: boolean): number => {
    const { winner } = calculateWinner(b)

    if (winner === "O") return 10
    if (winner === "X") return -10
    if (!isMovesLeft(b)) return 0

    if (isMaximizing) {
      // ตา AI (O) พยายามเลือกคะแนนสูงสุด
      let best = -Infinity
      for (let i = 0; i < b.length; i++) {
        if (!b[i]) {
          const newBoard = [...b]
          newBoard[i] = "O"
          const value = minimax(newBoard, false)
          best = Math.max(best, value)
        }
      }
      return best
    } else {
      // ตาผู้เล่น (X) พยายามทำให้คะแนน AI แย่ที่สุด
      let best = Infinity
      for (let i = 0; i < b.length; i++) {
        if (!b[i]) {
          const newBoard = [...b]
          newBoard[i] = "X"
          const value = minimax(newBoard, true)
          best = Math.min(best, value)
        }
      }
      return best
    }
  }

  let bestVal = -Infinity
  let bestMove = 0

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board]
      newBoard[i] = "O"
      const moveVal = minimax(newBoard, false)

      if (moveVal > bestVal) {
        bestVal = moveVal
        bestMove = i
      }
    }
  }

  return bestMove
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
    
    // If player wins
    if (winner === "X") {
      const newStreak = state.streak + 1
      const bonusScore = newStreak % 3 === 0 ? 1 : 0

      set(state => ({
        board: newBoard,
        winner,
        winningLine: line,
        score: state.score + 1 + bonusScore,
        streak: newStreak,
        gamesPlayed: state.gamesPlayed + 1 // Increment games played when game ends
      }))
      return
    }

    // Check for draw after player's move
    if (newBoard.every(square => square !== null)) {
      set(state => ({
        board: newBoard,
        winner: null,
        winningLine: null,
        gamesPlayed: state.gamesPlayed + 1 // Increment games played on draw
      }))
      return
    }

    // Bot's turn
    const botMove = getBotMove(newBoard)
    newBoard[botMove] = "O"
    const botResult = calculateWinner(newBoard)
    
    // If bot wins
    if (botResult.winner === "O") {
      set(state => ({
        board: newBoard,
        winner: botResult.winner,
        winningLine: botResult.line,
        score: state.score - 1,
        streak: 0,
        gamesPlayed: state.gamesPlayed + 1 // Increment games played when bot wins
      }))
      return
    }

    // Check for draw after bot's move
    if (newBoard.every(square => square !== null)) {
      set(state => ({
        board: newBoard,
        winner: null,
        winningLine: null,
        gamesPlayed: state.gamesPlayed + 1 // Increment games played on draw
      }))
      return
    }

    // If game is not over
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
      // Don't reset gamesPlayed
    }))
  }
}))

export default useGameStore
