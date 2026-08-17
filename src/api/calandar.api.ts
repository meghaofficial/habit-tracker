import { axiosPrivate } from "./axios";
import type { CalandarDateDataI } from "../types";

export const createCalendarDateData = async (data: CalandarDateDataI) => {
  const res = await axiosPrivate.post("/api/calandar", data);

  return res.data;
};

export const getCalendarDateData = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const res = await axiosPrivate.get(
    `/api/calandar?month=${month}&year=${year}`
  );

  return res.data;
};

export const updateCalendarDateData = async (data: {
  id: string;
  status: string;
  title: string;
  description: string;
}) => {
  const res = await axiosPrivate.patch("/api/calandar", data);

  return res.data;
};

export const deleteCalendarDateData = async (id: string) => {
  const res = await axiosPrivate.delete("/api/calandar", {
    data: { id },
  });

  return res.data;
};