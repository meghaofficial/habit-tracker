import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DayData = {
  count: number;
  progress: number;
};

type DaywiseState = Record<number, DayData>;

const initialState: DaywiseState = {};

const daywiseSlice = createSlice({
  name: "daywiseData",
  initialState,

  reducers: {

    // Replace entire state
    setDaywiseData: (state, action: PayloadAction<DaywiseState>) => {
      return action.payload;
    },

    // Update a single col - currently not in use
    updateDayCount: (
      state,
      action: PayloadAction<{ colIndex: number; count: number; totalDays: number }>
    ) => {
      // const { colIndex, count, totalDays } = action.payload;

      // state[colIndex] = {
      //   count,
      //   progress: Math.floor((count / totalDays) * 100)
      // };
    }

  }
});

export const { setDaywiseData, updateDayCount } = daywiseSlice.actions;

export default daywiseSlice.reducer;