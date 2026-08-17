import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiClock, FiPercent, FiZap } from "react-icons/fi";
import type { TopLevelAnalysisI } from "../../../types";

const TopLevelMatrics = ({
  topLevelData,
  loading,
}: {
  topLevelData: TopLevelAnalysisI;
  loading: boolean;
}) => {

  const statCards = statsCardInfo(topLevelData);

  return (
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
            {loading ? (
              <div className="bg-black/20 rounded-full animate-pulse h-8 w-1/2 mt-1"></div>
            ) : (
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {card.value}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function statsCardInfo(topLevelData: TopLevelAnalysisI) {
  return [
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
}

export default TopLevelMatrics;
