import { useEffect, useRef, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { LuMinus } from "react-icons/lu";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";

const DailyCalanderTaskSheet = (
  {
    taskList,
    setTaskList,

    dashboardData
  }:
    {
      taskList: { _id: string, name: string }[],
      setTaskList: React.Dispatch<React.SetStateAction<{ _id: string, name: string }[]>>,

      dashboardData: {
        _id: string;
        userID: string;
        month: number;
        year: number;
        totalDays: number;
        firstDay: number;
      },
    }
) => {
  const totalD = dashboardData?.totalDays || 0;
  const firstDay = dashboardData?.firstDay || 0;
  const [activeCheckbox, setActiveCheckbox] = useState<string>("");
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);

  const [dateLogs, setDateLogs] = useState<{
    _id: string;
    userID: string;
    monthDashID: string;
    fullDate: Date;
    tasks: [string]
  }[]>([]);
  const rowLimit = 10;

  const handleDeleteRow = async (taskId: string) => {
    setRemoveRowID(taskId);
    try {
      const res = await axiosPrivate.delete(`/api/task?taskID=${taskId}&monthDashID=${dashboardData._id}`);
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setRemoveRowID(null);
    }
  }

  const handleAddRow = async () => {
    setAddRowLoading(true);
    try {
      const res = await axiosPrivate.post(`/api/task?monthDashID=${dashboardData?._id}`, { taskName: "" });
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setAddRowLoading(false);
    }
  }

  const getDateLogs = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/date-logs?monthDashID=${dashboardData?._id}`);
      if (res?.data?.success) {
        setDateLogs(res?.data?.dateLogs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
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

  const toggleCheckbox = async (date: Date, taskID: string, marked: boolean, id: string) => {
    setActiveCheckbox(`${taskID}-${id}`);
    try {
      const res = await axiosPrivate.patch(`/api/date-logs?monthDashID=${dashboardData?._id}&fullDate=${date}&taskID=${taskID}`, { marked });
      if (res?.data?.success) {
        const updated = dateLogs.map(d =>
          d?._id === id
            ? {
                ...d,
                tasks: res?.data?.dateLog?.tasks
              }
            : d
        );
        setDateLogs(updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActiveCheckbox("");
    }
  }

  const dateLogRef = useRef(false);
  const taskLogRef = useRef(false);

  useEffect(() => {
    if (dateLogRef.current || !dashboardData?._id) return;
    getDateLogs();
    dateLogRef.current = true;
  }, [dashboardData?._id]);

  useEffect(() => {
    if (taskLogRef.current || !dashboardData?._id) return;
    getTasks();
    taskLogRef.current = true;
  }, [dashboardData?._id]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="w-full">

        {/* Week Header */}
        <div className="font-semibold p-2 text-[10px] tracking-wider flex items-center w-full border-b border-gray-500">
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
        <div className="p-2 text-[10px] tracking-wider flex items-center w-full border-b border-gray-700">
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
                className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
              >
                {dateLogs?.slice(weekIndex * 7, (weekIndex + 1) * 7).map((log, dayIndex) => {
                  const isChecked = log?.tasks?.includes(task?._id);
                  return (
                    activeCheckbox == `${task?._id}-${log?._id}` ? (
                      <span key={dayIndex} className={`h-4 w-4 rounded border-2 border-darkSuccess light:border-lightSuccess animate-pulse`}
                      ></span>
                    ) : (
                      <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${isChecked ? 'bg-darkSuccess light:bg-lightSuccess' : 'bg-darkBox light:bg-lightBox'}`}
                      onClick={() => toggleCheckbox(log.fullDate, task?._id, !isChecked, log?._id)}
                      ></span>
                    )
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
                    activeCheckbox == `${task?._id}-${log?._id}` ? (
                      <span key={dayIndex} className={`h-4 w-4 rounded border-2 border-darkSuccess light:border-lightSuccess animate-pulse`}
                      ></span>
                    ) : (
                      <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${isChecked ? 'bg-darkSuccess light:bg-lightSuccess' : 'bg-darkBox light:bg-lightBox'}`}
                      onClick={() => toggleCheckbox(log.fullDate, task?._id, !isChecked, log?._id)}
                      ></span>
                    )
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

      {/* Day wise (column wise progress) */}
      <div className="absolute flex gap-2 w-full justify-center -top-28">
        <div
          className="p-2 flex items-center w-full"
        >

          {/* Weeks 1–4 */}
          {/* {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
            >
              {dateLogs?.slice(weekIndex * 7, (weekIndex + 1) * 7)?.map((d, dayIndex) => {
                return (
                  <div key={dayIndex} title={d?.progress}>
                    <div className={`h-14 w-2.5 flex items-end bg-darkBg rounded-t-[3px]`}>
                      <div className={`w-2.5 bg-darkSuccess light:bg-lightSuccess rounded-t-[3px]`} style={{ height: `${d?.progress}%` }}></div>
                    </div>
                    <span className="text-[6px]">{d?.progress}%</span>
                  </div>
                );
              })}
            </div>
          ))} */}

          {/* Week 5 (3 days) */}
          {/* {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, dayIndex) => {
                const d = dateLogs?.[28 + dayIndex];
                return (
                  <div key={dayIndex} title={d?.progress}>
                    <div className={`h-14 w-2.5 flex items-end bg-darkBg rounded-t-[3px]`}>
                      <div className={`w-2.5 bg-darkSuccess light:bg-lightSuccess rounded-t-[3px]`} style={{ height: `${d?.progress}%` }}></div>
                    </div>
                    <span className="text-[6px]">{d?.progress}%</span>
                  </div>
                );
              })}
            </div>
          )} */}

        </div>
      </div>
    </div>
  );
};

export default DailyCalanderTaskSheet;