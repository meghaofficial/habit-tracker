import React from "react";
import type { DateLogI, ProgressI } from "../../../../types";
import { CheckboxCell } from "./CheckboxCell";

export const TaskRow = React.memo(
  ({
    taskID,
    logs,
    weekOffset,
    todayDate,
    dashbID,
    setProgress,
  }: {
    taskID: string;
    logs: DateLogI[];
    weekOffset: number;
    todayDate: number;
    dashbID: string;
    setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
  }) =>
    logs.map((log, i) => {
      const dayNum = weekOffset + i + 1;
      const isToday = dayNum === todayDate;

      return (
        <CheckboxCell
          key={log._id}
          checked={log?.tasks?.includes(taskID)}
          fullDate={log.fullDate}
          taskID={taskID}
          isToday={isToday}
          dashbID={dashbID}
          setProgress={setProgress}
        />
      );
    }),
);
