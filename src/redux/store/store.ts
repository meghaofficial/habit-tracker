import { configureStore } from "@reduxjs/toolkit";
import monthlyReducer from "../slices/monthlySlice";

export const store = configureStore({
  reducer: {
    monthlyData: monthlyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;