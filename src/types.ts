type DayData = {
  count: number;
  progress: number;
};
export type DaywiseState = Record<number, DayData>;

type TaskData = {
  task?: string;
  count: number;
  progress: number;
};
export type TaskwiseState = Record<number, TaskData>;

export type ProgressState = {
  totalDays: number;
  totalDaysWorked: number;
  progressPercent: number;
};

export type RootState = {
  data: {
    [year: string]: {
      [month: string]: {
        daywise: DaywiseState;
        taskwise: TaskwiseState;
        progress: ProgressState;
      };
    };
  };
};






export type MonthData = {
  firstDay: number;
  overallTotalDays: number;
  totalDaysInMonth: number;
  totalTasks: number; // total no of rows
  daywise: DaywiseState;
  taskwise: TaskwiseState;
  progress: ProgressState;
};