import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { months } from "../../staticData";
import { getDaysInMonth, getFirstDayOfMonth } from "../../helper";
import type { DaywiseState, MonthData } from "../../types";
import { v4 as uuidv4 } from "uuid";

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
        taskwise: [{ taskID: uuidv4(), task: "", count: 0, progress: 0 }],
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

      curr.totalTasks++;
      curr.overallTotalDays = curr.totalTasks * curr.totalDaysInMonth;

      curr.progress.progressPercent = Math.floor(
        (curr.progress.totalDaysWorked / (totalRows * curr.totalDaysInMonth)) *
        100,
      );
      curr.taskwise.push({
        taskID: uuidv4(),
        task: "",
        count: 0,
        progress: 0,
      });
      Object.keys(curr.daywise).forEach((key) => {
        const day = Number(key);
        curr.daywise[day].progress =
          (curr.daywise[day].count / curr.totalTasks) * 100;
      });
    },
    updateTaskwiseCount: (
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

      // reset counts
      curr.forEach((task) => {
        task.count = 0;
      });

      // calculate counts using taskID
      Object.entries(checkboxData).forEach(([key, value]) => {
        if (!value) return;

        const parts = key.split("-");
        const taskID = parts.slice(0, -2).join("-");
        const task = curr.find((t) => t.taskID === taskID);

        if (task) {
          task.count += 1;
        }
      });

      // calculate progress
      curr.forEach((task) => {
        const count = task.count ?? 0;
        task.progress = totalD > 0 ? Math.floor((count / totalD) * 100) : 0;
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

      if (isMarked) {
        curr.daywise[day].count += 1;
        curr.progress.totalDaysWorked += 1;
      }
      else {
        curr.daywise[day].count -= 1;
        curr.progress.totalDaysWorked -= 1;
      }

      curr.daywise[day].progress =
        (curr.daywise[day].count / curr.totalTasks) * 100;

      curr.progress.progressPercent = Math.floor(
        (curr.progress.totalDaysWorked / curr.overallTotalDays) * 100,
      );
    },
    updateTaskName: (
      state,
      action: PayloadAction<{
        year: string;
        month: string;
        taskID: string;
        taskName: string;
      }>,
    ) => {
      const { year, month, taskID, taskName } = action.payload;
      if (!year || !month) return;
      const curr = state[year][month];
      const task = curr.taskwise.find((t) => t.taskID === taskID);
      if (task) {
        task.task = taskName;
      }
    },
    // updateTaskName: (
    //   state,
    //   action: PayloadAction<{
    //     taskID: string;
    //     taskName: string;
    //   }>,
    // ) => {
    //   const { taskID, taskName } = action.payload;
    //   const task = curr.taskwise.find((t) => t.taskID === taskID);
    //   if (task) {
    //     task.task = taskName;
    //   }
    // },
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
    deleteRow: (state, action) => {
      const { year, month, rowID } = action.payload;
      if (!year || !month) return;

      const curr = state[year][month];

      if (curr.totalTasks === 1) return;

      // 1. Remove checkbox keys of this task
      curr.checkboxKeys = curr.checkboxKeys.filter((c) => {
        const parts = c.split("-");
        const taskID = parts.slice(0, -2).join("-");
        return taskID !== rowID;
      });

      // 2. Remove task
      curr.taskwise = curr.taskwise.filter((t) => t.taskID !== rowID);
      curr.totalTasks -= 1;

      // 3. Reset daywise counts
      Object.values(curr.daywise).forEach((d) => {
        d.count = 0;
      });
      // 4. Recalculate daywise counts from remaining checkboxKeys
      curr.checkboxKeys.forEach((c) => {
        const parts = c.split("-");
        const weekIndex = Number(parts[parts.length - 2]);
        const dayIndex = Number(parts[parts.length - 1]);
        const day = weekIndex * 7 + dayIndex + 1;

        if (curr.daywise[day]) {
          curr.daywise[day].count += 1;
        }
      });
      // 5. Recalculate daywise progress
      Object.values(curr.daywise).forEach((d) => {
        d.progress =
          curr.totalTasks > 0 ? (d.count / curr.totalTasks) * 100 : 0;
      });

      // 6. Reset task counts
      curr.taskwise.forEach((t) => {
        t.count = 0;
      });

      // 7. Recalculate task counts
      const taskMap = new Map(curr.taskwise.map((t) => [t.taskID, t]));

      curr.checkboxKeys.forEach((c) => {
        const parts = c.split("-");
        const taskID = parts.slice(0, -2).join("-");
        const task = taskMap.get(taskID);

        if (task) {
          task.count += 1;
        }
      });

      // 8. Recalculate task progress
      curr.taskwise.forEach((t) => {
        t.progress =
          curr.totalDaysInMonth > 0
            ? Math.floor((t.count / curr.totalDaysInMonth) * 100)
            : 0;
      });

      curr.overallTotalDays -= curr.totalDaysInMonth;

      // 9. Recalculate overall progress
      const totalWorked = Object.values(curr.daywise).reduce(
        (acc, d) => acc + (d.count || 0),
        0,
      );

      curr.progress.totalDaysWorked = totalWorked;

      curr.progress.progressPercent =
        curr.totalDaysInMonth > 0
          ? Math.floor((totalWorked / curr.overallTotalDays) * 100)
          : 0;
    },
  },
});

export const {
  setYear,
  updateTotalTasks,
  updateTaskwiseCount,
  updateDaywiseCount,
  updateTaskName,
  addCheckboxKey,
  removeCheckboxKey,
  deleteRow,
} = monthlySlice.actions;

export default monthlySlice.reducer;
