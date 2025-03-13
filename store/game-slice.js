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
      const { username, userSymbol, wins, losses, draws, totalGames } =
        action.payload;
      state.username = username;
      state.userSymbol = userSymbol;
      state.computerSymbol = userSymbol === "x" ? "o" : "x";
      state.gameStarted = true;
      state.wins = wins;
      state.losses = losses;
      state.draws = draws;
      state.totalGames = totalGames;
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

      let bestMove = findWinningMove(state.computerSymbol);
      if (!bestMove) {
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

          if (state.winner === "user") {
            state.wins++;
          } else {
            state.losses++;
          }
          return;
        }
      }

      if (state.board.flat().every((cell) => cell !== null)) {
        state.winner = "draw";
        state.winningCells = [];
        state.draws++;
      }
    },
    updateStats(state, action) {
      state.wins = action.payload.wins;
      state.losses = action.payload.losses;
      state.draws = action.payload.draws;
      state.totalGames = action.payload.totalGames;
    },
    setGameOver(state) {
      state.gameOver = true;
    },
    resetGame(state) {
      state.board = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
      state.currentPlayer = "x";
      state.winner = null;
      state.gameOver = false;
      state.winningCells = [];
      state.gameStarted = false;
    },
  },
});

export const fetchUserData = (username, userSymbol) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://tic-tac-toe-b527d-default-rtdb.firebaseio.com/users/${username}.json`
      );

      const data = await response.json();

      const userStats = data || { wins: 0, losses: 0, draws: 0, totalGames: 0 };

      dispatch(
        gameSlice.actions.startGame({ username, userSymbol, ...userStats })
      );
    } catch (error) {
      console.error("Error checking user in database:", error);
    }
  };
};

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
  dispatch(checkWinnerWithDelay());

  const { game } = getState();
  if (game.winner) return;

  dispatch(gameSlice.actions.computerMove());
  dispatch(checkWinnerWithDelay());
};

export const saveGameResult = (username, wins, losses, draws) => {
  return async (dispatch) => {
    try {
      const totalGames = wins + losses + draws;

      await fetch(
        `https://tic-tac-toe-b527d-default-rtdb.firebaseio.com/users/${username}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wins, losses, draws, totalGames }),
        }
      );

      dispatch(
        gameSlice.actions.updateStats({ wins, losses, draws, totalGames })
      );
    } catch (error) {
      throw new Error("Updating data failed!", error);
    }
  };
};

export const { startGame, makeMove, computerMove, checkWinner, resetGame } =
  gameSlice.actions;
export default gameSlice.reducer;
