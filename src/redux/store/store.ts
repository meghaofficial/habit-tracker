import { configureStore } from "@reduxjs/toolkit";
import monthlyReducer from "../slices/monthlySlice";
import dateDataReducer from "../slices/dateDataSlice";
import authReducer from "../slices/authSlice";

export const store = configureStore({
  reducer: {
    monthlyData: monthlyReducer,
    dateData: dateDataReducer,
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;