import { WINNING_COMBINATIONS } from "@/utils/winning-combinations";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  username: "",
  userSymbol: null,
  computerSymbol: null,
  gameStarted: false,
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  board: Array(3)
    .fill(null)
    .map(() => Array(3).fill(null)),
  currentPlayer: "x",
  winner: null,
  gameOver: false,
  winningCells: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame(state, action) {
      const { username, userSymbol } = action.payload;
      state.username = username;
      state.userSymbol = userSymbol;
      state.computerSymbol = userSymbol === "x" ? "o" : "x";
      state.gameStarted = true;
      state.board = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
      state.currentPlayer = "x";
    },
    makeMove(state, action) {
      const { row, col } = action.payload;
      if (
        state.board[row][col] ||
        state.currentPlayer !== state.userSymbol ||
        state.winner
      )
        return;

      state.board[row][col] = state.currentPlayer;
      state.currentPlayer = state.currentPlayer === "x" ? "o" : "x";
    },
    computerMove(state) {
      if (state.currentPlayer !== state.computerSymbol || state.winner) return;

      const availableMoves = [];
      state.board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell) availableMoves.push([rowIndex, colIndex]);
        });
      });

      if (availableMoves.length > 0) {
        const [row, col] =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
        state.board[row][col] = state.computerSymbol;
        state.currentPlayer = state.userSymbol;
      }

      return state;
    },
    checkWinner(state) {
      for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const symbol = state.board[a.row][a.column];

        if (
          symbol &&
          symbol === state.board[b.row][b.column] &&
          symbol === state.board[c.row][c.column]
        ) {
          state.winner = symbol === state.userSymbol ? "user" : "computer";
          state.winningCells = [a, b, c];
          return;
        }
      }

      if (state.board.flat().every((cell) => cell !== null)) {
        state.winner = "draw";
        state.winningCells = [];
      }
    },
    setGameOver(state) {
      state.gameOver = true;
      console.log(state.gameOver);
    },
    resetGame(state) {
      state.board = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
      state.currentPlayer = "x";
      state.winner = null;
      state.gameOver = false;
      state.winningCells = [];
    },
  },
});

export const checkWinnerWithDelay = () => (dispatch, getState) => {
  dispatch(gameSlice.actions.checkWinner());

  const { game } = getState();
  if (game.winner) {
    setTimeout(() => {
      dispatch(gameSlice.actions.setGameOver());
    }, 2000);
  }
};

export const handleComputerMove = () => (dispatch, getState) => {
  dispatch(gameSlice.actions.computerMove());
  dispatch(checkWinnerWithDelay()); // Now check the winner properly
};

export const { startGame, makeMove, computerMove, checkWinner, resetGame } =
  gameSlice.actions;
export default gameSlice.reducer;
