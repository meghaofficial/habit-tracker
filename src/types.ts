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
  checkboxKeys: string[];
};

export type TargetType = {
  goal: string;
  isDone: boolean;
};

export const statusColors: Record<string, { dot: string; bg: string; ddot: string, dbg: string }> = {
  default: {
    dot: "#9CA3AF",
    bg: "#F3F4F6",
    ddot: "#9CA3AF",
    dbg: "#334155",
  },
  important: {
    dot: "#EF4444",
    bg: "#FEE2E2",
    ddot: "#F87171",
    dbg: "#3F1D1D",
  },
  event: {
    dot: "#3B82F6",
    bg: "#DBEAFE",
    ddot: "#60A5FA",
    dbg: "#1E3A5F",
  },
  achievement: {
    dot: "#22C55E",
    bg: "#DCFCE7",
    ddot: "#4ADE80",
    dbg: "#1C3D2B",
  },
  sick: {
    dot: "#A855F7",
    bg: "#F3E8FF",
    ddot: "#C084FC",
    dbg: "#3B1E54",
  },
};

export const statusColorsDark: Record<string, { dot: string; bg: string }> = {
  default: {
    dot: "#9CA3AF", // stays neutral
    bg: "#1F2937", // dark gray
  },
  important: {
    dot: "#F87171", // softer red (not too harsh)
    bg: "#3F1D1D", // deep red tint
  },
  event: {
    dot: "#60A5FA", // lighter blue for visibility
    bg: "#1E3A5F", // deep blue tint
  },
  achievement: {
    dot: "#4ADE80", // bright green
    bg: "#1C3D2B", // deep green tint
  },
  sick: {
    dot: "#C084FC", // soft purple
    bg: "#3B1E54", // deep purple tint
  },
};


// NEWNEW

export interface ITaskData {
  checkboxKey: string;
  fullDate: string;
  isChecked: boolean;
  _id: string;
}

export interface ITask {
  _id: string;
  name: string;
  taskData: ITaskData[];
}