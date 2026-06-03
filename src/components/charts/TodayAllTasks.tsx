import { axiosPrivate } from "../../api/axios";
import type { DateLogI } from "../../types";

const TodayAllTasks = ({ taskList, log, setLog }: {
  taskList: { _id: string, taskName: string, monthDashID: string }[],
  log: DateLogI,
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>
}) => {

  const markTask = async (taskID: string, marked: boolean) => {
    if (!log) return;
    try {
      const res = await axiosPrivate.patch(
        `/api/date-logs?monthDashID=${log?.monthDashID}&fullDate=${log?.fullDate}&taskID=${taskID}`,
        { marked }
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
  }

  return (
    <>
      {/* Task List */}
      <div className="space-y-1 w-full sm:max-h-70 sm:overflow-y-auto hide-scrollbar">
        {taskList.map((task, index) => (
          <div
            key={task?._id}
            className="bg-darkBox/20 px-4 py-3 rounded-lg transition flex items-center w-full gap-2"
          >
            <span>{index + 1}.</span>
            <div className="flex items-center justify-between w-full">
              <span
                className={`text-sm transition
                  `}
              >
                {task.taskName}
              </span>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={log.tasks.includes(task?._id)}
                onChange={() => markTask(task?._id, !log.tasks.includes(task?._id))}
                className="w-4 h-4 accent-darkPrimary cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayAllTasks;