export type TaskData = {
  task?: string;
  count: number;
  progress: number;
};
type TaskwiseState = Record<number, TaskData>;
type ProgressState = {
  totalDaysWorked: number;
  progressPercent: number;
};
export type DayData = {
  count: number;
  progress: number;
};
export type DaywiseState = Record<number, DayData>;
export type MonthData = {
  firstDay: number;
  overallTotalDays: number;
  totalDaysInMonth: number;
  totalTasks: number; // total no of rows
  daywise: DaywiseState;
  taskwise: TaskwiseState;
  progress: ProgressState;
};

export type TargetType = {
  goal: string;
  isDone: boolean;
}