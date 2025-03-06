import { Caprasimo } from "next/font/google";
import { useSelector } from "react-redux";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
});

export default function Results() {
  const { totalGames, wins, losses, draws } = useSelector(
    (state) => state.game
  );
  return (
    <div className="bg-white max-w-lg px-10 py-10 rounded-xl text-center">
      <h2 className={`${caprasimo.variable} font-caprasimo text-5xl`}>
        Game over!
      </h2>
      <p className="pt-5 text-3xl">You won!</p>
      <p className="pt-5 text-xl">
        Total games: {totalGames}
        <br />
        Wins: {wins}
        <br />
        Losses: {losses}
        <br />
        Draws: {draws}
      </p>
    </div>
  );
}
