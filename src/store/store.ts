// import { configureStore } from "@reduxjs/toolkit";
// import taskwiseReducer from "../slices/taskwiseSlice";
// import progressReducer from "../slices/progressSlice";

// export const store = configureStore({
//   reducer: {
//     taskwiseData: taskwiseReducer,
//     progress: progressReducer
//   }
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import taskwiseReducer from "../slices/taskwiseSlice";
import progressReducer from "../slices/progressSlice";

export const store = configureStore({
  reducer: {
    taskwiseData: taskwiseReducer,
    progress: progressReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;