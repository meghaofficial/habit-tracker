import { FiBarChart2, FiCheck, FiX } from "react-icons/fi";
import RadialProgress from "../../charts/RadialProgress";
import Card from "../../shared/Card";
import type { DashboardI, TargetI } from "../../../types";
import { monMap } from "../../../staticData";
import { motion } from "framer-motion";
import { axiosPrivate } from "../../../api/axios";
import { useEffect, useState } from "react";

const PerformanceSummary = ({
  selectedMonth,
  monthDashID,
}: {
  selectedMonth: DashboardI;
  monthDashID: string;
}) => {
  const [completed, setCompleted] = useState<number>(0);
  const [missed, setMissed] = useState<number>(0);
  const [progress, setProgress] = useState<string>("0");
  const [monthName, setMonthName] = useState<string>("");

  useEffect(() => {
    if (selectedMonth) {
      const totalPossibleTasks =
        selectedMonth.totalDays * selectedMonth.totalTasks;
      const calculatedMissed = totalPossibleTasks - selectedMonth.totalCount;
      const currentMonthName = monMap[selectedMonth.month - 1] || "";

      setCompleted(selectedMonth.totalCount);
      setMissed(calculatedMissed);
      setProgress(selectedMonth.progress || "0");
      setMonthName(currentMonthName);
    }
  }, [selectedMonth, monthDashID]);

  return (
    <Card heading="" cardWidth="w-full">
      <div className="p-1 flex flex-col gap-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Performance Summary
        </h3>

        <RadialProgress progress={progress || "0"} monthName={monthName} />

        {/* Quick Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-center">
            <FiCheck className="text-emerald-400 mx-auto mb-1.5" size={16} />
            <span className="text-sm font-bold block">{completed}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">
              Done
            </span>
          </div>
          <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-center">
            <FiX className="text-rose-400 mx-auto mb-1.5" size={16} />
            <span className="text-sm font-bold block">{missed}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">
              Missed
            </span>
          </div>
        </div>

        {/* Week-wise Progress Bars */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiBarChart2 size={12} /> Week-wise Breakdown
          </h4>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <WeeklyTargets monthDashID={monthDashID} week={idx} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const WeeklyTargets = ({
  monthDashID,
  week,
}: {
  monthDashID: string;
  week: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [totalTargets, setTotalTargets] = useState(0);
  const [finished, setFinished] = useState(0);

  const getWeeklyData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/weekly-targets?monthDashID=${monthDashID}&week=${week + 1}`,
      );

      if (res?.data?.success) {
        if (res?.data?.target) {
          const targets = res?.data?.target?.targets;
          setTotalTargets(targets.length);
          const fin = targets.filter((d: TargetI) => d?.completed);
          setFinished(fin.length);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (monthDashID) {
      getWeeklyData();
    }
  }, [monthDashID, week]);

  const rate =
    totalTargets > 0 ? ((finished / totalTargets) * 100).toFixed(2) : 0;

  return (
    <div key={week} className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-gray-400 font-medium">Week {week + 1}</span>
        <span className="text-yellow-400 font-semibold">{rate}%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ duration: 0.8, delay: week * 0.1 }}
        />
      </div>
    </div>
  );
};

export default PerformanceSummary;
