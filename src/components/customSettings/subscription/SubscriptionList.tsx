import { FiCalendar, FiClock } from "react-icons/fi";
import type { SubsList } from "../../../types";
import { formatMonthYearSimple } from "../../../helper";

const SubscriptionList = ({ type, loading, list }: { type: string; loading: boolean; list: SubsList[] }) => {
  return (
    <div
      className={`rounded-2xl border ${type === "expired" ? "border-red-500/15 bg-red-500/5" : "border-amber-500/15 bg-amber-500/5"} p-5`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg ${type === "expired" ? "bg-red-500/15 border border-red-500/20 text-red-400" : "bg-amber-500/15 border border-amber-500/20 text-amber-400"} flex items-center justify-center shrink-0`}>
          {type === "expired" ? (
            <FiClock className="w-4 h-4" />
          ) : (
            <FiCalendar className="w-4 h-4" />
          )}
        </div>
        <div>
          <h3 className={`font-semibold ${type === "expired" ? "text-red-400" : "text-amber-400"} text-sm`}>
            {type === "expired" ? "Expired" : "Scheduled"} Subscriptions
          </h3>
          {!loading && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              {list.length === 0
                ? "No past subscriptions"
                : `${list.length} record${list.length > 1 ? "s" : ""}`}
            </p>
          )}
        </div>
      </div>

      <div className="divide-y divide-red-500/10">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : list.length > 0 ? (
          list.map((exp, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-1"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full border ${type === "expired" ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"} flex items-center justify-center shrink-0`}>
                  <FiCalendar className={`w-3.5 h-3.5 ${type === "expired" ? "text-red-400" : "text-amber-400"}`} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white light:text-black">
                    {formatMonthYearSimple(exp?.startDate)} →{" "}
                    {formatMonthYearSimple(exp?.endDate)}
                  </p>
                  <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                    {exp?.planType}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${type === "expired" ? "bg-red-500/15 text-red-400 border-red-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20"} `}>
                Expired
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-28 gap-2 text-slate-500/50">
            <FiClock className="w-6 h-6" />
            <p className="text-xs">No expired subscriptions</p>
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
