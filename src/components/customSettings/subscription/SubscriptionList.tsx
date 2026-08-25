import { motion } from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";
import type { SubsList } from "../../../types";
import { formatMonthYearSimple } from "../../../helper";

const SubscriptionList = ({
  type,
  loading,
  list,
}: {
  type: string;
  loading: boolean;
  list: SubsList[];
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        type === "scheduled"
          ? "border-indigo-400/10 bg-indigo-500/2.5"
          : "border-white/6 bg-white/1.5"
      }`}
    >
      {/* Decorative Glow */}
      {type === "scheduled" && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-indigo-500/6 blur-3xl" />
      )}

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              type === "scheduled"
                ? "border-indigo-400/10 bg-indigo-500/8 text-indigo-400"
                : "border-white/6 bg-white/3 text-zinc-600"
            }`}
          >
            {type === "scheduled" ? (
              <FiCalendar className="h-4 w-4" />
            ) : (
              <FiClock className="h-4 w-4" />
            )}
          </div>

          <div>
            <h3
              className={`text-sm font-semibold ${
                type === "scheduled" ? "text-indigo-300" : "text-zinc-400"
              }`}
            >
              {type === "scheduled"
                ? "Scheduled Subscriptions"
                : "Expired Subscriptions"}
            </h3>

            {!loading && (
              <p className="mt-0.5 text-[10px] text-zinc-600">
                {list.length === 0
                  ? type === "scheduled"
                    ? "No upcoming subscriptions"
                    : "No past subscriptions"
                  : `${list.length} record${list.length > 1 ? "s" : ""}`}
              </p>
            )}
          </div>
        </div>

        {/* Count */}
        {!loading && list.length > 0 && (
          <span
            className={`rounded-lg border px-2 py-1 text-[10px] font-semibold ${
              type === "scheduled"
                ? "border-indigo-400/10 bg-indigo-500/6 text-indigo-400"
                : "border-white/6 bg-white/3 text-zinc-600"
            }`}
          >
            {list.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="relative z-10">
        {loading ? (
          <div className="divide-y divide-white/4 light:divide-black/5">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : list.length > 0 ? (
          <div className="divide-y divide-white/4 light:divide-black/5">
            {list.map((sub, index) => (
              <motion.div
                key={sub?._id || index}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                className="group flex items-center justify-between gap-3 px-1 py-3.5"
              >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      type === "scheduled"
                        ? "border-indigo-400/10 bg-indigo-500/6 text-indigo-400"
                        : "border-white/5 bg-white/2.5 text-zinc-600"
                    }`}
                  >
                    <FiCalendar className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-zinc-300 light:text-black">
                      {formatMonthYearSimple(sub?.startDate)}

                      <span className="mx-1.5 text-zinc-700">→</span>

                      {formatMonthYearSimple(sub?.endDate)}
                    </p>

                    <p className="mt-0.5 text-[10px] capitalize text-zinc-600">
                      {sub?.planType}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                    type === "scheduled"
                      ? "border-indigo-400/10 bg-indigo-500/5 text-indigo-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {type === "scheduled" ? "Scheduled" : "Expired"}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/5 light:border-black/6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/2.5">
              {type === "scheduled" ? (
                <FiCalendar className="h-4 w-4 text-zinc-700" />
              ) : (
                <FiClock className="h-4 w-4 text-zinc-700" />
              )}
            </div>

            <p className="text-[11px] text-zinc-700">
              {type === "scheduled"
                ? "No scheduled subscriptions"
                : "No expired subscriptions"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center justify-between py-3 px-1 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-white/10 light:bg-black/10" />
      <div className="space-y-1.5">
        <div className="h-3 w-32 rounded bg-white/10 light:bg-black/10" />
        <div className="h-2.5 w-20 rounded bg-white/10 light:bg-black/10" />
      </div>
    </div>
    <div className="h-5 w-16 rounded-full bg-white/10 light:bg-black/10" />
  </div>
);

export default SubscriptionList;
