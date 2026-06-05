import { axiosPrivate } from "../../../api/axios";
import { useEffect, useRef, useState } from "react";
import { notify } from "../../../helper";
import { socket } from "../../../socket/socket";
import type { TaskI } from "../../../types";

const HabitSection = ({
  taskList,
  setTaskList,
}: {
  taskList: {
    _id: string;
    taskName: string;
  }[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
}) => {
  return (
    <div>
      <p
        className="smText p-5.5 text-center border-b border-black"
        style={{ fontWeight: "bolder" }}
      >
        DAILY HABITS
      </p>

      <p
        className="smText p-2.5 text-center border-b border-darkBg bg-darkPrimary light:bg-lightPrimary"
        style={{ fontWeight: "bold" }}
      >
        HABITS
      </p>

      {taskList?.map((task, index) => (
        <div key={task._id}>
          <InputData
            index={index}
            taskId={task._id}
            taskName={task.taskName}
            setTaskList={setTaskList}
          />
        </div>
      ))}
    </div>
  );
};

export const InputData = ({
  index,
  taskId,
  taskName,
  screen = "lg",
  setTaskList,
}: {
  index: number;
  taskId: string;
  taskName: string;
  screen?: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
}) => {
  const [value, setValue] = useState<string>(taskName);

  const prevValueRef = useRef(taskName);

  useEffect(() => {
    prevValueRef.current = taskName;
  }, [taskName]);

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
      className={`text-[12px] px-2 p-1 flex items-center gap-2 ${screen === "lg" && "border-b border-darkBox/50"}`}
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
