import { motion } from "framer-motion";
import { FiCalendar, FiCheckCircle } from "react-icons/fi";

interface MobileDashboardDetailsProps {
  username: string;
  email: string;
  currentDay: number;
  currentMonth: string;
  planLabel: string;
  startDate: string;
  endDate: string;
  todayCompleted: number;
  todayTotal: number;
  monthCompleted: number;
  monthTotal: number;
}

const MobileDashboardDetails = ({
  username,
  email,
  currentDay,
  currentMonth,
  planLabel,
  startDate,
  endDate,
  todayCompleted,
  todayTotal,
  monthCompleted,
  monthTotal,
}: MobileDashboardDetailsProps) => {
  const todayProgress = todayTotal
    ? Math.round((todayCompleted / todayTotal) * 100)
    : 0;

  const monthProgress = monthTotal
    ? Math.round((monthCompleted / monthTotal) * 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-2xl light:border-lightBorder light:bg-lightCard">
      {/* Top User / Date Section */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 light:border-black/10">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 light:border-black/10 light:bg-black/5">
            <span className="playfair-display text-sm font-semibold uppercase">
              {username.slice(0, 1)}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xs font-bold playfair-display">
              {username}
            </h2>

            <p className="truncate text-[9px] text-gray-500">{email}</p>
          </div>
        </div>

        {/* Current Date */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <div className="flex items-end justify-end gap-1">
              <span className="playfair-display text-3xl font-bold leading-none">
                {currentDay}
              </span>

              <span className="text-[12px] text-gray-400">{currentMonth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Dates */}
      {/* <div className="px-3 pt-3">
        <p className="text-[8px] uppercase tracking-[0.18em] text-gray-500">
          {planLabel}
        </p>
      </div> */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div>
          <p className="text-[8px] uppercase tracking-[0.18em] text-gray-500">
            Start
          </p>
          <p className="mt-0.5 text-[9px] text-gray-300">{startDate}</p>
        </div>

        <div className="h-px flex-1 mx-4 bg-white/10" />

        <div className="text-right">
          <p className="text-[8px] uppercase tracking-[0.18em] text-gray-500">
            End
          </p>
          <p className="mt-0.5 text-[9px] text-gray-300">{endDate}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 border-t border-white/10 light:border-black/10">
        {/* Today */}
        <motion.div
          whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
          className="border-r border-white/10 px-4 py-3 light:border-black/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="h-3 w-3 text-indigo-400" />

              <p className="text-[9px] uppercase tracking-widest text-gray-500">
                Today
              </p>
            </div>

            <span className="text-[9px] text-gray-500">{todayProgress}%</span>
          </div>

          <div className="mt-1.5 flex items-end gap-1">
            <span className="playfair-display text-xl font-bold leading-none">
              {todayCompleted}
            </span>

            <span className="mb-0.5 text-[10px] text-gray-500">
              / {todayTotal}
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-indigo-500"
            />
          </div>
        </motion.div>

        {/* Month */}
        <motion.div
          whileHover={{ backgroundColor: "rgba(16,185,129,0.04)" }}
          className="px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="h-3 w-3 text-emerald-400" />

              <p className="text-[9px] uppercase tracking-widest text-gray-500">
                Month
              </p>
            </div>

            <span className="text-[9px] text-gray-500">{monthProgress}%</span>
          </div>

          <div className="mt-1.5 flex items-end gap-1">
            <span className="playfair-display text-xl font-bold leading-none">
              {monthCompleted}
            </span>

            <span className="mb-0.5 text-[10px] text-gray-500">
              / {monthTotal}
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${monthProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileDashboardDetails;
