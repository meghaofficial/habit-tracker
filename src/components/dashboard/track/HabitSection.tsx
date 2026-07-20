import { axiosPrivate } from "../../../api/axios";
import { useEffect, useRef, useState } from "react";
import { notify } from "../../../helper";
import { socket } from "../../../socket/socket";
import type { TaskI } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../api/dashboardApi";

const HabitSection = ({
  setTaskList,
  loading,
  dashboardID,
}: {
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  loading: boolean;
  dashboardID: string;
}) => {
  const taskListData = useQuery({
    queryKey: ["tasks", dashboardID],
    queryFn: () => getTasks(dashboardID),
    enabled: !!dashboardID,
  });

  const taskList: TaskI[] = taskListData?.data?.tasks;

  return (
    <div>
      <p
        className="smText p-5.5 text-center border-b border-black"
        style={{ fontWeight: "bolder" }}
      >
        DAILY HABITS
      </p>

      <p
        className="smText p-2.5 text-center border-b border-darkBg bg-darkPrimary light:bg-lightPrimary text-white"
        style={{ fontWeight: "bold" }}
      >
        HABITS
      </p>

      {loading ? (
        <div className="p-2 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-gray-500/50 h-7 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        taskList?.map((task, index) => (
          <div key={task._id}>
            <InputData
              index={index}
              taskId={task._id}
              taskName={task.taskName}
              setTaskList={setTaskList}
              len={taskList.length}
            />
          </div>
        ))
      )}
    </div>
  );
};

export const InputData = ({
  index,
  taskId,
  taskName,
  screen = "lg",
  setTaskList,
  len
}: {
  index: number;
  taskId: string;
  taskName: string;
  screen?: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  len: number;
}) => {
  const [value, setValue] = useState<string>(taskName);

  const prevValueRef = useRef(taskName);

  useEffect(() => {
    if (value === prevValueRef.current) return;

    const timeout = setTimeout(() => {
      axiosPrivate
        .patch(`/api/task?taskID=${taskId}`, {
          taskName: value,
        })
        .catch(() => notify.error("Please try again."));
    }, 500);

    prevValueRef.current = value;
    return () => clearTimeout(timeout);
  }, [value, taskId]);

  useEffect(() => {
    setValue(taskName);
  }, [taskName]);

  // WEBSOCKET SYNCING
  useEffect(() => {
    const onTaskUpdate = (data: any) => {
      setTaskList((prev) =>
        prev.map((task) => (task._id === data.task._id ? data.task : task)),
      );
    };
    socket.on("update-task", onTaskUpdate);
    return () => {
      socket.off("update-task", onTaskUpdate);
    };
  }, []);

  return (
    <div
      className={`text-[12px] px-2 p-1 flex items-center gap-2 ${index < len-1 && 'border-b'} border-darkBox/50 light:border-lightBorder`}
    >
      <span>{index + 1}.</span>

      <input
        type="text"
        className="outline-none w-full py-1"
        title={value}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default HabitSection;
