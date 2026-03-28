export type TaskData = {
  taskID: string;
  task?: string;
  count: number;
  progress: number;
};
type TaskwiseState = TaskData[];
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
  checkboxKeys: string[],
};

export type TargetType = {
  goal: string;
  isDone: boolean;
};

export const statusColors: Record<string, { dot: string; bg: string }> = {
  default: {
    dot: "#9CA3AF",
    bg: "#F3F4F6",
  },
  important: {
    dot: "#EF4444",
    bg: "#FEE2E2",
  },
  event: {
    dot: "#3B82F6",
    bg: "#DBEAFE",
  },
  achievement: {
    dot: "#22C55E",
    bg: "#DCFCE7",
  },
  sick: {
    dot: "#A855F7",
    bg: "#F3E8FF",
  },
};
