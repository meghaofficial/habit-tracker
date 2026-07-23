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
