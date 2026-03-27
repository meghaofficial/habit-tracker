import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DateDataState {
  status: string;
  note?: string;
}

const initialState: Record<string, DateDataState> = {}; //24-Feb-2026

// status - default,

const dateDataSlice = createSlice({
  name: "dateData",
  initialState,
  reducers: {
    setNote: (
      state,
      action: PayloadAction<{
        date: number;
        month: string;
        year: number;
        note: string;
      }>,
    ) => {
      const { date, month, year, note } = action.payload;
      if (!year || !month || !date) return;
      const key = `${date}-${month}-${year}`;
      state[key] = {
        status: state[key]?.status ?? "default",
        note,
      };
    },
    setStatus: (
      state,
      action: PayloadAction<{
        date: number;
        month: string;
        year: number;
        status: string;
      }>,
    ) => {
      const { date, month, year, status } = action.payload;
      if (!year || !month || !date) return;
      const key = `${date}-${month}-${year}`;
      state[key] = { 
        ...state[key],
        status,
      };
    },
  },
});

export const { setNote, setStatus } = dateDataSlice.actions;

export default dateDataSlice.reducer;
