import React, { useCallback, useEffect, useRef, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { LuMinus } from "react-icons/lu";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";
import { RiResetLeftLine } from "react-icons/ri";
import type {
  DashboardI,
  DateLogI,
  DateLogProgressI,
  OverallProgressI,
  TaskI,
  TaskProgressI,
} from "../../../types";
import { socket } from "../../../socket/socket";

const DailyCalanderTaskSheet = ({
  taskList,
  setTaskList,
  dashboardData,
  progress,
  setProgress,
  monthStatus,
}: {
  taskList: TaskI[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  dashboardData: DashboardI;
  progress: {
    overallProgress: OverallProgressI;
    dateLogProgress: DateLogProgressI[];
    taskProgress: TaskProgressI[];
  };
  setProgress: React.Dispatch<
    React.SetStateAction<{
      overallProgress: OverallProgressI;
      dateLogProgress: DateLogProgressI[];
      taskProgress: TaskProgressI[];
    }>
  >;
  monthStatus: string;
}) => {
  const totalD = dashboardData?.totalDays || 0;
  const firstDay = dashboardData?.firstDay || 0;
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);
  const [dateLogs, setDateLogs] = useState<DateLogI[]>([]);
  const rowLimit = 10;

  const handleDeleteRow = async (taskId: string) => {
    setRemoveRowID(taskId);
    try {
      const res = await axiosPrivate.delete(
        `/api/task?taskID=${taskId}&monthDashID=${dashboardData._id}`,
      );
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
        setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setRemoveRowID(null);
    }
  };

  const handleAddRow = async () => {
    if (monthStatus === "scheduled") {
      alert(
        "Can not add task as the subscription for this month is not active",
      );
      return;
    }
    setAddRowLoading(true);
    try {
      const res = await axiosPrivate.post(
        `/api/task?monthDashID=${dashboardData?._id}`,
        { taskName: "" },
      );
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
        setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setAddRowLoading(false);
    }
  };

  const [getLogLoading, setGetLogLoading] = useState(false);
  const getDateLogs = async () => {
    setGetLogLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/date-logs?monthDashID=${dashboardData?._id}`,
      );
      if (res?.data?.success) {
        setDateLogs(res?.data?.dateLogs);
        setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetLogLoading(false);
    }
  };
  const getTasks = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/task?monthDashID=${dashboardData?._id}`,
      );
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  };

  const requestQueue = useRef(Promise.resolve());
  const toggleCheckbox = (
    date: Date,
    taskID: string,
    marked: boolean,
    id: string,
  ) => {
    requestQueue.current = requestQueue.current.then(async () => {
      const previousLogs = JSON.parse(JSON.stringify(dateLogs));

      setDateLogs((prev) =>
        prev.map((d) =>
          d._id === id
            ? {
                ...d,
                tasks: marked
                  ? [...d.tasks, taskID]
                  : d.tasks.filter((t) => t !== taskID),
              }
            : d,
        ),
      );

      try {
        const res = await axiosPrivate.patch(
          `/api/date-logs?monthDashID=${dashboardData?._id}&fullDate=${date}&taskID=${taskID}`,
          { marked },
        );

        if (res?.data?.success) {
          setProgress(res?.data?.progress);
        }
      } catch (error) {
        setDateLogs(previousLogs);
        console.error(error);
      }
    });
  };

  const handleReset = async () => {
    const con = confirm("Are you sure you want to reset the dashboard?");
    if (!con) return;
    try {
      const res = await axiosPrivate.patch(
        `/api/reset-date-log?monthDashID=${dashboardData._id}`,
      );
      if (res?.data?.success) {
        await getDateLogs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!dashboardData?._id) return;
    getDateLogs();
  }, [dashboardData?._id]);

  useEffect(() => {
    if (!dashboardData?._id) return;
    getTasks();
  }, [dashboardData?._id]);

  // WEBSOCKET SYNCING
  useEffect(() => {
    const onTaskAdded = (data: any) => {
      setTaskList(data.tasks);
      setProgress(data.progress);
    };
    const onTaskMarked = (data: any) => {
      setProgress(data.progress);

      setDateLogs((prev) =>
        prev.map((d) =>
          d._id === data.dateLogID
            ? {
                ...d,
                tasks: data.marked
                  ? [...d.tasks, data.taskID]
                  : d.tasks.filter((t) => t !== data.taskID),
              }
            : d,
        ),
      );
    };
    const onTaskRemoved = (data: any) => {
      setTaskList(data?.tasks);
      setProgress(data?.progress);
    }

    socket.on("task-marked", onTaskMarked);
    socket.on("add-task", onTaskAdded);
    socket.on("remove-task", onTaskRemoved);

    return () => {
      socket.off("task-marked", onTaskMarked);
      socket.off("add-task", onTaskAdded);
      socket.off("remove-task", onTaskRemoved);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col w-full relative border border-white/10 bg-black/20 rounded-2xl light:border-lightBorder light:bg-lightCard">
        <div className="w-full">
          {/* Week Header */}
          <div className="font-semibold p-2 text-[10px] text-white/90 light:text-black tracking-wide flex items-center w-full light:border-lightBorder border-b border-darkBox/50">
            <p className={`${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}>
              WEEK 1
            </p>
            <p className={`${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}>
              WEEK 2
            </p>
            <p className={`${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}>
              WEEK 3
            </p>
            <p className={`${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}>
              WEEK 4
            </p>
            {totalD > 28 && <p className={`w-[12%] text-center`}>WEEK 5</p>}
          </div>

          {/* Week Letters */}
          <div className="p-2 text-[10px] flex items-center w-full border-b border-darkBox/50 light:border-lightBorder">
            {Array.from({ length: 4 }).map((_, weekIndex) => (
              <div
                key={weekIndex}
                className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
              >
                {Array.from({ length: 7 + firstDay })
                  .slice(firstDay, 7 + firstDay)
                  .map((_, index) => (
                    <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
                  ))}
              </div>
            ))}
            {totalD > 28 && (
              <div className="flex items-center justify-evenly w-[12%] text-center">
                {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map(
                  (_, index) => (
                    <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Date Numbers */}
          <div className="p-2 text-[10px] tracking-wider text-white/55 light:text-black flex items-center w-full border-b border-darkBox/50 light:border-lightBorder">
            <div
              className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
            >
              {daysNums.slice(0, 7).map((d, index) => (
                <p key={index}>{d}</p>
              ))}
            </div>

            <div
              className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
            >
              {daysNums.slice(7, 14).map((d, index) => (
                <p key={index}>{d}</p>
              ))}
            </div>

            <div
              className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
            >
              {daysNums.slice(14, 21).map((d, index) => (
                <p key={index}>{d}</p>
              ))}
            </div>

            <div
              className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
            >
              {daysNums.slice(21, 28).map((d, index) => (
                <p key={index}>{d}</p>
              ))}
            </div>

            {totalD > 28 && (
              <div className="flex items-center justify-evenly w-[12%] text-center">
                {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map(
                  (num) => (
                    <p key={num}>{num} </p>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Checkbox Rows */}
          {getLogLoading ? (
            <div className="p-2 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-gray-500/50 h-7 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {taskList.length > 0 &&
                taskList?.map((task) => (
                  <div
                    key={task?._id}
                    className="p-2 flex items-center w-full border-b border-darkBox/50 light:border-lightBorder relative"
                  >
                    {removeRowID === task?._id ? (
                      <button className="absolute -right-2 cursor-not-allowed smText p-2 animate-pulse bg-gray-400 rounded"></button>
                    ) : (
                      <div
                        className="absolute -right-2 cursor-pointer border rounded border-gray-400 text-gray-400 bg-white"
                        onClick={() => handleDeleteRow(task?._id)}
                      >
                        <LuMinus size={15} />
                      </div>
                    )}

                    {/* Weeks 1–4 */}
                    {Array.from({ length: 4 }).map((_, weekIndex) => (
                      <div
                        key={weekIndex}
                        className={`flex items-center justify-evenly py-px ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
                      >
                        <TaskRow
                          taskID={task?._id}
                          logs={dateLogs?.slice(
                            weekIndex * 7,
                            (weekIndex + 1) * 7,
                          )}
                          onToggle={toggleCheckbox}
                        />
                      </div>
                    ))}

                    {/* Week 5 */}
                    {totalD > 28 && (
                      <div className="flex items-center justify-evenly w-[12%] text-center">
                        <TaskRow
                          taskID={task?._id}
                          logs={dateLogs?.slice(28)}
                          onToggle={toggleCheckbox}
                        />
                      </div>
                    )}
                  </div>
                ))}
              {/* Add Row Button */}
              {taskList?.length < rowLimit &&
                (addRowLoading ? (
                  <button className="cursor-not-allowed smText p-1.5 animate-pulse w-full text-center">
                    Adding...
                  </button>
                ) : (
                  <button
                    className="cursor-pointer smText p-1.5 text-center w-full"
                    onClick={handleAddRow}
                  >
                    ADD ROW +
                  </button>
                ))}
            </>
          )}

          <div
            className="absolute h-4 w-4 flex items-center justify-center -right-2 bottom-2 cursor-pointer border rounded border-darkBox/50 light:border-lightBorder text-white/70 bg-red-600"
            onClick={handleReset}
          >
            <RiResetLeftLine size={12} />
          </div>
        </div>
      </div>
      {/* Day wise (column wise progress) */}
      <div className="absolute flex gap-2 w-full justify-center -top-28">
        <div className="p-2 flex items-center w-full">
          {getLogLoading ? (
            <div className="px-1 flex gap-3 justify-center w-full items-center">
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  className="w-3 bg-gray-500/50 h-18 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {/* Weeks 1–4 */}
              {Array.from({ length: 4 }).map((_, weekIndex) => (
                <div
                  key={weekIndex}
                  className={`flex items-center justify-evenly ${totalD > 28 ? "w-[22%]" : "w-[25%]"} text-center`}
                >
                  {progress?.dateLogProgress
                    ?.slice(weekIndex * 7, (weekIndex + 1) * 7)
                    ?.map((d, dayIndex) => {
                      return (
                        <div key={dayIndex} title={d?.progress?.toString()}>
                          <div
                            className={`h-14 w-2.5 flex items-end bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10 rounded-t-[3px]`}
                          >
                            <div
                              className={`w-2.5 bg-darkSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] light:bg-lightSuccess rounded-t-[3px]`}
                              style={{ height: `${d?.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[6px]">
                            {Number.isNaN(Number(d?.progress))
                              ? "0"
                              : d?.progress === "100.00" ? "100" : d?.progress}
                            %
                          </span>
                        </div>
                      );
                    })}
                </div>
              ))}
              {/* Week 5 (3 days) */}
              {totalD > 28 && (
                <div className="flex items-center justify-evenly w-[12%] text-center">
                  {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map(
                    (_, dayIndex) => {
                      const d = progress?.dateLogProgress?.[28 + dayIndex];
                      return (
                        <div key={dayIndex} title={d?.progress?.toString()}>
                          <div
                            className={`h-14 w-2.5 flex items-end light:bg-black/5 light:border-black/10 bg-white/5 border border-white/10 rounded-t-[3px]`}
                          >
                            <div
                              className={`w-2.5 bg-darkSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] light:bg-lightSuccess rounded-t-[3px]`}
                              style={{ height: `${d?.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[6px]">
                            {Number.isNaN(Number(d?.progress))
                              ? 0
                              : d?.progress === "100.00" ? "100" : d?.progress}
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
    </div>
  );
};

const CheckboxCell = React.memo(
  ({
    checked,
    onToggle,
    fullDate,
    taskID,
    logID,
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
  }) => {
    const handleClick = useCallback(() => {
      onToggle(fullDate, taskID, !checked, logID);
    }, [onToggle, fullDate, taskID, checked, logID]);

    return (
      <span
        className={`h-4 w-4 rounded cursor-pointer ${
          checked ? "bg-darkSuccess" : "bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10"
        }`}
        onClick={handleClick}
      />
    );
  },
);

const TaskRow = React.memo(
  ({
    taskID,
    logs,
    onToggle,
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
  }) => {
    return logs.map((log) => (
      <CheckboxCell
        key={log._id}
        checked={log.tasks.includes(taskID)}
        onToggle={onToggle}
        fullDate={log.fullDate}
        taskID={taskID}
        logID={log._id}
      />
    ));
  },
);

export default DailyCalanderTaskSheet;
