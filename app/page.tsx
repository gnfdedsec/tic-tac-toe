import { GameBoard } from "@/components/GameBoard"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Tic Tac Toe</h1>
        <GameBoard />
      </div>
    </main>
  )
}