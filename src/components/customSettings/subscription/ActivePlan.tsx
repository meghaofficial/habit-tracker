import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { FiCalendar, FiChevronUp, FiZap } from "react-icons/fi";
import { formatMonthYearSimple } from "../../../helper";
import { axiosPrivate } from "../../../api/axios";
import type { PlanI } from "../../../types";

const ActivePlan = ({
  showPlans,
  setGetPlanLoading,
  setPlansList,
  setShowPlans,
}: {
  showPlans: boolean;
  setGetPlanLoading: Dispatch<SetStateAction<boolean>>;
  setPlansList: Dispatch<SetStateAction<PlanI[]>>;
  setShowPlans: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeSubsLoading, setActiveSubsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const getPlans = async () => {
    setGetPlanLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-plans?type=paid`);
      if (res?.data?.success) {
        setPlansList(res?.data?.plans || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetPlanLoading(false);
    }
  };

  const getActiveSubscription = async () => {
    setActiveSubsLoading(true);
    try {
      const res = await axiosPrivate.get("/api/active-subscription");
      if (res?.data?.success) {
        const subscription = res?.data?.subscription;
        setStartDate(subscription?.startDate);
        setEndDate(subscription?.endDate);
      }
    } catch (error) {
      if (
        (error as { response?: { status?: number } }).response?.status === 500
      ) {
        // setFallback(true);
      }
    } finally {
      setActiveSubsLoading(false);
    }
  };

  useEffect(() => {
    getActiveSubscription();
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.035] p-5 transition-all duration-300 hover:border-indigo-400/15">
      {/* Soft Decorative Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/8 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-indigo-500/4 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        {/* Plan Information */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-400">
            <FiZap className="h-5 w-5" />

            {/* Active dot */}
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400 light:border-white" />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                Active Plan
              </p>

              <span className="flex items-center gap-1 rounded-md border border-emerald-400/10 bg-emerald-400/5 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>

            {activeSubsLoading ? (
              <div className="mt-2 flex animate-pulse items-center gap-2">
                <div className="h-4 w-20 rounded-lg bg-indigo-500/10" />
                <div className="h-4 w-4 rounded bg-indigo-500/10" />
                <div className="h-4 w-20 rounded-lg bg-indigo-500/10" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200 light:text-black">
                <FiCalendar className="h-3.5 w-3.5 text-indigo-400" />

                <span>{formatMonthYearSimple(startDate)}</span>

                <span className="text-zinc-700">→</span>

                <span>{formatMonthYearSimple(endDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
        EXTEND BUTTON
    ================================================== */}
        <button
          type="button"
          onClick={() => {
            if (!showPlans) {
              getPlans();
            }

            setShowPlans((prev) => !prev);
          }}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
            showPlans
              ? "border-white/8 bg-white/[0.035] text-zinc-500 hover:bg-white/6 hover:text-zinc-300 light:border-black/10 light:bg-black/3 light:text-slate-600"
              : "border-indigo-400/20 bg-indigo-500/10 text-indigo-300 hover:border-indigo-400/30 hover:bg-indigo-500/15"
          }`}
        >
          {showPlans ? (
            <>
              <FiChevronUp className="h-3.5 w-3.5" />
              Hide Plans
            </>
          ) : (
            <>
              <FiZap className="h-3.5 w-3.5" />
              Extend Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActivePlan;
