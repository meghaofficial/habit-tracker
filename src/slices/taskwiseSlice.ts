import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TaskData = {
  count: number;
  progress: number;
};

type TaskwiseState = Record<number, TaskData>;

const initialState: TaskwiseState = {};

const taskwiseSlice = createSlice({
  name: "taskwiseData",
  initialState,

  reducers: {

    // Replace entire state
    setTaskwiseData: (state, action: PayloadAction<TaskwiseState>) => {
      return action.payload;
    },

    // Update a single row
    updateTaskCount: (
      state,
      action: PayloadAction<{ rowIndex: number; count: number }>
    ) => {
      const { rowIndex, count } = action.payload;

      state[rowIndex] = {
        count,
        progress: Math.floor((count / 31) * 100)
      };
    }

  }
});

export const { setTaskwiseData, updateTaskCount } = taskwiseSlice.actions;

export default taskwiseSlice.reducer;