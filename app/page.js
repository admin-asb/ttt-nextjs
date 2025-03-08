"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleComputerMove, startGame } from "@/store/game-slice";
import Intro from "@/components/Intro";
import Main from "@/components/Main";
import Results from "@/components/Results";

function useComputerMove(currentPlayer, computerSymbol) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentPlayer === computerSymbol) {
      const timer = setTimeout(() => dispatch(handleComputerMove()), 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, computerSymbol, dispatch]);
}

export default function Home() {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const { gameStarted, gameOver, currentPlayer, computerSymbol } = gameState;

  useComputerMove(currentPlayer, computerSymbol);

  function handleStartGame(name, chosenSymbol) {
    dispatch(startGame({ username: name, userSymbol: chosenSymbol }));
  }

  return (
    <>
      {!gameStarted && <Intro onStartGame={handleStartGame} />}
      {gameStarted && !gameOver && <Main />}
      {gameOver && <Results />}
    </>
  );
}
