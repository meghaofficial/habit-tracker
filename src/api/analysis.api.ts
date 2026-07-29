import { axiosPrivate } from "./axios";

export const getWeeklyActivity = async (monthDashID: string) => {
  const res = await axiosPrivate.get(
    `/api/get-weekly-activity?monthDashID=${monthDashID}`,
  );

  return res.data;
};

export const getMonthlyActivity = async (monthDashID: string) => {
  const res = await axiosPrivate.get(
    `/api/get-monthly-activity?monthDashID=${monthDashID}`,
  );

  return res.data;
};

export const getTopLevelAnalysis = async (monthDashID: string) => {
  const res = await axiosPrivate.get(
    `/api/analysis?monthDashID=${monthDashID}`,
  );

  return res.data;
};