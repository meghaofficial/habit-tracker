import { motion } from "framer-motion";
import CardHeader from "../../shared/CardHeader";
import { FiTrendingUp } from "react-icons/fi";
import type { MonthAnalysisI, TopLevelAnalysisI } from "../../../types";
import { MonthlyLineChart } from "../../charts/MonthlyLineChart";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyActivity } from "../../../api/analysis.api";

const MonthlyActivity = ({
  topLevelData,
  numHabits,
  monthDashID,
}: {
  topLevelData: TopLevelAnalysisI;
  numHabits: number;
  monthDashID: string;
}) => {
  const monthlyActivityData = useQuery({
    queryKey: ["monthly_activity", monthDashID],
    queryFn: () => getMonthlyActivity(monthDashID!),
    enabled: !!monthDashID,
  });
  const monthlyAna: MonthAnalysisI = monthlyActivityData.data?.data ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
    >
      <div className="absolute bottom-0 left-0 w-48 h-28 sm:w-64 sm:h-32 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-violet-500/5 rounded-full blur-3xl" />
      <div>
        {/* Header (styled like Weekly Activity) */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <CardHeader
            icon={FiTrendingUp}
            title="Monthly Activity"
            subTitle="This Month"
          />

          {/* Badge/Details */}
          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shrink-0">
            Tasks: {topLevelData?.avgPerDay} /{" "}
            {topLevelData?.totalDaysInMonth * numHabits}
          </span>
        </div>

        {/* Body wrapper */}
        <div className="relative p-4 flex flex-col gap-3">
          <div className="flex items-center justify-center overflow-x-auto w-full pe-2 sm:pe-7">
            <MonthlyLineChart data={monthlyAna} maxValue={numHabits || 1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonthlyActivity;
