import { useState } from "react";

export default function Intro({ onStartGame }) {
  const [username, setUsername] = useState("");

  return (
    <div className="bg-white max-w-lg px-10 py-10 rounded-xl">
      <h1 className="font-bold text-3xl border-b border-gray-300 pb-5 mb-5">
        Tic Tac Toe
      </h1>
      <label htmlFor="name" className="text-2xl font-medium">
        Your Name:
      </label>
      <input
        type="text"
        id="name"
        className="text-base w-40 p-2 animate-pulse bg-blue-100 focus:outline-orange-300 text-center uppercase rounded-lg ml-3"
        onChange={(e) => setUsername(e.target.value)}
      />
      <p className="text-2xl font-medium mt-5">
        Select which one do you want to be?
      </p>
      <div className="list-none flex mt-5 gap-3">
        {["x", "o"].map((symbol) => (
          <button
            key={symbol}
            onClick={() => onStartGame(username, symbol)}
            className="w-1/2 bg-background text-center text-white py-3 rounded text-2xl font-medium cursor-pointer"
          >
            Player ({symbol})
          </button>
        ))}
      </div>
    </div>
  );
}
