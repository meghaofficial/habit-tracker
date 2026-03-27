import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { months } from "../../staticData";
import { getDaysInMonth, getFirstDayOfMonth } from "../../helper";
import type { DaywiseState, MonthData } from "../../types";

type RootState = {
  [year: string]: {
    [month: string]: MonthData;
  };
};

const initialState: RootState = {};

const monthlySlice = createSlice({
  name: "monthlyData",
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<{ year: string }>) => {
      const { year } = action.payload;

      const createDays = (noOfDays: number): DaywiseState => {
        const obj: DaywiseState = {};
        Array.from({ length: noOfDays }).forEach((_, index) => {
          obj[index + 1] = {
            count: 0,
            progress: 0,
          };
        });
        return obj;
      };

      const createMonth = (monthIndex: number): MonthData => ({
        firstDay: getFirstDayOfMonth(Number(year), monthIndex),
        overallTotalDays: getDaysInMonth(Number(year), monthIndex),
        totalDaysInMonth: getDaysInMonth(Number(year), monthIndex),
        totalTasks: 1,
        daywise: createDays(getDaysInMonth(Number(year), monthIndex)),
        taskwise: {
          0: {
            task: "",
            count: 0,
            progress: 0,
          },
        },
        progress: {
          totalDaysWorked: 0,
          progressPercent: 0,
        },
        checkboxKeys: [],
      });

      if (!state[year]) {
        const monthKeys = Object.keys(months);
        state[year] = monthKeys.reduce<Record<string, MonthData>>(
          (acc, month, index) => {
            acc[month] = createMonth(index);
            return acc;
          },
          {},
        );
      }
    },
    updateTotalTasks: (
      state,
      action: PayloadAction<{
        year: string;
        month: string;
        totalRows: number;
      }>,
    ) => {
      const { year, month, totalRows } = action.payload;
      if (!year || !month) return;
      const curr = state[year][month];
      curr.totalTasks = totalRows;
      curr.overallTotalDays = totalRows * curr.totalDaysInMonth;
      curr.progress.progressPercent = Math.floor(
        (curr.progress.totalDaysWorked / (totalRows * curr.totalDaysInMonth)) *
          100,
      );
      curr.taskwise[totalRows - 1] = {
        task: "",
        count: 0,
        progress: 0,
      };
      Object.keys(curr.daywise).forEach((key) => {
        const day = Number(key);
        curr.daywise[day].progress =
          (curr.daywise[day].count / curr.totalTasks) * 100;
      });
    },
    updateTaskCount: (
      state,
      action: PayloadAction<{
        year: string;
        month: string;
        checkboxData: Record<string, boolean>;
      }>,
    ) => {
      const { year, month, checkboxData } = action.payload;
      const curr = state[year][month].taskwise;
      const totalD = state[year][month].totalDaysInMonth;

      Object.keys(curr).forEach((row) => {
        const rowIndex = Number(row);
        curr[rowIndex].count = 0;
      });
      Object.entries(checkboxData).forEach(([key, value]) => {
        if (!value) return;
        const rowIndex = Number(key.split("-")[0]);
        curr[rowIndex].count += 1;
      });
      Object.keys(curr).forEach((row) => {
        const count = curr[Number(row)]?.count ?? 0;
        curr[Number(row)].progress =
          totalD > 0 ? Math.floor((count / totalD) * 100) : 0;
      });
    },
    updateDaywiseCount: (
      state,
      action: PayloadAction<{
        year: string;
        month: string;
        day: number;
        isMarked: boolean;
      }>,
    ) => {
      const { year, month, day, isMarked } = action.payload;
      const curr = state[year][month];
      if (isMarked) curr.daywise[day].count += 1;
      else curr.daywise[day].count -= 1;
      curr.daywise[day].progress =
        (curr.daywise[day].count / curr.totalTasks) * 100;
      curr.progress.totalDaysWorked += 1;
      curr.progress.progressPercent = Math.floor(
        (curr.progress.totalDaysWorked / curr.overallTotalDays) * 100,
      );
    },
    updateTaskName: (
      state,
      action: PayloadAction<{
        year: string;
        month: string;
        taskNo: number;
        taskName: string;
      }>,
    ) => {
      const { year, month, taskNo, taskName } = action.payload;
      if (!year || !month) return;
      const curr = state[year][month];
      curr.taskwise[taskNo].task = taskName;
    },
    addCheckboxKey: (state, action) => {
      const { year, month, cbk } = action.payload;
      if (!year || !month) return;

      const curr = state[year][month];

      if (!curr.checkboxKeys.includes(cbk)) {
        curr.checkboxKeys.push(cbk);
      }
    },
    removeCheckboxKey: (state, action) => {
      const { year, month, cbk } = action.payload;
      if (!year || !month) return;

      const curr = state[year][month];

      const index = curr.checkboxKeys.indexOf(cbk);
      if (index !== -1) {
        curr.checkboxKeys.splice(index, 1);
      }
    },
  },
});

export const {
  setYear,
  updateTotalTasks,
  updateTaskCount,
  updateDaywiseCount,
  updateTaskName,
  addCheckboxKey,
  removeCheckboxKey,
} = monthlySlice.actions;

export default monthlySlice.reducer;
