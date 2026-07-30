import { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { MonthlyLineChart } from "../../charts/MonthlyLineChart";
import { WeeklyBarChart } from "../../charts/WeeklyBarChart";
import { FilledPieChart } from "../../charts/FilledPieChart";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateString } from "../../../helper";
import type {
  DateLogI,
  TaskI,
  StreakI,
  HeatMapI,
  WeekAnalysisI,
  MonthAnalysisI,
  TopLevelAnalysisI,
} from "../../../types";
import {
  FiActivity,
  FiTrendingUp,
  FiZap,
  FiAlertTriangle,
  FiCalendar,
  FiBarChart2,
  FiGrid,
  FiAward,
  FiPercent,
  FiClock,
} from "react-icons/fi";
import HeatMap from "./HeatMap";
import { useQuery } from "@tanstack/react-query";
import { getDateLogs, getTasks } from "../../../api/dashboard.api";
import { getMonthlyActivity, getTopLevelAnalysis, getWeeklyActivity } from "../../../api/analysis.api";

const AnalysisMainComponent = ({
  monthDashID,
  streakData,
}: {
  monthDashID: string;
  streakData: StreakI;
}) => {
  const [heatMapData, setHeatMapData] = useState<HeatMapI[]>([]);

  const dateLogsData = useQuery({
    queryKey: ["date_logs", monthDashID],
    queryFn: () => getDateLogs(monthDashID),
    enabled: !!monthDashID,
  });
  const dateLogs: DateLogI[] = dateLogsData?.data?.dateLogs;

  const taskListData = useQuery({
    queryKey: ["tasks", monthDashID],
    queryFn: () => getTasks(monthDashID),
    enabled: !!monthDashID,
  });
  const taskList: TaskI[] = taskListData?.data?.tasks;

  const weeklyActivityData = useQuery({
    queryKey: ["weekly_activity", monthDashID],
    queryFn: () => getWeeklyActivity(monthDashID!),
    enabled: !!monthDashID,
  });
  const weeklyAna: WeekAnalysisI = weeklyActivityData.data?.data ?? [];

  const monthlyActivityData = useQuery({
    queryKey: ["monthly_activity", monthDashID],
    queryFn: () => getMonthlyActivity(monthDashID!),
    enabled: !!monthDashID,
  });
  const monthlyAna: MonthAnalysisI = monthlyActivityData.data?.data ?? [];

  const topLevelAnalysisData = useQuery({
    queryKey: ["top_level_analysis", monthDashID],
    queryFn: () => getTopLevelAnalysis(monthDashID!),
    enabled: !!monthDashID,
  });
  const topLevelData: TopLevelAnalysisI = topLevelAnalysisData.data?.data;




























  // Local state fetching for robust data display
  const [localDateLogs, setLocalDateLogs] = useState<DateLogI[]>([]);
  const [localTaskList, setLocalTaskList] = useState<TaskI[]>([]);

  useEffect(() => {
    const logs = localDateLogs.length > 0 ? localDateLogs : dateLogs;
    const arr = logs.map((d) => ({
      date: d?.fullDate,
      count: d?.tasks?.length,
    }));
    setHeatMapData(arr);
  }, [dateLogs, localDateLogs]);

  // Derived stats
  const totalTasksDone = weeklyAna.taskDone?.reduce((s: any, n: any) => s + n, 0) ?? 0;

  const currentTaskList = localTaskList.length > 0 ? localTaskList : taskList;
  const numHabits = currentTaskList?.length ?? 0;
  const logsToUse = localDateLogs.length > 0 ? localDateLogs : dateLogs;


  // 3. Avg / Day
  const weeklyPossible = numHabits * (weeklyAna.taskDone?.length || 7);
  const monthlyTasksDone = monthlyAna.tasks?.reduce((s: any, n: any) => s + n, 0) ?? 0;
  const monthlyPossible =
    numHabits * (monthlyAna.tasks?.length || logsToUse.length || 31);
  const monthlyTargetData = { done: 4, left: 3 };
  const weeklyTargetData = [
    { week: "Week 1", done: 5, left: 2 },
    { week: "Week 2", done: 3, left: 4 },
    { week: "Week 3", done: 6, left: 1 },
    { week: "Week 4", done: 4, left: 3 },
    { week: "Week 5", done: 2, left: 5 },
  ];

  const statCards = [
    {
      label: "Consistency Rate",
      value: `${topLevelData?.consistencyRate}%`,
      icon: <FiPercent size={18} />,
      bgIcon: (
        <FiPercent
          size={70}
          className="text-blue-400 opacity-[0.08] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
        />
      ),
      color: "from-blue-500/10 via-indigo-500/10 to-indigo-500/20",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      glow: "bg-blue-500/10",
    },
    {
      label: "Perfect Days",
      value: `${topLevelData?.perfectDays} / ${topLevelData?.totalDaysInMonth}`,
      icon: <FiCalendar size={18} />,
      bgIcon: (
        <FiCalendar
          size={70}
          className="text-emerald-400 opacity-[0.08] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
        />
      ),
      color: "from-emerald-500/10 via-teal-500/10 to-teal-500/20",
      border: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      glow: "bg-emerald-500/10",
    },
    {
      label: "Avg / Day",
      value: `${topLevelData?.avgPerDay} / ${topLevelData?.timeElapsed}`,
      icon: <FiClock size={18} />,
      bgIcon: (
        <FiClock
          size={70}
          className="text-violet-400 opacity-[0.08] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
        />
      ),
      color: "from-violet-500/10 via-purple-500/10 to-purple-500/20",
      border: "border-violet-500/30",
      iconColor: "text-violet-400",
      glow: "bg-violet-500/10",
    },
    {
      label: "Streak",
      value: topLevelData?.streak,
      icon: <FiZap size={18} />,
      bgIcon: (
        <FiZap
          size={70}
          className="text-amber-400 opacity-[0.08] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
        />
      ),
      color: "from-amber-500/10 via-orange-500/10 to-orange-500/20",
      border: "border-amber-500/30",
      iconColor: "text-amber-400",
      glow: "bg-amber-500/10",
    },
    {
      label: "Perfect Streak",
      value: topLevelData?.perfectDays,
      icon: <FiAward size={18} />,
      bgIcon: (
        <FiAward
          size={70}
          className="text-rose-400 opacity-[0.08] absolute -right-2 -bottom-2 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
        />
      ),
      color: "from-rose-500/10 via-pink-500/10 to-rose-500/20",
      border: "border-rose-500/30",
      iconColor: "text-rose-400",
      glow: "bg-rose-500/10",
    },
  ];

  const insightCards = [
    {
      title: "Most Consistent",
      words:
        streakData?.mostConsistentHabits?.length > 0
          ? streakData.mostConsistentHabits
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
        streakData?.mostConsistentHabits?.length > 0 ? (
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
        streakData?.leastConsistentHabits?.length > 0
          ? streakData.leastConsistentHabits
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
        streakData?.leastConsistentHabits?.length > 0 ? (
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

  return (
    <div className="flex flex-col gap-4 w-full text-white mt-4">
      {/* ── Header Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
      >
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <FiActivity size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent truncate">
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
              {/* {formatDateString(weeklyAna?.date) || "Today"} */}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats ── 2 cols on mobile, 4 on desktop ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-linear-to-br ${card.color} p-3.5 sm:p-4 group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div
              className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${card.glow} rounded-full blur-2xl transition-opacity duration-500`}
            />
            {card.bgIcon}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weekly Activity Chart */}
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <FiBarChart2 size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Weekly Activity
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {weeklyAna?.week || "This Week"}
                  </p>
                </div>
              </div>

              {/* Badge/Details */}
              <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shrink-0">
                Tasks: {totalTasksDone} / {weeklyPossible}
              </span>
            </div>

            {/* Body wrapper */}
            <div className="relative p-4 flex flex-col gap-3">
              <div className="flex items-center justify-center overflow-x-auto w-full">
                <WeeklyBarChart
                  data={weeklyAna}
                  maxValue={currentTaskList?.length || 1}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Habit Insights */}
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <FiZap size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Habit Insights</p>
                  <p className="text-[10px] text-gray-500">
                    Consistency &amp; patterns
                  </p>
                </div>
              </div>
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
      </div>

      {/* ── Monthly Line Chart ── */}
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <FiTrendingUp size={15} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Monthly Activity</p>
                <p className="text-[10px] text-gray-500">This Month</p>
              </div>
            </div>

            {/* Badge/Details */}
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shrink-0">
              Tasks: {monthlyTasksDone} / {monthlyPossible}
            </span>
          </div>

          {/* Body wrapper */}
          <div className="relative p-4 flex flex-col gap-3">
            <div className="flex items-center justify-center overflow-x-auto w-full pe-2 sm:pe-7">
              <MonthlyLineChart
                data={monthlyAna}
                maxValue={currentTaskList?.length || 1}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        {/* Monthly Targets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
        >
          <div className="absolute bottom-0 right-0 w-44 h-28 sm:w-56 sm:h-36 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-36 h-36 sm:w-44 sm:h-44 bg-indigo-500/5 rounded-full blur-3xl" />

          <div>
            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <FiAward size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Monthly Targets
                  </p>
                  <p className="text-[10px] text-gray-500">This Month</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-lg font-medium shrink-0">
                  Done: {monthlyTargetData.done}
                </span>
                <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 sm:px-2.5 py-1 rounded-lg font-medium">
                  Left: {monthlyTargetData.left}
                </span>
              </div>
            </div>

            <div className="relative p-4 flex items-center justify-center">
              <div className="w-full max-w-xs mx-auto">
                <FilledPieChart
                  done={monthlyTargetData.done}
                  left={monthlyTargetData.left}
                  height={260}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Targets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
        >
          <div className="absolute bottom-0 left-0 w-48 h-28 sm:w-64 sm:h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-indigo-500/5 rounded-full blur-3xl" />

          <div>
            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <FiCalendar size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Weekly Targets</p>
                  <p className="text-[10px] text-gray-500">
                    Five week breakdown
                  </p>
                </div>
              </div>
            </div>

            <div className="relative p-4 grid grid-cols-2 min-[520px]:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {weeklyTargetData.map((target) => (
                <div
                  key={target.week}
                  className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/8 p-2.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                      {target.week}
                    </p>
                  </div>
                  <FilledPieChart
                    done={target.done}
                    left={target.left}
                    height={112}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
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
