import React, { useCallback, useEffect, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { notify } from "../../../helper";
import type {
  DashboardI,
  DateLogI,
  ProgressI,
  TargetI,
  TaskI,
} from "../../../types";
import { socket } from "../../../socket/socket";
import {
  FiCalendar,
  FiPlus,
  FiTrash2,
  FiTarget,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { RiResetLeftLine } from "react-icons/ri";
import { axiosPrivate as api } from "../../../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTask,
  getDateLogs,
  getTasks,
  removeTask,
  resetDateLogs,
  toggleTask,
} from "../../../api/dashboardApi";
import MonthlyNote from "./MonthlyNote";

// Main Component
const DailyCalanderTaskSheet = ({
  dashboardData,
  monthStatus,
}: {
  dashboardData: DashboardI;
  monthStatus: string;
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
    enabled: !!dashboardData?._id, // only when we want to trigger
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

  const toggleTaskMutation = useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
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

  const toggleCheckbox = (date: Date, taskID: string, marked: boolean) => {
    toggleTaskMutation.mutate({
      dashboardID: dashboardData!._id,
      fullDate: date,
      taskID,
      marked,
    });
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

      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
      });
    };

    const onTaskMarked = () => {
      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
      });
    };

    const onTaskRemoved = () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });

      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
      });
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
  const progress: ProgressI = dateLogsData?.data?.progress;
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
                  className={`text-[9px] font-bold transition-all ${d === todayDate
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
                    className={`text-[9px] font-bold ${d === todayDate
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
                          onToggle={toggleCheckbox}
                          weekOffset={weekIndex * 7}
                          todayDate={todayDate}
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
                          onToggle={toggleCheckbox}
                          weekOffset={28}
                          todayDate={todayDate}
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

// ─── Targets Section ──────────────────────────────────────────────────────────
export const TargetsSection = ({
  monthID,
  totalWeeks,
}: {
  monthID: string;
  totalWeeks: number;
}) => {
  // 0 = monthly, 1-5 = weekly
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { key: 0, label: "Monthly" },
    ...Array.from({ length: totalWeeks }, (_, i) => ({
      key: i + 1,
      label: `Week ${i + 1}`,
    })),
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl w-full border border-white/10 bg-black/20">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-violet-500/20 text-violet-400">
            <FiTarget size={14} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Targets</p>
            <p className="text-[10px] text-gray-500">
              Monthly &amp; weekly goals
            </p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === tab.key
              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
              : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <InlineTargetsList
              monthID={monthID}
              type={activeTab === 0 ? "monthly" : "weekly"}
              week={activeTab === 0 ? 0 : activeTab}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Inline Targets List ──────────────────────────────────────────────────────
const InlineTargetsList = ({
  monthID,
  type,
  week,
}: {
  monthID: string;
  type: string;
  week: number;
}) => {
  const [targets, setTargets] = useState<TargetI[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState("");
  const [markLoading, setMarkLoading] = useState("");

  const completedCount = targets.filter((t) => t.completed).length;
  const progress =
    targets.length > 0
      ? Math.round((completedCount / targets.length) * 100)
      : 0;

  const getTargets = async () => {
    setFetchLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/monthly-targets?monthDashID=${monthID}`
          : `/api/weekly-targets?monthDashID=${monthID}&week=${week}`;
      const res = await api.get(url);
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchLoading(false);
    }
  };

  const addTarget = async () => {
    if (!input.trim() || targets.length >= 10) return;
    setLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/add-monthly-target?monthDashID=${monthID}`
          : `/api/add-weekly-target?monthDashID=${monthID}&week=${week}`;
      const res = await api.patch(url, { target: input.trim() });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets);
        setInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeTarget = async (id: string) => {
    setRemoveLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/remove-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await api.patch(url);
      if (res?.data?.success) {
        setTargets((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRemoveLoading("");
    }
  };

  const markTarget = async (id: string, mark: boolean) => {
    setMarkLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/mark-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/mark-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await api.patch(url, { mark });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarkLoading("");
    }
  };

  useEffect(() => {
    if (!monthID) return;
    setTargets([]);
    getTargets();
  }, [monthID, type, week]);

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      {targets.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-bold text-violet-400 shrink-0">
            {completedCount}/{targets.length} done
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTarget()}
          disabled={targets.length >= 10}
          placeholder={
            targets.length >= 10
              ? "Max 10 targets reached"
              : type === "monthly"
                ? "Add a monthly target…"
                : "Add a weekly target…"
          }
          className="flex-1 rounded-xl py-2 px-3 text-[12px] bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 focus:bg-white/8 transition-all duration-200"
        />
        <button
          onClick={addTarget}
          disabled={loading || !input.trim() || targets.length >= 10}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/30 transition-colors duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 rounded-full border border-violet-300 border-t-transparent animate-spin" />
          ) : (
            <FiPlus size={13} />
          )}
          Add
        </button>
      </div>

      {/* Target list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto hide-scrollbar">
        {fetchLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
          ))
        ) : targets.length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <FiTarget size={24} className="text-gray-600" />
            <p className="text-[11px] text-gray-500">
              No targets yet. Add one above.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {targets.map((target) => (
              <motion.div
                key={target._id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 group ${target.completed
                  ? "bg-emerald-500/8 border-emerald-500/20"
                  : "bg-white/[0.02] border-white/8 hover:border-white/15"
                  }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => markTarget(target._id, !target.completed)}
                  disabled={markLoading === target._id}
                  className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all duration-200 cursor-pointer ${target.completed
                    ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-400"
                    : "bg-white/5 border-white/15 hover:border-violet-500/40"
                    }`}
                >
                  {markLoading === target._id ? (
                    <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
                  ) : target.completed ? (
                    <FiCheck size={10} />
                  ) : null}
                </button>

                {/* Text */}
                <p
                  className={`flex-1 text-[12px] leading-tight ${target.completed
                    ? "line-through text-gray-500"
                    : "text-white/80"
                    }`}
                >
                  {target.value}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeTarget(target._id)}
                  disabled={removeLoading === target._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  {removeLoading === target._id ? (
                    <span className="w-2 h-2 rounded-full border border-rose-400 border-t-transparent animate-spin" />
                  ) : (
                    <FiX size={9} />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// ─── CheckboxCell ─────────────────────────────────────────────────────────────
const CheckboxCell = React.memo(
  ({
    checked,
    onToggle,
    fullDate,
    taskID,
    logID,
    isToday,
  }: {
    checked: boolean;
    onToggle: (
      fullDate: Date,
      taskID: string,
      checked: boolean,
      logID: string,
    ) => void;
    fullDate: Date;
    taskID: string;
    logID: string;
    isToday: boolean;
  }) => {
    const handleClick = useCallback(() => {
      if (!isToday) return;
      onToggle(fullDate, taskID, !checked, logID);
    }, [onToggle, fullDate, taskID, checked, logID, isToday]);

    return (
      <span
        onClick={handleClick}
        className={`h-4 w-4 rounded transition-all duration-200 ${isToday ? "cursor-pointer" : "cursor-default"
          } ${checked
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

// ─── TaskRow ──────────────────────────────────────────────────────────────────
const TaskRow = React.memo(
  ({
    taskID,
    logs,
    onToggle,
    weekOffset,
    todayDate,
  }: {
    taskID: string;
    logs: {
      _id: string;
      monthDashID: string;
      fullDate: Date;
      tasks: string[];
    }[];
    onToggle: (
      fullDate: Date,
      taskID: string,
      checked: boolean,
      logID: string,
    ) => void;
    weekOffset: number;
    todayDate: number;
  }) =>
    logs.map((log, i) => {
      const dayNum = weekOffset + i + 1;
      const isToday = dayNum === todayDate;
      return (
        <CheckboxCell
          key={log._id}
          checked={log?.tasks?.includes(taskID)}
          onToggle={onToggle}
          fullDate={log.fullDate}
          taskID={taskID}
          logID={log._id}
          isToday={isToday}
        />
      );
    }),
);

export default DailyCalanderTaskSheet;
