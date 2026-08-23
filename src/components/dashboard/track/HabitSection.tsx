import type { TaskI } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../api/dashboard.api";
import { InputData } from "./InputData";

const HabitSection = ({
  loading,
  dashboardID,
}: {
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
            />
          </div>
        ))
      )}
      <div className="h-10 flex items-center justify-between px-2"></div>
    </div>
  );
};

export default HabitSection;
