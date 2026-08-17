import { motion } from "framer-motion";
import { FiActivity, FiCalendar } from "react-icons/fi";
import { monMap } from "../../../staticData";

const InsightUpperHeader = () => {
  return (
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
              A detailed breakdown of performance and strategic outcomes.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <FiCalendar size={11} className="text-indigo-400" />
          <span className="text-[10px] sm:text-xs text-indigo-300 font-medium whitespace-nowrap">
            {monMap[new Date().getMonth() + 1]} {new Date().getDate()}{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightUpperHeader;
