import { useEffect, useState } from "react";
import type { DateLogI, TaskI } from "../../../../types";
import { axiosPrivate } from "../../../../api/axios";
import CircleLoader from "../../../loaders/CircleLoader";
import CustomButton from "../../../shared/CutomButton";
import Card from "../../../shared/Card";
import { formatDateString2 } from "../../../../helper";
import TodayAllTasks from "../../../charts/TodayAllTasks";

const TodayTasks = ({
  taskList,
  log,
  setLog,
  monthDashID,
  monthStatus,
  setTaskList,
}: {
  taskList: TaskI[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
  monthStatus: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
}) => {
  const selectedDate = new Date();
  const [logLoading, setLogLoading] = useState(false);
  const [heading, setHeading] = useState("Todays Tasks");
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);

  const getLog = async (date: Date) => {
    setLogLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/get-log-date?monthDashID=${monthDashID}&fullDate=${getMidnightISO(date)}`,
      );

      if (res?.data?.success) {
        setLog(res?.data?.dateLog);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLogLoading(false);
    }
  };

  function getMidnightISO(date: Date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate.toISOString();
  }
  // const handlePrevDate = () => {
  //   const prev = new Date(selectedDate);
  //   prev.setDate(prev.getDate() - 1);
  //   setSelectedDate(prev);
  //   getLog(prev);
  // };
  // const handleNextDate = () => {
  //   const next = new Date(selectedDate);
  //   next.setDate(next.getDate() + 1);
  //   setSelectedDate(next);
  //   getLog(next);
  // };

  useEffect(() => {
    if (!monthDashID) return;
    if (selectedDate.getDate() === new Date().getDate())
      setHeading("Todays Tasks");
    else setHeading("Other's Day Tasks");
  }, [selectedDate]);

  useEffect(() => {
    getLog(new Date());
  }, []);

  const handleAddRow = async () => {
    if (monthStatus === "scheduled") {
      alert(
        "Can not add task as the subscription for this month is not active",
      );
      return;
    }
    if (taskList?.length >= 10) {
      alert("Can't add more than 10 Tasks");
      return;
    }
    setAddRowLoading(true);
    try {
      const res = await axiosPrivate.post(
        `/api/task?monthDashID=${monthDashID}`,
        { taskName: "" },
      );
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
        // setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddRowLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Card heading={heading}>
        <div className="absolute right-5 top-5 z-9999">
          <CustomButton type="transparent" onClick={handleAddRow}>
            {addRowLoading ? (
              <p className="px-3">
                <CircleLoader className="h-4 w-4" />
              </p>
            ) : (
              "Add Task"
            )}
          </CustomButton>
        </div>
        <div className="flex items-center justify-between pb-3 pt-2">
          {logLoading ? (
            <div className="w-20 h-4 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
          ) : (
            <p className="text-gray-500 mt-1 text-[10px] cursor-default">
              {formatDateString2(selectedDate.toString())}
            </p>
          )}
          {/* {!logLoading && (
            <div className="flex items-center gap-2 relative">
              <button onClick={handlePrevDate}>
                <IoIosArrowRoundBack size={20} />
              </button>
              <button onClick={handleNextDate}>
                <IoIosArrowRoundForward size={20} />
              </button>
            </div>
          )} */}
        </div>
        <div className="flex items-center justify-center">
          {logLoading ? (
            <div className="flex flex-col gap-2 w-full pb-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-8 mt-1 rounded bg-gray-500/50 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <TodayAllTasks
              taskList={taskList}
              log={log}
              setLog={setLog}
              monthDashID={monthDashID}
              setTaskList={setTaskList}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default TodayTasks
