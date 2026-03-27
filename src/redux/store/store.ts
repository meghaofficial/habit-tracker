import { configureStore } from "@reduxjs/toolkit";
import monthlyReducer from "../slices/monthlySlice";
import dateDataReducer from "../slices/dateDataSlice";

export const store = configureStore({
  reducer: {
    monthlyData: monthlyReducer,
    dateData: dateDataReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;