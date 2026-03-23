import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProgressState } from "../../types";

const initialState: ProgressState = {
  totalDays: 0,
  totalDaysWorked: 0,
  progressPercent: 0
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {

    setTotalDaysWorked: (state, action: PayloadAction<number>) => {
      state.totalDaysWorked = action.payload;
      state.progressPercent = Math.floor(
        (state.totalDaysWorked / state.totalDays) * 100
      );
    },

    setTotalDays: (state, action: PayloadAction<number>) => {
      state.totalDays = action.payload;
      state.progressPercent = Math.floor(
        (state.totalDaysWorked / state.totalDays) * 100
      );
    },

    // Replace entire state
    setProgressData: (state, action: PayloadAction<ProgressState>) => {
      return action.payload;
    }

  }
});

export const {
  setTotalDaysWorked,
  setTotalDays,
  setProgressData
} = progressSlice.actions;

export default progressSlice.reducer;