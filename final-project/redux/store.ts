import { configureStore } from "@reduxjs/toolkit";
import { BoardSlice } from "./currentBoard/slice";

const store = configureStore({
    reducer: {
        currentBoard: BoardSlice.reducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
