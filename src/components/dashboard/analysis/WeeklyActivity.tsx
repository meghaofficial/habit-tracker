import { motion } from "framer-motion";
import CardHeader from "../../shared/CardHeader";
import { FiBarChart2 } from "react-icons/fi";
import type { WeekAnalysisI } from "../../../types";
import { WeeklyBarChart } from "../../charts/WeeklyBarChart";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyActivity } from "../../../api/analysis.api";

const WeeklyActivity = ({
  numHabits,
  monthDashID,
}: {
  numHabits: number;
  monthDashID: string;
}) => {
  const weeklyActivityData = useQuery({
    queryKey: ["weekly_activity", monthDashID],
    queryFn: () => getWeeklyActivity(monthDashID!),
    enabled: !!monthDashID,
  });
  const weeklyAna: WeekAnalysisI = weeklyActivityData.data?.data ?? [];
  const weeklyPossible = numHabits * (weeklyAna.taskDone?.length || 7);

  const totalWeekWorked = weeklyAna?.taskDone
    ?.map((d) => d)
    ?.reduce((prev, accum) => prev + accum);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-full flex flex-col justify-between h-full"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/3 via-transparent to-transparent pointer-events-none" />

      <div className="sm:h-[calc(100%-60px)] h-80">
        {/* Header (styled like Monthly Notes) */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <CardHeader
            icon={FiBarChart2}
            title="Weekly Activity"
            subTitle={weeklyAna?.week || "This Week"}
          />

          {/* Badge/Details */}
          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shrink-0">
            Tasks: {totalWeekWorked} / {weeklyPossible}
          </span>
        </div>

        {/* Body wrapper */}
        <div className="relative p-4 flex flex-col gap-3 sm:h-full h-[calc(100%-60px)] min-h-0">
          <div className="flex-1 min-h-0 w-full overflow-x-auto">
            <WeeklyBarChart data={weeklyAna} maxValue={numHabits || 1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyActivity;
