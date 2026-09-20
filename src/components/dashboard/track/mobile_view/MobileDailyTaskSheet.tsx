import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { DashboardI, DateLogI, ProgressI, TaskI } from "../../../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTask,
  getDateLogs,
  removeTask,
  resetDateLogs,
} from "../../../../api/dashboard.api";
import { notify } from "../../../../helper";

interface Props {
  dashboardData: DashboardI;
  taskList: TaskI[];
  onToggle: (taskID: string, fullDate: Date, marked: boolean) => void;
  monthStatus: string;
  setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
}

const TASK_COLUMN_WIDTH = 144;
const DATE_COLUMN_WIDTH = 64;

const MobileDailyTaskSheet = ({
  dashboardData,
  taskList,
  onToggle,
  monthStatus,
  setProgress,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowLimit = 10;
  const queryClient = useQueryClient();
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);

  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dateLogsData = useQuery({
    queryKey: ["date_logs", dashboardData?._id],
    queryFn: () => getDateLogs(dashboardData?._id),
    enabled: !!dashboardData?._id,
  });

  const dateLogs: DateLogI[] = dateLogsData?.data?.dateLogs ?? [];

  const today = new Date();

  const sortedDateLogs = useMemo(() => {
    return [...dateLogs].sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
    );
  }, [dateLogs]);

  const isToday = (date: Date | string) => {
    const current = new Date(date);

    return (
      current.getDate() === today.getDate() &&
      current.getMonth() === today.getMonth() &&
      current.getFullYear() === today.getFullYear()
    );
  };

  // React Query Mutations
  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      const pr = data.progress;
      setProgress((prev) => ({
        ...prev,
        overallProgress: pr.overallProgress,
        dateLogProgress: prev.dateLogProgress.map((d, index) => ({
          ...d,
          progress: pr.dateLogProgress[index].progress,
        })),
        taskProgress: [
          ...prev.taskProgress,
          { id: data.task._id, count: 0, progress: "0" },
        ],
      }));
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: removeTask,
    onSuccess: (data) => {
      const pr = data.progress;
      setProgress((prev) => ({
        ...prev,
        overallProgress: pr.overallProgress,
        dateLogProgress: prev.dateLogProgress.map((d, index) => ({
          ...d,
          progress: pr.dateLogProgress[index].progress,
        })),
        taskProgress: prev.taskProgress.filter((d) => d?.id !== removeRowID),
      }));
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    },
    onError: () => {
      notify.error("Please try again.");
    },
  });

  const resetDateLogsMutation = useMutation({
    mutationFn: resetDateLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
      });
    },
    onError: () => {
      notify.error("Please try again.");
    },
  });

  // Functions
  const handleDeleteRow = (taskID: string) => {
    setRemoveRowID(taskID);

    deleteTaskMutation.mutate(
      {
        taskID,
        dashboardID: dashboardData!._id,
      },
      {
        onSettled: () => {
          setRemoveRowID(null);
        },
      },
    );
  };

  const handleAddRow = () => {
    if (taskList?.length >= rowLimit) return;
    if (monthStatus === "scheduled") {
      alert(
        "Can not add task as the subscription for this month is not active",
      );
      return;
    }

    addTaskMutation.mutate(dashboardData!._id);
  };

  const handleReset = () => {
    const con = confirm("Are you sure you want to reset the dashboard?");
    if (!con) return;

    resetDateLogsMutation.mutate(dashboardData!._id);
  };

  // Scroll today's date beside the fixed task column.
  useEffect(() => {
    const container = containerRef.current;

    if (!container || sortedDateLogs.length === 0) return;

    const todayLog = sortedDateLogs.find((log) => isToday(log.fullDate));

    const targetLog = todayLog ?? sortedDateLogs[0];
    const targetRef = dateRefs.current[targetLog._id];

    if (!targetRef) return;

    container.scrollTo({
      left: Math.max(0, targetRef.offsetLeft - TASK_COLUMN_WIDTH - 20),
      behavior: "auto",
    });
  }, [sortedDateLogs]);

  const getTaskCount = (taskID: string) => {
    return sortedDateLogs?.filter((log) => log.tasks.includes(taskID)).length;
  };

  const getDateCompletedCount = (log: DateLogI) => {
    return taskList?.filter((task) => log.tasks.includes(task._id)).length;
  };

  if (dateLogsData.isLoading) {
    return (
      <div className="p-5 text-center text-xs text-gray-500">
        Loading habits...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 light:bg-lightCard">
      <div ref={containerRef} className="overflow-x-auto hide-scrollbar">
        <div className="w-max min-w-full">
          {/* =========================
              Date Header
          ========================= */}
          <div className="flex h-19 border-b border-white/10">
            {/* Fixed Habit Header */}
            <div
              className="sticky left-0 z-30 flex shrink-0 items-center justify-between border-r border-white/10 bg-[#0b0b0f] px-3 light:bg-lightCard"
              style={{ width: TASK_COLUMN_WIDTH }}
            >
              <span className="text-xs font-semibold text-gray-400">
                Habits
              </span>

              {/* Add Task */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleAddRow}
                title="Add habit"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-500/10 text-indigo-400 transition hover:border-indigo-400/40 hover:bg-indigo-500/20"
              >
                <FiPlus size={15} />
              </motion.button>
            </div>

            {/* Date Columns */}
            {sortedDateLogs.map((log) => {
              const currentDate = new Date(log.fullDate);
              const currentDay = currentDate.getDate();
              const currentIsToday = isToday(log.fullDate);
              const completed = getDateCompletedCount(log);

              return (
                <div
                  key={log._id}
                  ref={(element) => {
                    dateRefs.current[log._id] = element;
                  }}
                  className={`flex shrink-0 flex-col items-center justify-center gap-1 border-r border-white/5 ${
                    currentIsToday ? "bg-indigo-500/10" : "bg-transparent"
                  }`}
                  style={{ width: DATE_COLUMN_WIDTH }}
                >
                  <span className="text-[10px] text-gray-500">
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      currentIsToday ? "text-indigo-400" : "text-gray-300"
                    }`}
                  >
                    {currentDay}
                  </span>

                  <span className="text-[9px] text-gray-500">
                    {completed}/{taskList?.length}
                  </span>
                </div>
              );
            })}
          </div>

          {/* =========================
              Task Rows
          ========================= */}
          {taskList.map((task) => {
            const completedCount = getTaskCount(task._id);

            return (
              <div
                key={task._id}
                className="group flex h-14 border-b border-white/5"
              >
                {/* Fixed Task Column */}
                <div
                  className="sticky left-0 z-20 flex shrink-0 items-center justify-between gap-2 border-r border-white/10 bg-[#0b0b0f] px-3 light:bg-lightCard"
                  style={{ width: TASK_COLUMN_WIDTH }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-300">
                      {task.taskName}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                      {completedCount}/{sortedDateLogs.length} days
                    </p>
                  </div>

                  {/* Delete Task */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteRow(task?._id)}
                    title={`Delete ${task.taskName}`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-600 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <FiTrash2 size={13} />
                  </motion.button>
                </div>

                {/* =========================
                    Date Cells
                ========================= */}
                {sortedDateLogs.map((log) => {
                  const currentIsToday = isToday(log.fullDate);
                  const checked = log.tasks.includes(task._id);

                  return (
                    <div
                      key={log._id}
                      className={`flex shrink-0 items-center justify-center border-r border-white/5 ${
                        currentIsToday ? "bg-indigo-500/4" : ""
                      }`}
                      style={{ width: DATE_COLUMN_WIDTH }}
                    >
                      {checked && (
                        <motion.button
                          type="button"
                          whileTap={
                            currentIsToday ? { scale: 0.85 } : undefined
                          }
                          disabled={!currentIsToday}
                          onClick={() =>
                            onToggle(task._id, new Date(log.fullDate), !checked)
                          }
                          className={`flex h-6 w-6 items-center justify-center rounded-md ${
                            currentIsToday
                              ? "bg-indigo-500 text-white"
                              : "bg-emerald-400/30 text-emerald-300"
                          }`}
                        >
                          <LuCheck size={13} />
                        </motion.button>
                      )}

                      {!checked && currentIsToday && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            onToggle(task._id, new Date(log.fullDate), true)
                          }
                          className="h-6 w-6 rounded-md border border-white/10 transition hover:border-indigo-400/50 hover:bg-indigo-500/10"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDailyTaskSheet;
