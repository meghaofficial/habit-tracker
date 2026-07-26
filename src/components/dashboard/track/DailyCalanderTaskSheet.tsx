import React, { useEffect, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { notify } from "../../../helper";
import type { DashboardI, DateLogI, ProgressI, TaskI } from "../../../types";
import { socket } from "../../../socket/socket";
import { FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";
import { RiResetLeftLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTask,
  getDateLogs,
  getTasks,
  removeTask,
  resetDateLogs,
  toggleTask,
} from "../../../api/dashboardApi";

// Main Component
const DailyCalanderTaskSheet = ({
  dashboardData,
  monthStatus,
  progress,
  setProgress,
}: {
  dashboardData: DashboardI;
  monthStatus: string;
  progress: ProgressI;
  setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
}) => {
  const totalD = dashboardData?.totalDays || 0;
  const firstDay = dashboardData?.firstDay || 0;
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);
  const rowLimit = 10;
  const todayDate = new Date().getDate();
  const queryClient = useQueryClient();

  // Getting data
  const dateLogsData = useQuery({
    queryKey: ["date_logs", dashboardData?._id],
    queryFn: () => getDateLogs(dashboardData?._id),
    enabled: !!dashboardData?._id,
  });

  const taskListData = useQuery({
    queryKey: ["tasks", dashboardData?._id],
    queryFn: () => getTasks(dashboardData?._id),
    enabled: !!dashboardData?._id,
  });

  // React Query Mutations
  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: removeTask,
    onSuccess: () => {
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

  // WEBSOCKET SYNCING
  useEffect(() => {
    const onTaskAdded = () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ["date_logs", dashboardData?._id],
      // });
    };

    const onTaskMarked = () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["date_logs", dashboardData?._id],
      // });
    };

    const onTaskRemoved = () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ["date_logs", dashboardData?._id],
      // });
    };

    socket.on("task-marked", onTaskMarked);
    socket.on("add-task", onTaskAdded);
    socket.on("remove-task", onTaskRemoved);

    return () => {
      socket.off("task-marked", onTaskMarked);
      socket.off("add-task", onTaskAdded);
      socket.off("remove-task", onTaskRemoved);
    };
  }, [dashboardData?._id, queryClient]);

  const dateLogs: DateLogI[] = dateLogsData?.data?.dateLogs;
  // const progress: ProgressI = dateLogsData?.data?.progress;
  const taskList: TaskI[] = taskListData?.data?.tasks;

  // Column widths
  const hasWeek5 = totalD > 28;
  const colW = hasWeek5 ? "w-[22%]" : "w-[25%]";
  const colW5 = "w-[12%]";

  return (
    <div className="flex flex-col gap-4">
      {/* ── Daily Progress Bars (now above the sheet) ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/3 via-transparent to-transparent pointer-events-none" />
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 px-1">
          Daily Completion
        </p>
        <div className="flex items-end w-full gap-0.5 overflow-x-auto hide-scrollbar pb-1">
          {dateLogsData.isPending ? (
            Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-14 bg-gray-500/20 rounded-t animate-pulse"
              />
            ))
          ) : (
            <>
              {/* Weeks 1–4 */}
              {Array.from({ length: 4 }).map((_, weekIndex) => (
                <div
                  key={weekIndex}
                  className={`flex items-end justify-evenly ${colW}`}
                >
                  {progress?.dateLogProgress
                    ?.slice(weekIndex * 7, (weekIndex + 1) * 7)
                    ?.map((d, dayIndex) => {
                      const dayNum = weekIndex * 7 + dayIndex + 1;
                      const isToday = dayNum === todayDate;
                      return (
                        <div
                          key={dayIndex}
                          className="flex flex-col items-center gap-0.5"
                          title={`Day ${dayNum}: ${d?.progress}%`}
                        >
                          <div
                            className={`w-2.5 h-14 flex items-end rounded-t-[3px] ${isToday ? "bg-indigo-500/20 border border-indigo-500/30" : "bg-white/5 border border-white/10"}`}
                          >
                            <div
                              className={`w-2.5 rounded-t-[3px] transition-all duration-700 ${isToday ? "bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]" : "bg-emerald-400/70 shadow-[0_0_4px_rgba(74,222,128,0.4)]"}`}
                              style={{ height: `${d?.progress}%` }}
                            />
                          </div>
                          <span
                            className={`text-[5.5px] font-bold ${isToday ? "text-indigo-400" : "text-gray-600"}`}
                          >
                            {Number.isNaN(Number(d?.progress))
                              ? "0"
                              : d?.progress === "100.00"
                                ? "100"
                                : d?.progress}
                            %
                          </span>
                        </div>
                      );
                    })}
                </div>
              ))}
              {/* Week 5 */}
              {hasWeek5 && (
                <div className={`flex items-end justify-evenly ${colW5}`}>
                  {Array.from({ length: totalD - 28 }, (_, i) => i).map(
                    (_, dayIndex) => {
                      const d = progress?.dateLogProgress?.[28 + dayIndex];
                      const dayNum = 29 + dayIndex;
                      const isToday = dayNum === todayDate;
                      return (
                        <div
                          key={dayIndex}
                          className="flex flex-col items-center gap-0.5"
                          title={`Day ${dayNum}: ${d?.progress}%`}
                        >
                          <div
                            className={`w-2.5 h-14 flex items-end rounded-t-[3px] ${isToday ? "bg-indigo-500/20 border border-indigo-500/30" : "bg-white/5 border border-white/10"}`}
                          >
                            <div
                              className={`w-2.5 rounded-t-[3px] transition-all duration-700 ${isToday ? "bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]" : "bg-emerald-400/70 shadow-[0_0_4px_rgba(74,222,128,0.4)]"}`}
                              style={{ height: `${d?.progress}%` }}
                            />
                          </div>
                          <span
                            className={`text-[5.5px] font-bold ${isToday ? "text-indigo-400" : "text-gray-600"}`}
                          >
                            {Number.isNaN(Number(d?.progress))
                              ? "0"
                              : d?.progress === "100.00"
                                ? "100"
                                : d?.progress}
                            %
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Calendar Sheet ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/3 via-transparent to-transparent pointer-events-none" />

        {/* Card Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <FiCalendar size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Monthly Habit Tracker
              </p>
              <p className="text-[10px] text-gray-500">
                Check off today's tasks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-medium">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {!dateLogsData.isPending && (
              <button
                onClick={handleReset}
                title="Reset dashboard"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors duration-200 cursor-pointer"
              >
                <RiResetLeftLine size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Week Labels */}
        <div className="flex items-center w-full px-3 py-2 border-b border-white/5">
          {[1, 2, 3, 4].map((w) => (
            <div key={w} className={`${colW} flex justify-center`}>
              <span className="text-[9px] font-bold tracking-widest text-indigo-400/70 bg-indigo-500/8 border border-indigo-500/15 rounded-md px-2 py-0.5">
                WEEK {w}
              </span>
            </div>
          ))}
          {hasWeek5 && (
            <div className={`${colW5} flex justify-center`}>
              <span className="text-[9px] font-bold tracking-widest text-violet-400/70 bg-violet-500/8 border border-violet-500/15 rounded-md px-2 py-0.5">
                WEEK 5
              </span>
            </div>
          )}
        </div>

        {/* Day-of-week letters */}
        <div className="flex items-center w-full px-3 py-1.5 border-b border-white/5">
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${colW}`}
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const dayNum = weekIndex * 7 + i + 1;
                const isToday = dayNum === todayDate;
                return (
                  <span
                    key={i}
                    className={`text-[9px] font-semibold ${isToday ? "text-indigo-400" : "text-gray-600"}`}
                  >
                    {weekLetters[(i + firstDay) % 7]}
                  </span>
                );
              })}
            </div>
          ))}
          {hasWeek5 && (
            <div className={`flex items-center justify-evenly ${colW5}`}>
              {Array.from({ length: totalD - 28 }).map((_, i) => {
                const dayNum = 29 + i;
                const isToday = dayNum === todayDate;
                return (
                  <span
                    key={i}
                    className={`text-[9px] font-semibold ${isToday ? "text-indigo-400" : "text-gray-600"}`}
                  >
                    {weekLetters[(i + firstDay) % 7]}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Date Numbers */}
        <div className="flex items-center w-full px-3 py-1.5 border-b border-white/5">
          {[
            daysNums.slice(0, 7),
            daysNums.slice(7, 14),
            daysNums.slice(14, 21),
            daysNums.slice(21, 28),
          ].map((chunk, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${colW}`}
            >
              {chunk.map((d) => (
                <span
                  key={d}
                  className={`text-[9px] font-bold transition-all ${
                    d === todayDate
                      ? "text-white bg-indigo-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
                      : "text-gray-500"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          ))}
          {hasWeek5 && (
            <div className={`flex items-center justify-evenly ${colW5}`}>
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map(
                (d) => (
                  <span
                    key={d}
                    className={`text-[9px] font-bold ${
                      d === todayDate
                        ? "text-white bg-indigo-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
                        : "text-gray-500"
                    }`}
                  >
                    {d}
                  </span>
                ),
              )}
            </div>
          )}
        </div>

        {/* Checkbox Rows */}
        <div className="relative">
          {dateLogsData.isPending ? (
            <div className="p-3 flex flex-col gap-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-8 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {taskList?.length > 0 &&
                taskList.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center w-full px-3 py-2 border-b border-white/5 group hover:bg-white/2 transition-colors duration-150 relative"
                  >
                    {/* Delete button */}
                    <button
                      disabled={removeRowID === task._id}
                      onClick={() => handleDeleteRow(task._id)}
                      className="absolute -right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
                      title="Remove habit"
                    >
                      {removeRowID === task._id ? (
                        <span className="w-2.5 h-2.5 rounded-full border border-rose-400 border-t-transparent animate-spin" />
                      ) : (
                        <FiTrash2 size={9} />
                      )}
                    </button>

                    {/* Weeks 1–4 */}
                    {Array.from({ length: 4 }).map((_, weekIndex) => (
                      <div
                        key={weekIndex}
                        className={`flex items-center justify-evenly py-px ${colW}`}
                      >
                        <TaskRow
                          taskID={task._id}
                          logs={dateLogs?.slice(
                            weekIndex * 7,
                            (weekIndex + 1) * 7,
                          )}
                          weekOffset={weekIndex * 7}
                          todayDate={todayDate}
                          dashbID={dashboardData?._id}
                          setProgress={setProgress}
                        />
                      </div>
                    ))}

                    {/* Week 5 */}
                    {hasWeek5 && (
                      <div
                        className={`flex items-center justify-evenly py-px ${colW5}`}
                      >
                        <TaskRow
                          taskID={task._id}
                          logs={dateLogs?.slice(28)}
                          weekOffset={28}
                          todayDate={todayDate}
                          dashbID={dashboardData?._id}
                          setProgress={setProgress}
                        />
                      </div>
                    )}
                  </div>
                ))}

              {/* Add Row button */}
              {taskList?.length < rowLimit && (
                <button
                  onClick={addTaskMutation.isPending ? undefined : handleAddRow}
                  disabled={addTaskMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold text-indigo-400/70 hover:text-indigo-400 hover:bg-indigo-500/5 border-t border-white/5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {addTaskMutation.isPending ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-indigo-400 border-t-transparent animate-spin" />
                  ) : (
                    <FiPlus size={13} />
                  )}
                  {addTaskMutation.isPending ? "Adding…" : "Add Habit"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckboxCell = React.memo(
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
      onSuccess: (data) => {
        const pr = data.progress;
        setProgress((prev) => ({
          ...prev,
          overallProgress: pr.overallProgress,
          dateLogProgress: prev.dateLogProgress.map((d) =>
            d.fullDate === pr.dateLogProgress.fullDate
              ? pr.dateLogProgress
              : d,
          ),
          taskProgress: prev.taskProgress.map((d) => 
            d.id === pr.taskProgress.id ? pr.taskProgress : d
          )
        }));
        setCurrCheckVal((prev) => !prev);
      },
      onError: () => {
        notify.error("Please try again.");
      },
    });

    const toggleTaskID = toggleTaskMutation.isPending
      ? toggleTaskMutation.variables?.taskID
      : "";

    const onToggle = (date: Date, taskID: string, marked: boolean) => {
      toggleTaskMutation.mutate({
        dashboardID: dashbID,
        fullDate: date,
        taskID,
        marked,
      });
    };

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

const TaskRow = React.memo(
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

export default DailyCalanderTaskSheet;
