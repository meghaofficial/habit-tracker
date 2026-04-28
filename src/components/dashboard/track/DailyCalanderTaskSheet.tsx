import { useEffect, useState } from "react";
import { daysNums, weekLetters } from "../../../staticData";
import { LuMinus } from "react-icons/lu";
import type { ITask } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";

const DailyCalanderTaskSheet = (
  { taskList, setTaskList, metaData, daywiseData,
    setDaywiseData
  }:
    {
      taskList: ITask[],
      setTaskList: React.Dispatch<React.SetStateAction<ITask[]>>,
      metaData: { firstDay: number, totalDays: number, overallDays: number },
      daywiseData: { fullDate: string, count: number, progress: string, _id: string }[],
      setDaywiseData: React.Dispatch<React.SetStateAction<{ fullDate: string, count: number, progress: string, _id: string }[]>>
    }
) => {
  const year = "2026";
  const totalD = metaData?.totalDays || 0;
  const firstDay = metaData?.firstDay || 0;
  const [activeCheckbox, setActiveCheckbox] = useState<string>("");
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);

  const month = 4;
  const rowLimit = 10;

  const toggleCheckbox = async (taskId: string, cbKey: string, isChecked: boolean, fullDate: string) => {
    setActiveCheckbox(cbKey);
    try {

      const res = await axiosPrivate.put(`/api/update-task-check?taskId=${taskId}&checkboxKey=${cbKey}`, { isChecked, fullDate });

      if (res?.data?.success) {
        const { data } = res.data;
        setTaskList(data.taskList);
        setDaywiseData(data.daywiseData);
      }

    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setActiveCheckbox("");
    }
  }

  const handleDeleteRow = async (taskId: string, fullDate: string) => {
    setRemoveRowID(taskId);
    try {

      const res = await axiosPrivate.delete(`/api/remove-task?taskId=${taskId}&fullDate=${fullDate}`);

      if (res?.data?.success) {
        const { data } = res.data;
        setTaskList(data.taskList);
        setDaywiseData(data.daywiseData);
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

      const res = await axiosPrivate.post(`/api/add-task`, { year, month });

      if (res?.data?.success) {
        const { data } = res.data;
        setTaskList(data.taskList);
        setDaywiseData(data.daywiseData);
      }

    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setAddRowLoading(false);
    }
  }

  useEffect(() => {
    if (!taskList || !metaData) return;
  }, [taskList, metaData]);

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
        {taskList && taskList?.map((task, taskIndex) => (
          <div
            key={task?._id}
            className="p-2 flex items-center w-full border-b border-gray-700 relative"
          >
            {taskIndex > 0 && (
              removeRowID === task?._id ? (
                <button className="absolute -right-2 cursor-not-allowed smText p-2 animate-pulse bg-gray-400 rounded"></button>
              ) : (
                <div className="absolute -right-2 cursor-pointer border rounded border-gray-400 text-gray-400 bg-white"
                  onClick={() => handleDeleteRow(task?._id, task?.taskData?.[0]?.fullDate || "")}
                >
                  <LuMinus size={15} />
                </div>
              ))}

            {/* Weeks 1–4 */}
            {Array.from({ length: 4 }).map((_, weekIndex) => (
              <div
                key={weekIndex}
                className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
              >
                {taskList?.[taskIndex]?.taskData?.slice(weekIndex * 7, (weekIndex + 1) * 7).map((t, dayIndex) => {
                  return (
                    activeCheckbox == t?.checkboxKey ? (
                      <span key={dayIndex} className={`h-4 w-4 rounded border-2 border-darkSuccess light:border-lightSuccess animate-pulse`}
                      ></span>
                    ) : (
                      <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${t?.isChecked ? 'bg-darkSuccess light:bg-lightSuccess' : 'bg-darkBox light:bg-lightBox'}`}
                        onClick={() => !activeCheckbox && toggleCheckbox(task._id, t?.checkboxKey, !t.isChecked, t.fullDate)}
                      ></span>
                    )
                  );
                })}
              </div>
            ))}

            {/* Week 5 */}
            {totalD > 28 && (
              <div className="flex items-center justify-evenly w-[12%] text-center">
                {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((num, dayIndex) => {
                  const t = taskList?.[taskIndex]?.taskData?.[28 + dayIndex];
                  return (
                    activeCheckbox == t?.checkboxKey ? (
                      <span key={dayIndex} className={`h-4 w-4 rounded border-2 border-darkSuccess light:border-lightSuccess animate-pulse`}
                      ></span>
                    ) : (
                      <span key={dayIndex} className={`h-4 w-4 rounded cursor-pointer ${t?.isChecked ? 'bg-darkSuccess light:bg-lightSuccess' : 'bg-darkBox light:bg-lightBox'}`}
                        onClick={() => !activeCheckbox && toggleCheckbox(task._id, t?.checkboxKey, !t.isChecked, t.fullDate)}
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
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
            >
              {daywiseData?.slice(weekIndex * 7, (weekIndex + 1) * 7)?.map((d, dayIndex) => {
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
          ))}

          {/* Week 5 (3 days) */}
          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, dayIndex) => {
                const d = daywiseData?.[28 + dayIndex];
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
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyCalanderTaskSheet;