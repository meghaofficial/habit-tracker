// import { useEffect, useState } from "react";
// import type { DateLogI, TaskI } from "../../../../types";
// import CircleLoader from "../../../loaders/CircleLoader";
// import CustomButton from "../../../shared/CutomButton";
// import Card from "../../../shared/Card";
// import { formatDateString2 } from "../../../../helper";
// import TodayAllTasks from "../../../charts/TodayAllTasks";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { addTask, getDateLogByDate } from "../../../../api/dashboard.api";

// const TodayTasks = ({
//   taskList,
//   log,
//   setLog,
//   monthDashID,
//   monthStatus,
// }: {
//   taskList: TaskI[];
//   log: DateLogI;
//   setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
//   monthDashID: string;
//   monthStatus: string;
// }) => {
//   const selectedDate = new Date();
//   const [heading, setHeading] = useState("Todays Tasks");
//   const queryClient = useQueryClient();

//   const dateLogData = useQuery({
//     queryKey: ["date_log", monthDashID],
//     queryFn: () => getDateLogByDate(monthDashID),
//     enabled: !!monthDashID,
//   });

//   useEffect(() => {
//     if (!monthDashID) return;
//     if (selectedDate.getDate() === new Date().getDate())
//       setHeading("Todays Tasks");
//     else setHeading("Other's Day Tasks");
//   }, [selectedDate]);

//   // Mutations
//   const addTaskMutation = useMutation({
//     mutationFn: addTask,
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["tasks", monthDashID],
//       });
//     },
//   });

//   const handleAddRow = () => {
//     if (monthStatus === "scheduled") {
//       alert(
//         "Can not add task as the subscription for this month is not active",
//       );
//       return;
//     }
//     addTaskMutation.mutate(monthDashID);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//       <Card heading={heading}>
//         <div className="absolute right-5 top-5 z-9999">
//           <CustomButton type="transparent" onClick={handleAddRow}>
//             {addTaskMutation.isPending ? (
//               <p className="px-3">
//                 <CircleLoader className="h-4 w-4" />
//               </p>
//             ) : (
//               "Add Task"
//             )}
//           </CustomButton>
//         </div>
//         <div className="flex items-center justify-between pb-3 pt-2">
//           {dateLogData.isPending ? (
//             <div className="w-20 h-4 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
//           ) : (
//             <p className="text-gray-500 mt-1 text-[10px] cursor-default">
//               {formatDateString2(selectedDate.toString())}
//             </p>
//           )}
//         </div>
//         <div className="flex items-center justify-center">
//           {dateLogData.isPending ? (
//             <div className="flex flex-col gap-2 w-full pb-5">
//               {Array.from({ length: 6 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="w-full h-8 mt-1 rounded bg-gray-500/50 animate-pulse"
//                 ></div>
//               ))}
//             </div>
//           ) : (
//             <TodayAllTasks
//               taskList={taskList}
//               log={log}
//               setLog={setLog}
//               monthDashID={monthDashID}
//             />
//           )}
//         </div>
//       </Card>
//     </>
//   );
// };

// export default TodayTasks;

import { useEffect, useMemo, useState } from "react";
import type { DateLogI, TaskI } from "../../../../types";
import CircleLoader from "../../../loaders/CircleLoader";
import CustomButton from "../../../shared/CutomButton";
import Card from "../../../shared/Card";
import TodayAllTasks from "../../../charts/TodayAllTasks";
import { addTask } from "../../../../api/dashboard.api";
import { useMutation } from "@tanstack/react-query";

const TodayTasks = ({
  taskList,
  log,
  setLog,
  monthDashID,
  monthStatus,
}: {
  taskList: TaskI[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
  monthStatus: string;
}) => {
  const [heading, setHeading] = useState("Today's Tasks");

  const selectedDate = useMemo(() => {
    return new Date(log.fullDate);
  }, [log.fullDate]);

  const completedCount = log?.tasks?.length;
  const totalCount = taskList?.length;

  const progress = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  useEffect(() => {
    const today = new Date();

    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    setHeading(isToday ? "Today's Tasks" : "Daily Tasks");
  }, [selectedDate]);

  const addTaskMutation = useMutation({
    mutationFn: addTask,
  });

  const handleAddRow = () => {
    if (monthStatus === "scheduled") {
      alert("Cannot add task as the subscription is not active.");
      return;
    }

    addTaskMutation.mutate(monthDashID);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Card heading={heading}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-gray-500 light:text-gray-600">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold text-white light:text-black">
                {completedCount}
              </span>

              <span className="text-xs text-gray-500">
                / {totalCount} completed
              </span>
            </div>
          </div>

          <CustomButton type="transparent" onClick={handleAddRow}>
            {addTaskMutation.isPending ? (
              <CircleLoader className="h-4 w-4" />
            ) : (
              "Add Task"
            )}
          </CustomButton>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">Daily progress</span>
            <span className="font-medium text-indigo-400">{progress}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10 light:bg-black/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <TodayAllTasks
          taskList={taskList}
          log={log}
          setLog={setLog}
          monthDashID={monthDashID}
        />
      </div>
    </Card>
  );
};

export default TodayTasks;
