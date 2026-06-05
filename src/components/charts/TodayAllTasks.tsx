import { useState } from "react";
import { axiosPrivate } from "../../api/axios";
import type {
  DateLogI,
  DateLogProgressI,
  OverallProgressI,
  TaskI,
  TaskProgressI,
} from "../../types";
import { InputData } from "../dashboard/track/HabitSection";
import { notify } from "../../helper";
import { LuMinus } from "react-icons/lu";

const TodayAllTasks = ({
  taskList,
  log,
  setLog,
  monthDashID,
  setTaskList,
  setProgress,
}: {
  taskList: { _id: string; taskName: string; monthDashID: string }[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  setProgress: React.Dispatch<
    React.SetStateAction<{
      overallProgress: OverallProgressI;
      dateLogProgress: DateLogProgressI[];
      taskProgress: TaskProgressI[];
    }>
  >;
}) => {
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);
  const markTask = async (taskID: string, marked: boolean) => {
    if (!log) return;
    try {
      const res = await axiosPrivate.patch(
        `/api/date-logs?monthDashID=${log?.monthDashID}&fullDate=${log?.fullDate}&taskID=${taskID}`,
        { marked },
      );

      if (res?.data?.success) {
        setLog((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tasks: marked
              ? [...prev.tasks, taskID]
              : prev.tasks.filter((id) => id !== taskID),
          };
        });
      }
    } catch (error) {
      // setDateLogs(previousLogs);
      console.error(error);
    }
  };

  const handleDeleteRow = async (taskId: string) => {
    setRemoveRowID(taskId);
    try {
      const res = await axiosPrivate.delete(
        `/api/task?taskID=${taskId}&monthDashID=${monthDashID}`,
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

  return (
    <>
      {/* Task List */}
      <div className="space-y-3 w-full sm:max-h-70 sm:overflow-y-auto hide-scrollbar">
        {taskList.map((task, index) => (
          <div
            key={task?._id}
            className="bg-darkBox/20 px-3 py-1 rounded-lg transition flex items-center w-full gap-2"
          >
            <div className="flex items-center justify-between w-full">
              <InputData
                index={index}
                taskId={task?._id}
                taskName={task?.taskName}
                screen="sm"
                setTaskList={setTaskList}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={log.tasks.includes(task?._id)}
                  onChange={() =>
                    markTask(task?._id, !log.tasks.includes(task?._id))
                  }
                  className="w-4 h-4 accent-darkPrimary cursor-pointer relative"
                />
                {removeRowID === task?._id ? (
                  <button className="cursor-not-allowed smText p-2 animate-pulse bg-gray-400 rounded-sm"></button>
                ) : (
                  <div
                    className="cursor-pointer border rounded-sm border-gray-400 text-gray-400 bg-white"
                    onClick={() => handleDeleteRow(task?._id)}
                  >
                    <LuMinus size={15} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayAllTasks;
