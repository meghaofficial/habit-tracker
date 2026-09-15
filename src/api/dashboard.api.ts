import { axiosPrivate } from "./axios";

// Get date logs
export const getDateLogs = async (dashboardID: string) => {
  const res = await axiosPrivate.get(
    `/api/date-logs?monthDashID=${dashboardID}`,
  );
  return res.data;
};

// Get tasks
export const getTasks = async (dashboardID: string) => {
  const res = await axiosPrivate.get(`/api/task?monthDashID=${dashboardID}`);
  return res.data;
};

export const addTask = async (dashboardID: string) => {
  const res = await axiosPrivate.post(`/api/task?monthDashID=${dashboardID}`, {
    taskName: "",
  });

  return res.data;
};

// Delete task
export const removeTask = async ({
  taskID,
  dashboardID,
}: {
  taskID: string;
  dashboardID: string;
}) => {
  const res = await axiosPrivate.delete(
    `/api/task?taskID=${taskID}&monthDashID=${dashboardID}`,
  );

  return res.data;
};

// Mark task
export const toggleTask = async ({
  dashboardID,
  fullDate,
  taskID,
  marked,
}: {
  dashboardID: string;
  fullDate: Date;
  taskID: string;
  marked: boolean;
}) => {
  const res = await axiosPrivate.patch(
    `/api/date-logs?monthDashID=${dashboardID}&fullDate=${fullDate}&taskID=${taskID}`,
    { marked },
  );

  return res.data;
};

// Reset dashboard
export const resetDateLogs = async (dashboardID: string) => {
  const res = await axiosPrivate.patch(
    `/api/reset-date-log?monthDashID=${dashboardID}`,
  );

  return res.data;
};

// Update taskname
export const updateTaskName = async ({
  taskId,
  taskName,
}: {
  taskId: string;
  taskName: string;
}) => {
  const res = await axiosPrivate.patch(`/api/task?taskID=${taskId}`, {
    taskName,
  });

  return res.data;
};

// Getting log by date
export const getDateLogByDate = async (monthDashID: string) => {
  const newDate = new Date();
  newDate.setUTCHours(0, 0, 0, 0);
  const isoMidnight = newDate.toISOString();
  const res = await axiosPrivate.get(
    `/api/get-log-date?monthDashID=${monthDashID}&fullDate=${isoMidnight}`,
  );

  return res.data;
};

const targetUrlHelper = (
  type: string,
  monthID: string,
  week?: number,
  dateNo?: number,
  targetID?: string,
) => {
  if (type === "daily") {
    return targetID
      ? `/api/daily-targets?monthDashID=${monthID}&dateNo=${dateNo}&targetID=${targetID}`
      : `/api/daily-targets?monthDashID=${monthID}&dateNo=${dateNo}`;
  } else if (type === "monthly") {
    return targetID
      ? `/api/monthly-targets?monthDashID=${monthID}&targetID=${targetID}`
      : `/api/monthly-targets?monthDashID=${monthID}`;
  } else {
    return targetID
      ? `/api/weekly-targets?monthDashID=${monthID}&week=${week}&targetID=${targetID}`
      : `/api/weekly-targets?monthDashID=${monthID}&week=${week}`;
  }
};

// Get targets
export const getTargets = async ({
  type,
  monthID,
  week,
  dateNo,
}: {
  type: string;
  monthID: string;
  week?: number;
  dateNo?: number;
}) => {
  const url = targetUrlHelper(type, monthID, week, dateNo);

  const res = await axiosPrivate.get(url);

  return res.data;
};

// Add target
export const addTarget = async ({
  type,
  monthID,
  week,
  target,
  dateNo,
}: {
  type: string;
  monthID: string;
  week?: number;
  target: string;
  dateNo?: number;
}) => {
  const url = targetUrlHelper(type, monthID, week, dateNo);

  const res = await axiosPrivate.post(url, {
    target,
  });

  return res.data;
};

// Mark target
export const markTarget = async ({
  type,
  monthID,
  week,
  targetID,
  mark,
  dateNo,
}: {
  type: string;
  monthID: string;
  week?: number;
  targetID: string;
  mark: boolean;
  dateNo?: number;
}) => {
  const url = targetUrlHelper(type, monthID, week, dateNo, targetID);

  const res = await axiosPrivate.patch(url, { mark });

  return res.data;
};

// Removing target
export const removeTarget = async ({
  type,
  monthID,
  week,
  targetID,
  dateNo,
}: {
  type: string;
  monthID: string;
  week?: number;
  targetID: string;
  dateNo?: number;
}) => {
  // const url =
  //   type === "monthly"
  //     ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${targetID}`
  //     : `/api/remove-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${targetID}`;

  const url = targetUrlHelper(type, monthID, week, dateNo, targetID);

  const res = await axiosPrivate.delete(url);

  return res.data;
};

// Get monthly note
export const getMonthlyNote = async ({ monthID }: { monthID: string }) => {
  const res = await axiosPrivate.get(
    `/api/monthly-note?monthDashID=${monthID}`,
  );

  return res.data;
};

// Update monthly note
export const updateMonthlyNote = async ({
  monthID,
  note,
}: {
  monthID: string;
  note: string;
}) => {
  const res = await axiosPrivate.put(
    `/api/monthly-note?monthDashID=${monthID}`,
    {
      note,
    },
  );

  return res.data;
};
