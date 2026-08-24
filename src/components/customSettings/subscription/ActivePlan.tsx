import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      {/* Decorative glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

      <div className="flex sm:flex-row flex-col sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <FiZap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
              Active Plan
            </p>
            {activeSubsLoading ? (
              <div className="flex gap-2 items-center animate-pulse mt-1">
                <div className="h-4 w-24 rounded bg-emerald-500/20" />
                <div className="h-4 w-4 rounded bg-emerald-500/20" />
                <div className="h-4 w-24 rounded bg-emerald-500/20" />
              </div>
            ) : (
              <p className="text-sm font-medium text-white light:text-black flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-emerald-400" />
                {formatMonthYearSimple(startDate)}
                <span className="text-slate-400 mx-0.5">→</span>
                {formatMonthYearSimple(endDate)}
              </p>
            )}
          </div>
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer border ${
            showPlans
              ? "bg-white/5 border-white/10 light:bg-black/5 light:border-black/10 text-slate-400 hover:text-white light:hover:text-black"
              : "bg-emerald-500 border-emerald-400/50 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/25"
          }`}
          onClick={() => {
            if (!showPlans) getPlans();
            setShowPlans((prev) => !prev);
          }}
        >
          {showPlans ? (
            <>
              <FiChevronUp className="w-3.5 h-3.5" /> Hide Plans
            </>
          ) : (
            <>
              <FiZap className="w-3.5 h-3.5" /> Extend Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActivePlan;
