import { axiosPrivate } from "../../../api/axios";
import { useEffect, useRef, useState } from "react";
import { notify } from "../../../helper";

const HabitSection = ({
  taskList
}: {
  taskList: {
    _id: string,
    taskName: string
  }[]
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
          />
        </div>
      ))}
    </div>
  );
};

const InputData = ({
  index,
  taskId,
  taskName
}: {
  index: number;
  taskId: string;
  taskName: string;
}) => {

  const [value, setValue] =
    useState<string>(taskName);

  const prevValueRef = useRef(taskName);

  useEffect(() => {
    prevValueRef.current = taskName;
  }, [taskName]);

  useEffect(() => {

    if (value === prevValueRef.current)
      return;

    const timeout = setTimeout(() => {

      axiosPrivate.patch(
        `/api/task?taskID=${taskId}`,
        {
          taskName: value
        }
      ).catch(() =>
        notify.error("Please try again.")
      );

    }, 500);

    prevValueRef.current = value;

    return () => clearTimeout(timeout);

  }, [value, taskId]);

  return (
    <div className="text-[12px] px-2 p-1 flex items-center gap-2 border-b border-gray-700">
      <span>{index + 1}</span>

      <input
        type="text"
        className="outline-none w-full py-1"
        title="value"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
      />
    </div>
  );
};

export default HabitSection