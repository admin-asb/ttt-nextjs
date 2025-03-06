const { configureStore } = require("@reduxjs/toolkit");

import gameReducer from "./game-slice";

const store = configureStore({
  reducer: { game: gameReducer },
});

export default store;
