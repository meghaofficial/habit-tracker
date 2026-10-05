import { type Dispatch, type SetStateAction } from "react";
import { FiArchive, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import type { DashboardI } from "../../../types";
import { monMap } from "../../../staticData";

interface PastMonthsDataProps {
  selectedMonthId: string;
  setSelectedMonthId: Dispatch<SetStateAction<string>>;
  data: DashboardI[];
}

const PastMonthsData = ({
  selectedMonthId,
  setSelectedMonthId,
  data,
}: PastMonthsDataProps) => {
  const sortedMonths = [...data].sort(
    (a, b) => b.year - a.year || b.month - a.month,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20"
    >
      {/* Simple heading */}
      <div className="flex items-center justify-between gap-3 border-b border-white/6 px-4 py-4">
        <div className="flex items-center gap-2">
          <FiArchive size={13} className="text-indigo-400" />

          <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            History Archive
          </h3>
        </div>

        <span className="text-[10px] tabular-nums text-gray-500">
          {data.length} {data.length === 1 ? "month" : "months"}
        </span>
      </div>

      {/* Month list */}
      <div className="h-86 overflow-y-auto px-3 py-3">
        {sortedMonths.length > 0 ? (
          sortedMonths.map((month, index) => {
            const isActive = month._id === selectedMonthId;
            const showYear =
              index === 0 || sortedMonths[index - 1].year !== month.year;

            return (
              <div key={month._id}>
                {showYear && (
                  <div
                    className={`flex items-center gap-3 px-1 pb-2 ${
                      index > 0 ? "pt-4" : "pt-1"
                    }`}
                  >
                    <span className="text-[9px] font-semibold tracking-wider text-gray-500">
                      {month.year}
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMonthId(month._id)}
                  aria-pressed={isActive}
                  className={`mb-1.5 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                    isActive
                      ? "border-indigo-400/25 bg-indigo-500/10"
                      : "border-transparent hover:border-white/5 hover:bg-white/3"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold ${
                        isActive ? "text-indigo-100" : "text-gray-300"
                      }`}
                    >
                      {monMap[month.month + 1]}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      {month.totalTasks} habits tracked
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[11px] font-semibold tabular-nums ${
                      isActive ? "text-indigo-300" : "text-gray-500"
                    }`}
                  >
                    {month.progress || "0"}%
                  </span>

                  <FiChevronRight
                    size={13}
                    className={`shrink-0 ${
                      isActive ? "text-indigo-400" : "text-gray-600"
                    }`}
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex h-40 flex-col items-center justify-center px-4 text-center">
            <FiArchive size={20} className="mb-3 text-gray-600" />
            <p className="text-xs text-gray-400">No history yet</p>
            <p className="mt-1 text-[10px] text-gray-500">
              Your completed months will appear here.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PastMonthsData;
