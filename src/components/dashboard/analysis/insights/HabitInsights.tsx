import { motion } from "framer-motion";
import CardHeader from "../../../shared/CardHeader";
import {
  FiActivity,
  FiAlertTriangle,
  FiAward,
  FiGrid,
  FiZap,
} from "react-icons/fi";
import RotatingText from "./RotatingText";
import HeatMap from "./HeatMap";
import type { DateLogI, HeatMapI, TopLevelAnalysisI } from "../../../../types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDateLogs } from "../../../../api/dashboard.api";

const HabitInsights = ({
  topLevelData,
  monthDashID,
}: {
  topLevelData: TopLevelAnalysisI;
  monthDashID: string;
}) => {
  const insightCards = insightCardInfo(topLevelData);
  const [heatMapData, setHeatMapData] = useState<HeatMapI[]>([]);

  const dateLogsData = useQuery({
    queryKey: ["date_logs", monthDashID],
    queryFn: () => getDateLogs(monthDashID),
    enabled: !!monthDashID,
  });
  const dateLogs: DateLogI[] = dateLogsData?.data?.dateLogs;

  useEffect(() => {
    const arr = dateLogs?.map((d) => ({
      date: d?.fullDate,
      count: d?.tasks?.length,
    }));
    setHeatMapData(arr);
  }, [dateLogs, dateLogs]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-full flex flex-col justify-between h-106.25"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/3 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-40 sm:h-40 bg-violet-500/5 rounded-full blur-2xl" />

      <div className="h-full flex flex-col justify-between">
        {/* Header (styled like Monthly Notes) */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <CardHeader
            icon={FiZap}
            title="Habit Insights"
            subTitle="Consistency & Patterns"
          />
        </div>

        {/* Body wrapper */}
        <div className="relative p-4 flex flex-col gap-4 grow justify-between">
          {/* Insight cards — always 2 cols */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {insightCards.map((d, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl border ${d.border} bg-linear-to-br ${d.accent} backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-between min-h-28 sm:min-h-36 group hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300`}
              >
                {/* Accent glows */}
                <div
                  className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${d.glow}`}
                />

                {/* Large background decorative icon */}
                {d.bgIcon}

                {/* Header Row */}
                <div className="relative flex items-center justify-between border-b border-white/5 pb-2 sm:pb-2.5">
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-gray-300 font-bold uppercase truncate leading-none">
                    {d.title}
                  </span>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-md border text-[8px] sm:text-[9px] font-bold tracking-wider uppercase leading-none whitespace-nowrap ${d.badge}`}
                  >
                    {d.words[0] !== "None"
                      ? idx === 0
                        ? "Achieving"
                        : "Focus"
                      : "Stable"}
                  </span>
                </div>

                {/* Content Row */}
                <div className="relative flex items-end justify-between mt-2 sm:mt-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
                      {idx === 0 ? "Top Habit" : "Growth Area"}
                    </p>
                    <RotatingText words={d.words} />
                  </div>
                  <span className="ml-1.5 sm:ml-2 shrink-0">{d.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl bg-white/2 border border-white/5 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <FiGrid size={11} className="text-gray-500" />
              <span className="text-[10px] sm:text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
                Daily Completion
              </span>
            </div>
            {/* scrollable on narrow screens */}
            <div className="overflow-x-auto">
              <HeatMap heatMapData={heatMapData} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function insightCardInfo(topLevelData: TopLevelAnalysisI) {
  return [
    {
      title: "Most Consistent",
      words:
        topLevelData?.mostConsistentHabits?.length > 0
          ? topLevelData.mostConsistentHabits
          : ["None"],
      accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glow: "bg-emerald-500/20",
      bgIcon: (
        <FiAward
          size={80}
          className="text-emerald-400 opacity-[0.06] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 pointer-events-none"
        />
      ),
      icon:
        topLevelData?.mostConsistentHabits?.length > 0 ? (
          <FiAward
            size={20}
            className="text-emerald-400 filter drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)] transition-transform duration-300 group-hover:scale-115"
          />
        ) : (
          <FiAlertTriangle
            size={20}
            className="text-gray-500 transition-transform duration-300 group-hover:scale-115"
          />
        ),
    },
    {
      title: "Needs Work",
      words:
        topLevelData?.leastConsistentHabits?.length > 0
          ? topLevelData.leastConsistentHabits
          : ["None"],
      accent: "from-rose-500/10 via-rose-500/5 to-transparent",
      border: "border-rose-500/20 hover:border-rose-500/40",
      badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      glow: "bg-rose-500/20",
      bgIcon: (
        <FiAlertTriangle
          size={80}
          className="text-rose-400 opacity-[0.06] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none"
        />
      ),
      icon:
        topLevelData?.leastConsistentHabits?.length > 0 ? (
          <FiAlertTriangle
            size={20}
            className="text-rose-400 filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)] transition-transform duration-300 group-hover:scale-115"
          />
        ) : (
          <FiActivity
            size={20}
            className="text-gray-500 transition-transform duration-300 group-hover:scale-115"
          />
        ),
    },
  ];
}

export default HabitInsights;
