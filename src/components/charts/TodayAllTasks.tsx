// import { useState } from "react";
// import { axiosPrivate } from "../../api/axios";
// import type { DateLogI } from "../../types";
// import { notify } from "../../helper";
// import { LuMinus } from "react-icons/lu";
// import CircleLoader from "../loaders/CircleLoader";
// import { InputData } from "../dashboard/track/habit_section/InputData";

// const TodayAllTasks = ({
//   taskList,
//   log,
//   setLog,
//   monthDashID,
// }: {
//   taskList: { _id: string; taskName: string; monthDashID: string }[];
//   log: DateLogI;
//   setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
//   monthDashID: string;
// }) => {
//   const [removeRowID, setRemoveRowID] = useState<string | null>(null);
//   const [addTaskLoading, setAddTaskLoading] = useState("");

//   const markTask = async (taskID: string, marked: boolean) => {
//     if (!log) return;
//     setAddTaskLoading(taskID);
//     try {
//       const res = await axiosPrivate.patch(
//         `/api/date-logs?monthDashID=${log?.monthDashID}&fullDate=${log?.fullDate}&taskID=${taskID}`,
//         { marked },
//       );

//       if (res?.data?.success) {
//         setLog((prev) => {
//           if (!prev) return prev;
//           return {
//             ...prev,
//             tasks: marked
//               ? [...prev.tasks, taskID]
//               : prev.tasks.filter((id) => id !== taskID),
//           };
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setAddTaskLoading("");
//     }
//   };

//   const handleDeleteRow = async (taskId: string) => {
//     setRemoveRowID(taskId);
//     try {
//       const res = await axiosPrivate.delete(
//         `/api/task?taskID=${taskId}&monthDashID=${monthDashID}`,
//       );
//       if (res?.data?.success) {
//         // setTaskList(res?.data?.tasks);
//         // setProgress(res?.data?.progress);
//       }
//     } catch (error) {
//       console.error(error);
//       notify.error("Please try again.");
//     } finally {
//       setRemoveRowID(null);
//     }
//   };

//   return (
//     <>
//       {/* Task List */}
//       <div className="space-y-3 w-full sm:max-h-70 sm:overflow-y-auto hide-scrollbar">
//         {taskList.map((task, index) => (
//           <div
//             key={task?._id}
//             className="bg-darkBox/20 light:bg-black/5 border border-white/10 light:border-black/10 px-3 py-1 rounded-lg transition flex items-center w-full gap-2"
//           >
//             <div className="flex items-center justify-between w-full">
//               <InputData
//                 index={index}
//                 taskId={task?._id}
//                 taskName={task?.taskName}
//               />

//               <div className="flex items-center gap-2">
//                 {addTaskLoading === task?._id ? (
//                   <CircleLoader />
//                 ) : (
//                   <input
//                     type="checkbox"
//                     checked={log.tasks.includes(task?._id)}
//                     onChange={() =>
//                       markTask(task?._id, !log.tasks.includes(task?._id))
//                     }
//                     className="w-4 h-4 accent-darkPrimary cursor-pointer relative"
//                   />
//                 )}
//                 {removeRowID === task?._id ? (
//                   <button className="cursor-not-allowed smText p-2 animate-pulse bg-gray-400 rounded-sm"></button>
//                 ) : (
//                   <div
//                     className="cursor-pointer border rounded-sm border-gray-400 text-gray-400 bg-white"
//                     onClick={() => handleDeleteRow(task?._id)}
//                   >
//                     <LuMinus size={15} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default TodayAllTasks;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosPrivate } from "../../api/axios";
import type { DateLogI } from "../../types";
import { notify } from "../../helper";
import { LuMinus, LuCheck, LuCircle } from "react-icons/lu";
import CircleLoader from "../loaders/CircleLoader";
import { InputData } from "../dashboard/track/habit_section/InputData";

const TodayAllTasks = ({
  taskList,
  log,
  setLog,
  monthDashID,
}: {
  taskList: {
    _id: string;
    taskName: string;
    monthDashID: string;
  }[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
}) => {
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);
  const [addTaskLoading, setAddTaskLoading] = useState("");

  const completedCount = log.tasks.length;
  const totalCount = taskList.length;

  const markTask = async (taskID: string, marked: boolean) => {
    if (!log) return;

    setAddTaskLoading(taskID);

    try {
      const res = await axiosPrivate.patch(
        `/api/date-logs?monthDashID=${log.monthDashID}&fullDate=${log.fullDate}&taskID=${taskID}`,
        { marked },
      );

      if (res?.data?.success) {
        setLog((prev) => ({
          ...prev,
          tasks: marked
            ? [...new Set([...prev.tasks, taskID])]
            : prev.tasks.filter((id) => id !== taskID),
        }));
      }
    } catch (error) {
      console.error(error);
      notify.error("Unable to update task.");
    } finally {
      setAddTaskLoading("");
    }
  };

  const handleDeleteRow = async (taskId: string) => {
    setRemoveRowID(taskId);

    try {
      const res = await axiosPrivate.delete(
        `/api/task?taskID=${taskId}&monthDashID=${monthDashID}`,
      );

      if (!res?.data?.success) {
        notify.error("Unable to delete task.");
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setRemoveRowID(null);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Task Summary */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
          Your habits
        </p>

        <p className="text-[10px] text-gray-500">
          {completedCount}/{totalCount}
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {taskList.map((task, index) => {
            const isCompleted = log.tasks.includes(task._id);
            const isLoading = addTaskLoading === task._id;
            const isDeleting = removeRowID === task._id;

            return (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  isCompleted
                    ? "border-indigo-400/20 bg-indigo-500/[0.07]"
                    : "border-white/[0.08] bg-darkBox/20 light:border-black/10 light:bg-black/[0.02]"
                }`}
              >
                {/* Status */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  disabled={isLoading}
                  onClick={() => markTask(task._id, !isCompleted)}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isCompleted
                      ? "border-indigo-400 bg-indigo-500 text-white"
                      : "border-gray-500/40 text-transparent hover:border-indigo-400"
                  }`}
                  aria-label={
                    isCompleted ? "Unmark task" : "Mark task complete"
                  }
                >
                  {isLoading ? (
                    <CircleLoader className="h-3.5 w-3.5" />
                  ) : isCompleted ? (
                    <LuCheck size={15} strokeWidth={2.5} />
                  ) : (
                    <LuCircle size={14} className="text-gray-500/40" />
                  )}
                </motion.button>

                {/* Task Name */}
                <div className="min-w-0 flex-1">
                  <div
                    className={`transition-opacity ${
                      isCompleted ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    <InputData
                      index={index}
                      taskId={task._id}
                      taskName={task.taskName}
                    />
                  </div>
                </div>

                {/* Delete */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  disabled={isDeleting}
                  onClick={() => handleDeleteRow(task._id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                  aria-label="Delete task"
                >
                  {isDeleting ? (
                    <CircleLoader className="h-3.5 w-3.5" />
                  ) : (
                    <LuMinus size={15} />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {taskList.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center light:border-black/10">
            <p className="text-xs text-gray-500">No tasks for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayAllTasks;
