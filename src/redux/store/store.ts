import { configureStore } from "@reduxjs/toolkit";
import taskwiseReducer from "../slices/taskwiseSlice";
import progressReducer from "../slices/progressSlice";
import daywiseReducer from "../slices/daywiseSlice";

export const store = configureStore({
  reducer: {
    taskwiseData: taskwiseReducer,
    progress: progressReducer,
    daywiseData: daywiseReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;