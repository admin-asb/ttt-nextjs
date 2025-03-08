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

      // If it's the first move, always choose the center if available
      if (!state.board[1][1]) {
        state.board[1][1] = state.computerSymbol;
        state.currentPlayer = state.userSymbol;
        return;
      }

      function findWinningMove(symbol) {
        for (const combination of WINNING_COMBINATIONS) {
          const [
            { row: r1, column: c1 },
            { row: r2, column: c2 },
            { row: r3, column: c3 },
          ] = combination;
          const cells = [
            state.board[r1][c1],
            state.board[r2][c2],
            state.board[r3][c3],
          ];

          if (
            cells.filter((cell) => cell === symbol).length === 2 &&
            cells.includes(null)
          ) {
            const emptyIndex = cells.indexOf(null);
            return [
              combination[emptyIndex].row,
              combination[emptyIndex].column,
            ];
          }
        }
        return null;
      }

      // 1. Check if the computer can win in the next move
      let bestMove = findWinningMove(state.computerSymbol);
      if (!bestMove) {
        // 2. Check if the computer needs to block the opponent's win
        bestMove = findWinningMove(state.userSymbol);
      }

      function minimax(board, depth, isMaximizing) {
        const winner = checkWinner({ board });
        if (winner === "computer") return 10 - depth;
        if (winner === "user") return depth - 10;
        if (isBoardFull(board)) return 0;

        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = state.computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[i][j] = null;
                bestScore = Math.max(bestScore, score);
              }
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = state.userSymbol;
                let score = minimax(board, depth + 1, true);
                board[i][j] = null;
                bestScore = Math.min(bestScore, score);
              }
            }
          }
          return bestScore;
        }
      }

      function isBoardFull(board) {
        return board.flat().every((cell) => cell !== null);
      }

      if (!bestMove) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!state.board[i][j]) {
              state.board[i][j] = state.computerSymbol;
              let score = minimax(state.board, 0, false);
              state.board[i][j] = null;
              if (score > bestScore) {
                bestScore = score;
                bestMove = [i, j];
              }
            }
          }
        }
      }

      if (bestMove) {
        const [row, col] = bestMove;
        state.board[row][col] = state.computerSymbol;
        checkWinner(state);
        if (!state.winner) state.currentPlayer = state.userSymbol;
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
