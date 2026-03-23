import { configureStore } from "@reduxjs/toolkit";
import taskwiseReducer from "../slices/taskwiseSlice";
import daywiseReducer from "../slices/daywiseSlice";
import monthlyReducer from "../slices/monthlySlice";

export const store = configureStore({
  reducer: {
    taskwiseData: taskwiseReducer,
    daywiseData: daywiseReducer,
    monthlyData: monthlyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;