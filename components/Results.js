import { resetGame, saveGameResult } from "@/store/game-slice";
import { Caprasimo } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import Intro from "./Intro";
import { useEffect } from "react";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
});

export default function Results() {
  const dispatch = useDispatch();
  const { totalGames, wins, losses, draws, winner, username } = useSelector(
    (state) => state.game
  );

  function handleResetGame() {
    dispatch(resetGame());
  }

  useEffect(() => {
    if (username) {
      dispatch(saveGameResult(username, wins, losses, draws));
    }
  }, [dispatch, username, wins, losses, draws]);

  const result = winner
    ? winner === "user"
      ? "You won!"
      : winner === "computer"
      ? "You lost!"
      : "It's a draw!"
    : "No winner determined.";

  return (
    <div className="bg-white max-w-lg px-10 py-10 rounded-xl text-center">
      <h2 className={`${caprasimo.variable} font-caprasimo text-5xl`}>
        Game over!
      </h2>
      <p className="pt-5 text-3xl">{result}</p>
      <p className="pt-5 text-xl">
        Total games: {totalGames}
        <br />
        Wins: {wins}
        <br />
        Losses: {losses}
        <br />
        Draws: {draws}
      </p>
      <button
        onClick={handleResetGame}
        className="mt-10 bg-background text-center text-white p-3 rounded text-2xl font-medium"
      >
        Reset Game
      </button>
    </div>
  );
}
