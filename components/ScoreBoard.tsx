"use client";

import { Trophy, Flame } from "lucide-react";
import useGameStore from "@/store/gameStore";

export default function ScoreBoard() {
  const { score, streak } = useGameStore();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="text-lg font-semibold">Score: {score}</span>
      </div>
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-lg font-semibold">Streak: {streak}</span>
      </div>
    </div>
  );
}