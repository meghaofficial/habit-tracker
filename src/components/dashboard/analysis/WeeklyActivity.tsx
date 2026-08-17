import { motion } from "framer-motion";
import CardHeader from "../../shared/CardHeader";
import { FiBarChart2 } from "react-icons/fi";
import type { TopLevelAnalysisI, WeekAnalysisI } from "../../../types";
import { WeeklyBarChart } from "../../charts/WeeklyBarChart";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyActivity } from "../../../api/analysis.api";

const WeeklyActivity = ({
  topLevelData,
  numHabits,
  monthDashID,
}: {
  topLevelData: TopLevelAnalysisI;
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-full flex flex-col justify-between h-106.25"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/3 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 bg-indigo-500/5 rounded-full blur-3xl" />

      <div>
        {/* Header (styled like Monthly Notes) */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <CardHeader
            icon={FiBarChart2}
            title="Weekly Activity"
            subTitle={weeklyAna?.week || "This Week"}
          />

          {/* Badge/Details */}
          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shrink-0">
            Tasks: {topLevelData?.avgPerDay} / {weeklyPossible}
          </span>
        </div>

        {/* Body wrapper */}
        <div className="relative p-4 flex flex-col gap-3">
          <div className="flex items-center justify-center overflow-x-auto w-full">
            <WeeklyBarChart data={weeklyAna} maxValue={numHabits || 1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyActivity;
