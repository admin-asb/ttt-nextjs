"use client";

import { Caprasimo } from "next/font/google";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeMove } from "@/store/game-slice";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
});

export default function TicTacToeCell({ rowIndex, colIndex, playerSymbol }) {
  const dispatch = useDispatch();
  const { winner, winningCells } = useSelector((state) => state.game);
  const [showWinningCells, setShowWinningCells] = useState(false);

  useEffect(() => {
    if (winner) {
      console.log(winner);
      setShowWinningCells(true);
      setTimeout(() => setShowWinningCells(false), 2000);
    }
  }, [winner]);

  function handleMove(row, col) {
    dispatch(makeMove({ row, col }));
  }

  const isWinningCell = winningCells.some(
    (cell) => cell.row === rowIndex && cell.column === colIndex
  );

  return (
    <button
      className={`${
        caprasimo.variable
      } font-caprasimo w-24 h-24 text-5xl cursor-pointer p-2 rounded ${
        isWinningCell && showWinningCells
          ? "bg-background text-black border-white border-8"
          : "bg-white text-background border-none"
      }`}
      onClick={() => handleMove(rowIndex, colIndex)}
      disabled={!!playerSymbol || winner}
    >
      {playerSymbol}
    </button>
  );
}
