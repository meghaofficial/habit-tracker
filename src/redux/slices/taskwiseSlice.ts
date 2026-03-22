import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TaskData = {
  task?: string;
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
      action: PayloadAction<{ checkboxData: Record<string, boolean> }>,
    ) => {
      const { checkboxData } = action.payload;

      // 1. Reset counts
      Object.keys(state).forEach((row) => {
        state[Number(row)].count = 0;
      });

      // 2. Count checked boxes
      Object.entries(checkboxData).forEach(([key, value]) => {
        if (!value) return;

        const rowIndex = Number(key.split("-")[0]);
        state[rowIndex].count += 1;
      });

      // 3. Calculate progress
      Object.keys(state).forEach((row) => {
        const count = state[Number(row)].count;
        state[Number(row)].progress = Math.floor((count / 31) * 100);
        // NOTE: You have 31 checkboxes (4*7 + 3 = 31), not 30
      });
    },

    // updating task - PENDING
  },
});

export const { setTaskwiseData, updateTaskCount } = taskwiseSlice.actions;

export default taskwiseSlice.reducer;
