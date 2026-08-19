import { useQuery } from "@tanstack/react-query";
import { getDateLogs, getTasks } from "../../../api/dashboard.api";
import type { DateLogI, TaskI } from "../../../types";
import Card from "../../shared/Card";
import { FiCalendar, FiCheck, FiMinus } from "react-icons/fi";

const DailyHabitMatrix = ({
  monthDashID,
  daysInMonth,
  selectedMonth,
  selectedYear,
}: {
  monthDashID: string;
  daysInMonth: number;
  selectedMonth: number;
  selectedYear: number;
}) => {
  const taskListData = useQuery({
    queryKey: ["tasks", monthDashID],
    queryFn: () => getTasks(monthDashID),
    enabled: !!monthDashID,
  });

  const taskList: TaskI[] = taskListData?.data?.tasks || [];

  const dateLogsData = useQuery({
    queryKey: ["date_logs", monthDashID],
    queryFn: () => getDateLogs(monthDashID),
    enabled: !!monthDashID,
  });
  const dateLogs: DateLogI[] = dateLogsData?.data?.dateLogs || [];

  return (
    <Card heading="" cardWidth="w-full">
      <div className="p-1 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FiCalendar className="text-yellow-400" /> Daily Habits Matrix
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Horizontal scrolling overview of all habits tracked day by day
            </p>
          </div>
          <div className="flex gap-4 text-[10px] text-gray-400 font-semibold">
            <span className="flex items-center gap-1">
              <FiCheck className="text-emerald-400" /> Done
            </span>
            <span className="flex items-center gap-1">
              <FiMinus className="text-gray-500" /> Skipped
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/1">
        {taskListData.isPending || dateLogsData.isPending ? (
          <div className="h-60 overflow-y-hidden flex justify-center animate-pulse bg-white/5 rounded-2xl"></div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-gray-400">
                <th className="sticky left-0 bg-[#16161c] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-white/5 min-w-40 z-10">
                  Habits
                </th>

                {Array.from({ length: daysInMonth }).map((_, index) => (
                  <th
                    key={index}
                    className="px-2.5 py-3 text-center text-xs font-bold min-w-9"
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {taskList?.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors"
                >
                  {/* Task name */}
                  <td className="sticky left-0 bg-[#16161c] px-4 py-3 font-semibold text-sm border-r border-white/5 z-10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate text-gray-200">
                          {task.taskName}
                        </span>
                      </div>

                      <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                        {task.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;

                    const dateLog = dateLogs?.find((d) => {
                      const date = new Date(d.fullDate);

                      return (
                        date.getDate() === day &&
                        date.getMonth() === selectedMonth &&
                        date.getFullYear() === selectedYear
                      );
                    });

                    const isCompleted =
                      dateLog?.tasks?.includes(task._id) ?? false;

                    return (
                      <td key={index} className="px-1.5 py-3 text-center">
                        <div className="flex items-center justify-center">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs shadow-sm shadow-emerald-500/5">
                              <FiCheck />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs">
                              <FiMinus />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DailyHabitMatrix;
