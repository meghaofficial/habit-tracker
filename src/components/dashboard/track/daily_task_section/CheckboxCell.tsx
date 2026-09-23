import React, { useEffect, useState } from "react";
import type { ProgressI } from "../../../../types";
import { useMutation } from "@tanstack/react-query";
import { toggleTask } from "../../../../api/dashboard.api";
import { notify } from "../../../../helper";
import { socket } from "../../../../socket/socket";

export const CheckboxCell = React.memo(
  ({
    checked,
    fullDate,
    taskID,
    isToday,
    dashbID,
    setProgress,
  }: {
    checked: boolean;
    fullDate: Date;
    taskID: string;
    isToday: boolean;
    dashbID: string;
    setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
  }) => {
    const [currCheckVal, setCurrCheckVal] = useState(checked);

    const toggleTaskMutation = useMutation({
      mutationFn: toggleTask,
      onSuccess: (data, variables) => {
        const pr = data.progress;
        setProgress((prev) => ({
          ...prev,
          overallProgress: pr.overallProgress,
          dateLogProgress: prev.dateLogProgress.map((d) =>
            d.fullDate === pr.dateLogProgress.fullDate ? pr.dateLogProgress : d,
          ),
          taskProgress: prev.taskProgress.map((d) =>
            d.id === pr.taskProgress.id ? pr.taskProgress : d,
          ),
        }));

        setCurrCheckVal(variables.marked);
      },
      onError: () => {
        notify.error("Please try again.");
      },
    });

    const toggleTaskID = toggleTaskMutation.isPending
      ? toggleTaskMutation.variables?.taskID
      : "";

    const onToggle = (date: Date, taskID: string, marked: boolean) => {
      const today = new Date();

      const current = today.getDate();
      const target = new Date(fullDate).getDate();

      if (current !== target) return;
      toggleTaskMutation.mutate({
        dashboardID: dashbID,
        fullDate: date,
        taskID,
        marked,
        socketID: socket?.id || "",
      });
    };

    useEffect(() => {
      setCurrCheckVal(checked);
    }, [checked]);

    useEffect(() => {
      const handleTaskMark = (data: any) => {
        const pr = data;
        console.log(data);
        setProgress((prev) => ({
          ...prev,
          overallProgress: pr?.overallProgress,
          dateLogProgress: prev?.dateLogProgress?.map((d) =>
            d.fullDate === pr?.dateLogProgress?.fullDate
              ? pr?.dateLogProgress
              : d,
          ),
          taskProgress: prev?.taskProgress?.map((d) =>
            d.id === pr?.taskProgress.id ? pr?.taskProgress : d,
          ),
        }));

        // setCurrCheckVal(data?.marked);
        if (
          data?.taskProgress?.id === taskID &&
          new Date(data?.dateLogProgress?.fullDate).toDateString() ===
            new Date(fullDate).toDateString()
        ) {
          setCurrCheckVal(data?.marked);
        }
      };

      socket.on("mark-task", handleTaskMark);

      return () => {
        socket.off("mark-task", handleTaskMark);
      };
    }, [socket]);

    return toggleTaskID === taskID ? (
      <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
    ) : (
      <span
        onClick={() => onToggle(fullDate, taskID, !currCheckVal)}
        className={`h-4 w-4 rounded transition-all duration-200 ${
          isToday ? "cursor-pointer" : "cursor-default"
        } ${
          currCheckVal
            ? isToday
              ? "bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]"
              : "bg-emerald-400/40"
            : isToday
              ? "bg-white/8 border border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/10"
              : "bg-white/5 border border-white/8"
        }`}
      />
    );
  },
);
