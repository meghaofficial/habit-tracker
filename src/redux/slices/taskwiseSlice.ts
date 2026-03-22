import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TaskData = {
  task?: string;
  count: number;
  progress: number;
};

type TaskwiseState = Record<number, TaskData>;

const initialState: TaskwiseState = {
  0: {
    task: "",
    count: 0,
    progress: 0,
  },
};

const taskwiseSlice = createSlice({
  name: "taskwiseData",
  initialState,

  reducers: {
    // Replace entire state
    setTaskwiseData: (state, action: PayloadAction<TaskwiseState>) => {
      return action.payload;
    },

    addRow: (state) => {
      const newIndex = Object.keys(state).length;
      state[newIndex] = {
        task: "",
        count: 0,
        progress: 0,
      };
    },

    updateTaskCount: (
      state,
      action: PayloadAction<{
        checkboxData: Record<string, boolean>;
        totalD: number;
      }>,
    ) => {
      const { checkboxData, totalD } = action.payload;
      Object.keys(state).forEach((row) => {
        if (state[Number(row)]) {
          state[Number(row)].count = 0;
        }
      });
      Object.entries(checkboxData).forEach(([key, value]) => {
        if (!value) return;
        const rowIndex = Number(key.split("-")[0]);
        if (!state[rowIndex]) return;
        state[rowIndex].count += 1;
      });
      Object.keys(state).forEach((row) => {
        const count = state[Number(row)].count;
        state[Number(row)].progress =
          totalD > 0 ? Math.floor((count / totalD) * 100) : 0;
      });
    },

    // updating task - PENDING
    updateTask: (
      state,
      action: PayloadAction<{ checkboxData: Record<string, boolean> }>,
    ) => {},
  },
});

export const { setTaskwiseData, addRow, updateTaskCount } =
  taskwiseSlice.actions;

export default taskwiseSlice.reducer;
