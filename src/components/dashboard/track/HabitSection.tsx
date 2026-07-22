import { useEffect, useRef, useState } from "react";
import { notify } from "../../../helper";
import { socket } from "../../../socket/socket";
import type { TaskI } from "../../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTasks, updateTaskName } from "../../../api/dashboardApi";

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
            />
          </div>
        ))
      )}
      <div className="h-10 flex items-center justify-between px-2"></div>
    </div>
  );
};

export const InputData = ({
  index,
  taskId,
  taskName,
  setTaskList,
}: {
  index: number;
  taskId: string;
  taskName: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
}) => {
  const [value, setValue] = useState<string>(taskName);
  const prevValueRef = useRef(taskName);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const timeoutRef = useRef(0);

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskName,
    onMutate: () => {
      setSaveStatus("saving");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    onSuccess: () => {
      setSaveStatus("saved");
      timeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 1000);
    },
    onError: () => {
      notify.error("Please try again.");
    },
  });

  useEffect(() => {
    if (value === prevValueRef.current) return;
    const timeout = setTimeout(() => {
      updateTaskMutation.mutate({
        taskId,
        taskName: value,
      });
    }, 500);

    prevValueRef.current = value;

    return () => clearTimeout(timeout);
  }, [value, taskId]);

  useEffect(() => {
    setValue(taskName);
    prevValueRef.current = taskName;
  }, [taskName]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
      className={`text-[12px] px-2 p-1 flex items-center gap-2 border-b border-darkBox/50 light:border-lightBorder`}
    >
      <span>{index + 1}.</span>

      <input
        type="text"
        className="outline-none w-full py-1"
        title={value}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaveStatus("saving");
        }}
        disabled={updateTaskMutation.isPending}
      />

      {saveStatus === "saving" && (
        <span className="text-gray-500 text-[8px] tracking-wider">
          Saving...
        </span>
      )}
      {saveStatus === "saved" && (
        <>
          <svg
            className="h-3 w-3 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>

          <span className="text-green-600 text-[8px] tracking-wider -ms-1">
            Saved
          </span>
        </>
      )}
    </div>
  );
};

export default HabitSection;
