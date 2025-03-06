import { useSelector } from "react-redux";
import TicTacToeCell from "./TicTacToeCell";

export default function Main() {
  const { board, currentPlayer } = useSelector((state) => state.game);

  return (
    <div className="w-full">
      <div className="list-none flex gap-3 bg-white p-3 rounded">
        {["x", "o"].map((symbol) => (
          <div
            key={symbol}
            className={`text-center w-1/2 py-2 text-2xl ${
              currentPlayer === symbol
                ? "bg-background text-white rounded"
                : "text-background"
            }`}
          >
            {symbol}&apos;s Turn
          </div>
        ))}
      </div>

      <ol className="flex flex-wrap justify-center gap-2 mt-6 flex-col">
        {board.map((row, rowIndex) => (
          <li key={rowIndex}>
            <ol className="flex flex-wrap justify-center gap-2">
              {row.map((playerSymbol, colIndex) => (
                <li key={colIndex}>
                  <TicTacToeCell
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    playerSymbol={playerSymbol}
                  />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
