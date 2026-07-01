export const statusColors: Record<
  string,
  { dot: string; bg: string; ddot: string; dbg: string }
> = {
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
  count: number;
  progress: string;
}

// Newly added
export interface SubscriptionI {
  _id: string;
  userID: string;
  planID: string;
  planType: string;
  timezone: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PlanI {
  _id: string;
  planName: string;
  planType: string;
  no_of_months: number;
  amount: number;
  description: string;
}

export interface DashboardI {
  _id: string;
  userID: string;
  month: number;
  year: number;
  totalDays: number;
  firstDay: number;
}

export interface TaskI {
  _id: string;
  monthDashID: string;
  taskName: string;
}

export interface DateLogI {
  _id: string;
  monthDashID: string;
  fullDate: Date;
  tasks: string[];
}

export interface MonthlyNoteI {
  _id: string;
  monthDashID: string;
  note: string;
}

export interface MonthlyTargetsI {
  _id: string;
  monthDashID: string;
  targets: { _id: string; value: string; completed: boolean }[];
}

export interface WeeklyTargetsI {
  _id: string;
  monthDashID: string;
  week: number;
  targets: { _id: string; value: string; completed: boolean }[];
}

export interface MonthsI {
  _id: string;
  planID: string;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
}

export interface OverallProgressI {
  total: number;
  count: number;
  progress: string | number;
}

export interface DateLogProgressI {
  fullDate: Date | string;
  count: number;
  progress: string | number;
}

export interface TaskProgressI {
  id: string;
  count: number;
  progress: string | number;
}

export interface StreakI {
  streak: number;
  longestStreak: number;
  mostConsistentHabits: string[];
  leastConsistentHabits: string[];
}

export interface HeatMapI {
  date: Date;
  count: number
}