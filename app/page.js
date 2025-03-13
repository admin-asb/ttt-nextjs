"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, handleComputerMove } from "@/store/game-slice";
import Intro from "@/components/Intro";
import Main from "@/components/Main";
import Results from "@/components/Results";

function useComputerMove(currentPlayer, computerSymbol, gameOver) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("gameOver:", gameOver);

    if (gameOver) return;

    if (currentPlayer === computerSymbol) {
      const timer = setTimeout(() => dispatch(handleComputerMove()), 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, computerSymbol, gameOver, dispatch]);
}

export default function Home() {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const { gameStarted, gameOver, currentPlayer, computerSymbol } = gameState;

  useComputerMove(currentPlayer, computerSymbol, gameOver);

  function handleStartGame(name, chosenSymbol) {
    dispatch(fetchUserData(name, chosenSymbol));
  }

  return (
    <>
      {!gameStarted && <Intro onStartGame={handleStartGame} />}
      {gameStarted && !gameOver && <Main />}
      {gameOver && <Results />}
    </>
  );
}

/// чекнуть есть ли юзернэйм или в поле для юзернэйма добавить "обязательное заполнение"
/// не позволять компьютеру играть после определения победителя
