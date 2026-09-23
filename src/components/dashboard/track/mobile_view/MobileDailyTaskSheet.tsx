import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { DashboardI, DateLogI, ProgressI, TaskI } from "../../../../types";
import { CheckboxCell } from "../daily_task_section/CheckboxCell";
import CircleLoader from "../../../loaders/CircleLoader";

const TASK_COLUMN_WIDTH = 144;
const DATE_COLUMN_WIDTH = 64;

const MobileDailyTaskSheet = ({
  dashboardData,
  taskList,
  setProgress,
  handleDeleteRow,
  dateLogs,
  logsLoading,
  handleAddRow,
  addTaskLoading,
  deletingID,
}: {
  dashboardData: DashboardI;
  taskList: TaskI[];
  setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
  handleDeleteRow: (taskID: string) => void;
  dateLogs: DateLogI[];
  logsLoading: boolean;
  handleAddRow: () => void;
  addTaskLoading: boolean;
  deletingID: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const today = new Date();

  const sortedDateLogs = useMemo(() => {
    return [...dateLogs]?.sort(
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

  if (logsLoading) {
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
                {addTaskLoading ? (
                  <CircleLoader className="h-3 w-3" />
                ) : (
                  <FiPlus size={15} />
                )}
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
          {taskList?.map((task) => {
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
                    {deletingID === task?._id ? (
                      <CircleLoader className="h-3 w-3" />
                    ) : (
                      <FiTrash2 size={13} />
                    )}
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
                      <CheckboxCell
                        key={log?._id}
                        checked={checked}
                        fullDate={log.fullDate}
                        taskID={task?._id}
                        isToday={currentIsToday}
                        dashbID={dashboardData?._id}
                        setProgress={setProgress}
                      />
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
