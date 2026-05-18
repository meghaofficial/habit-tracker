import { useEffect, useRef, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { LuMinus } from "react-icons/lu";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";

const DailyCalanderTaskSheet = (
  {
    taskList,
    setTaskList,

    dashboardData,
    progress,
    setProgress,
    monthStatus,
  }:
    {
      taskList: { _id: string, taskName: string }[],
      setTaskList: React.Dispatch<React.SetStateAction<{ _id: string, taskName: string }[]>>,

      dashboardData: {
        _id: string;
        userID: string;
        month: number;
        year: number;
        totalDays: number;
        firstDay: number;
      },
      progress: {
        overallProgress: { total: number, count: number, progress: string | number },
        dateLogProgress: { fullDate: Date | string, count: number, progress: string | number }[],
        taskProgress: { id: string, count: number, progress: string | number }[]
      },
      setProgress: React.Dispatch<React.SetStateAction<{
        overallProgress: { total: number, count: number, progress: string | number },
        dateLogProgress: { fullDate: Date | string, count: number, progress: string | number }[],
        taskProgress: { id: string, count: number, progress: string | number }[]
      }>>,
      monthStatus: string,
    }
) => {
  const totalD = dashboardData?.totalDays || 0;
  const firstDay = dashboardData?.firstDay || 0;
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);

  const [dateLogs, setDateLogs] = useState<{
    _id: string;
    userID: string;
    monthDashID: string;
    fullDate: Date;
    tasks: string[]
  }[]>([]);
  const rowLimit = 10;

  const handleDeleteRow = async (taskId: string) => {
    setRemoveRowID(taskId);
    try {
      const res = await axiosPrivate.delete(`/api/task?taskID=${taskId}&monthDashID=${dashboardData._id}`);
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
  }

  const handleAddRow = async () => {
    if (monthStatus === "scheduled"){
      alert('Can not add task as the subscription for this month is not active');
      return;
    }
    setAddRowLoading(true);
    try {
      const res = await axiosPrivate.post(`/api/task?monthDashID=${dashboardData?._id}`, { taskName: "" });
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
  }

  const [getLogLoading, setGetLogLoading] = useState(false);
  const getDateLogs = async () => {
    setGetLogLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/date-logs?monthDashID=${dashboardData?._id}`);
      if (res?.data?.success) {
        setDateLogs(res?.data?.dateLogs);
        setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetLogLoading(false);
    }
  }
  const getTasks = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/task?monthDashID=${dashboardData?._id}`);
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const requestQueue = useRef(Promise.resolve());
  const toggleCheckbox = (
    date: Date,
    taskID: string,
    marked: boolean,
    id: string
  ) => {
    requestQueue.current = requestQueue.current.then(async () => {
      const previousLogs = JSON.parse(JSON.stringify(dateLogs));

      // optimistic update
      setDateLogs(prev =>
        prev.map(d =>
          d._id === id
            ? {
              ...d,
              tasks: marked
                ? [...d.tasks, taskID]
                : d.tasks.filter(t => t !== taskID)
            }
            : d
        )
      );

      try {
        const res = await axiosPrivate.patch(
          `/api/date-logs?monthDashID=${dashboardData?._id}&fullDate=${date}&taskID=${taskID}`,
          { marked }
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

  useEffect(() => {
    if (!dashboardData?._id) return;
    getDateLogs();
  }, [dashboardData?._id]);

  useEffect(() => {
    if (!dashboardData?._id) return;
    getTasks();
  }, [dashboardData?._id]);

  return (
    <div className="relative">
    <div className="flex flex-col w-full relative glass-card rounded-2xl">
      <div className="w-full">

        {/* Week Header */}
        <div className="font-semibold p-2 text-[10px] text-white/90 tracking-wide flex items-center w-full border-b border-gray-500">
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 1</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 2</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 3</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 4</p>
          {totalD > 28 && (
            <p className={`w-[12%] text-center`}>WEEK 5</p>
          )}
        </div>

        {/* Week Letters */}
        <div className="p-2 text-[10px] flex items-center w-full border-b border-gray-700">
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
            >
              {Array.from({ length: 7 + firstDay }).slice(firstDay, 7 + firstDay).map((_, index) => (
                <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
              ))}
            </div>
          ))}
          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, index) => (
                <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
              ))}
            </div>
          )}
        </div>

        {/* Date Numbers */}
        <div className="p-2 text-[10px] tracking-wider text-white/55 flex items-center w-full border-b border-gray-700">
          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(0, 7).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(7, 14).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(14, 21).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(21, 28).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((num) => (
                <p key={num}>{num} </p>
              ))}
            </div>
          )}
        </div>

        {/* Checkbox Rows */}
        {taskList.length > 0 && taskList?.map((task) => (
          <div
            key={task?._id}
            className="p-2 flex items-center w-full border-b border-gray-700 relative"
          >
            {
              removeRowID === task?._id ? (
                <button className="absolute -right-2 cursor-not-allowed smText p-2 animate-pulse bg-gray-400 rounded"></button>
              ) : (
                <div className="absolute -right-2 cursor-pointer border rounded border-gray-400 text-gray-400 bg-white"
                  onClick={() => handleDeleteRow(task?._id)}
                >
                  <LuMinus size={15} />
                </div>
              )}

            {/* Weeks 1–4 */}
            {Array.from({ length: 4 }).map((_, weekIndex) => (
              <div
                key={weekIndex}
                className={`flex items-center justify-evenly py-px ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
              >
                {dateLogs?.slice(weekIndex * 7, (weekIndex + 1) * 7).map((log, dayIndex) => {
                  const isChecked = log?.tasks?.includes(task?._id);
                  return (
                    <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${isChecked ? 'bg-darkSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] light:bg-lightSuccess' : 'glass-card'}`}
                      onClick={() => toggleCheckbox(log.fullDate, task?._id, !isChecked, log?._id)}
                    ></span>
                  );
                })}
              </div>
            ))}

            {/* Week 5 */}
            {totalD > 28 && (
              <div className="flex items-center justify-evenly w-[12%] text-center">
                {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, dayIndex) => {
                  const log = dateLogs?.[28 + dayIndex];
                  const isChecked = log?.tasks?.includes(task?._id);
                  return (
                    <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${isChecked ? 'bg-darkSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] light:bg-lightSuccess' : 'glass-card'}`}
                      onClick={() => toggleCheckbox(log.fullDate, task?._id, !isChecked, log?._id)}
                    ></span>
                  )
                })}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add Row Button */}
      {taskList?.length < rowLimit && (
        addRowLoading ? (
          <button className="cursor-not-allowed smText p-1.5 animate-pulse">
            Adding...
          </button>
        ) : (
          <button
            className="cursor-pointer smText p-1.5"
            onClick={handleAddRow}
          >
            ADD ROW +
          </button>
        )
      )}

    </div>
    {/* Day wise (column wise progress) */}
      <div className="absolute flex gap-2 w-full justify-center -top-28">
        <div
          className="p-2 flex items-center w-full"
        >
          {getLogLoading ? (
            <div className="w-full bg-gray-500/50 h-21 -mt-1 rounded-lg animate-pulse"></div>
          ) : (
            <>
              {/* Weeks 1–4 */}
              {Array.from({ length: 4 }).map((_, weekIndex) => (
                <div
                  key={weekIndex}
                  className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
                >
                  {progress?.dateLogProgress?.slice(weekIndex * 7, (weekIndex + 1) * 7)?.map((d, dayIndex) => {
                    return (
                      <div key={dayIndex} title={d?.progress?.toString()}>
                        <div className={`h-14 w-2.5 flex items-end glass-card rounded-t-[3px]`}>
                          <div className={`w-2.5 bg-darkSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] light:bg-lightSuccess rounded-t-[3px]`} style={{ height: `${d?.progress}%` }}></div>
                        </div>
                        <span className="text-[6px]">{Number.isNaN(Number(d?.progress)) ? '0' : d?.progress}%</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              {/* Week 5 (3 days) */}
              {totalD > 28 && (
                <div className="flex items-center justify-evenly w-[12%] text-center">
                  {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, dayIndex) => {
                    const d = progress?.dateLogProgress?.[28 + dayIndex];
                    return (
                      <div key={dayIndex} title={d?.progress?.toString()}>
                        <div className={`h-14 w-2.5 flex items-end glass-card rounded-t-[3px]`}>
                          <div className={`w-2.5 bg-darkSuccess light:bg-lightSuccess rounded-t-[3px]`} style={{ height: `${d?.progress}%` }}></div>
                        </div>
                        <span className="text-[6px]">{Number.isNaN(Number(d?.progress)) ? 0 : d?.progress}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyCalanderTaskSheet;