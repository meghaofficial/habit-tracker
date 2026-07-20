import { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { MonthlyLineChart } from "../../charts/MonthlyLineChart";
import { WeeklyBarChart } from "../../charts/WeeklyBarChart";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateString } from "../../../helper";
import type { DateLogI, TaskI, StreakI, HeatMapI } from "../../../types";
import {
  FiActivity,
  FiTrendingUp,
  FiZap,
  FiAlertTriangle,
  FiCalendar,
  FiBarChart2,
  FiGrid,
} from "react-icons/fi";
import HeatMap from "./HeatMap";

const AnalysisMainComponent = ({
  taskList,
  monthDashID,
  log,
  streakData,
  dateLogs,
}: {
  taskList: TaskI[];
  monthDashID: string;
  log: DateLogI;
  streakData: StreakI;
  dateLogs: DateLogI[];
}) => {
  const [weeklyAna, setWeeklyAna] = useState<{
    date: string;
    week: string;
    range: string;
    weekDays: string[];
    taskDone: number[];
  }>({
    date: "",
    week: "",
    range: "",
    weekDays: [],
    taskDone: [],
  });

  const [monthlyAna, setMonthlyAna] = useState<{
    dates: number[];
    tasks: number[];
  }>({
    dates: [],
    tasks: [],
  });

  const [heatMapData, setHeatMapData] = useState<HeatMapI[]>([]);

  const getWeeklyActivity = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/get-weekly-activity?monthDashID=${monthDashID}`,
      );
      if (res?.data?.success) {
        setWeeklyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMonthlyActivity = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/get-monthly-activity?monthDashID=${monthDashID}`,
      );
      if (res?.data?.success) {
        setMonthlyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWeeklyActivity();
    getMonthlyActivity();
  }, [log?.tasks]);

  useEffect(() => {
    const arr = dateLogs.map((d) => ({
      date: d?.fullDate,
      count: d?.tasks?.length,
    }));
    setHeatMapData(arr);
  }, [dateLogs]);

  // Derived stats
  const totalTasksDone = weeklyAna.taskDone?.reduce((s, n) => s + n, 0) ?? 0;
  const avgPerDay =
    weeklyAna.taskDone?.length > 0
      ? (totalTasksDone / weeklyAna.taskDone.length).toFixed(1)
      : "0";
  const peakDay =
    weeklyAna.weekDays?.[
    weeklyAna.taskDone?.indexOf(Math.max(...(weeklyAna.taskDone ?? [0])))
    ] ?? "—";

  const statCards = [
    {
      label: "Tasks This Week",
      value: totalTasksDone,
      icon: <FiActivity size={18} />,
      color: "from-indigo-500/20 to-violet-500/20",
      border: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      glow: "bg-indigo-500/10",
    },
    {
      label: "Avg / Day",
      value: avgPerDay,
      icon: <FiTrendingUp size={18} />,
      color: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/30",
      iconColor: "text-violet-400",
      glow: "bg-violet-500/10",
    },
    {
      label: "Peak Day",
      value: peakDay,
      icon: <FiZap size={18} />,
      color: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      glow: "bg-yellow-500/10",
    },
    {
      label: "Habits Tracked",
      value: taskList?.length ?? 0,
      icon: <FiBarChart2 size={18} />,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      glow: "bg-emerald-500/10",
    },
  ];

  const insightCards = [
    {
      title: "Most Consistent",
      words:
        streakData?.mostConsistentHabits?.length > 0
          ? streakData.mostConsistentHabits
          : ["None"],
      emoji: streakData?.mostConsistentHabits?.length > 0 ? "🤗" : "😥",
      accent: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20",
      badge: "text-emerald-400",
    },
    {
      title: "Needs Work",
      words:
        streakData?.leastConsistentHabits?.length > 0
          ? streakData.leastConsistentHabits
          : ["None"],
      emoji: streakData?.leastConsistentHabits?.length > 0 ? "😒" : "😓",
      accent: "from-rose-500/10 to-pink-500/10",
      border: "border-rose-500/20",
      badge: "text-rose-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 mb-6 w-full text-white">

      {/* ── Header Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <FiActivity size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent truncate">
                Activity Analysis
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5 truncate">
                {weeklyAna?.range
                  ? `Showing data for ${weeklyAna.range}`
                  : "Current month performance overview"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <FiCalendar size={11} className="text-indigo-400" />
            <span className="text-[10px] sm:text-xs text-indigo-300 font-medium whitespace-nowrap">
              {formatDateString(weeklyAna?.date) || "Today"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats ── 2 cols on mobile, 4 on desktop ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} p-3.5 sm:p-4 group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div
              className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${card.glow} rounded-full blur-2xl transition-opacity duration-500`}
            />
            <div className="relative">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/20 flex items-center justify-center ${card.iconColor} mb-2.5 sm:mb-3`}
              >
                {card.icon}
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-tight">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── stacks on mobile ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
        >
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <FiBarChart2 size={15} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Weekly Activity</p>
                  <p className="text-[10px] text-gray-500">
                    {weeklyAna?.week || "This Week"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium">
                Week View
              </span>
            </div>
            <div className="flex items-center justify-center overflow-x-auto">
              <WeeklyBarChart data={weeklyAna} maxValue={taskList?.length} />
            </div>
          </div>
        </motion.div>

        {/* Habit Insights */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5 flex flex-col gap-3 sm:gap-4"
        >
          <div className="absolute top-0 left-0 w-36 h-36 sm:w-40 sm:h-40 bg-violet-500/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col gap-3 sm:gap-4 h-full">

            {/* Section header */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/20 text-violet-400">
                <FiZap size={15} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Habit Insights</p>
                <p className="text-[10px] text-gray-500">Consistency &amp; patterns</p>
              </div>
            </div>

            {/* Insight cards — always 2 cols */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {insightCards.map((d, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl bg-gradient-to-br ${d.accent} border ${d.border} p-3 sm:p-4 flex flex-col justify-between min-h-28 sm:min-h-36`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] tracking-wide text-gray-400 font-semibold uppercase leading-tight">
                      {d.title}
                    </span>
                    <span className="text-xs flex items-center">
                      {d.words[0] !== "None" ? (
                        <FiActivity size={10} className={d.badge} />
                      ) : (
                        <FiAlertTriangle size={10} className="text-gray-500" />
                      )}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-2 sm:mt-3">
                    <RotatingText words={d.words} />
                    <span className="text-2xl sm:text-3xl leading-none ml-1.5 sm:ml-2">
                      {d.emoji}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
              <div className="flex items-center gap-2">
                <FiGrid size={11} className="text-gray-500" />
                <span className="text-[10px] sm:text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
                  Daily Completion Heatmap
                </span>
              </div>
              {/* scrollable on narrow screens */}
              <div className="overflow-x-auto">
                <HeatMap heatMapData={heatMapData} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Monthly Line Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5 mb-3"
      >
        <div className="absolute bottom-0 left-0 w-48 h-28 sm:w-64 sm:h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <FiTrendingUp size={15} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Monthly Activity</p>
                <p className="text-[10px] text-gray-500 hidden sm:block">
                  Daily tasks completed across this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                Tasks Completed
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center overflow-x-auto pe-2 sm:pe-7">
            <MonthlyLineChart data={monthlyAna} maxValue={taskList?.length} />
          </div>
        </div>
      </motion.div>

    </div>
  );
};

// ── Rotating Text ──────────────────────────────────────────────────────────────
function RotatingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const shouldAnimate = words.length > 1;

  useEffect(() => {
    if (!shouldAnimate) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative h-7 sm:h-9 overflow-hidden flex-1">
      <AnimatePresence mode="wait">
        {shouldAnimate ? (
          <motion.div
            key={words[index]}
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 w-full text-[16px] sm:text-[22px] leading-none font-black text-white google-sans line-clamp-1"
            title={words[index]}
          >
            {words[index]}
          </motion.div>
        ) : (
          <div
            className="absolute left-0 w-full text-[16px] sm:text-[22px] leading-none font-black text-white google-sans line-clamp-1"
            title={words[0]}
          >
            {words[0]}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnalysisMainComponent;
