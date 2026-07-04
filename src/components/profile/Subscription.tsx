import { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import { formatMonthYearSimple } from "../../helper";
import { CustomButtonForm } from "../shared/CutomButton";
import type { PlanI } from "../../types";
import { formattedText } from "../../helper";
import { notify } from "../../helper";
import CircleLoader from "../loaders/CircleLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiChevronDown, FiChevronUp, FiClock, FiZap } from "react-icons/fi";

interface SubsList {
  _id: string;
  planType: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

/** Skeleton row used while loading sub-lists */
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

const SubscriptionPage = () => {
  const [activeSubsLoading, setActiveSubsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [plansList, setPlansList] = useState<PlanI[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const [getPlanLoading, setGetPlanLoading] = useState(false);
  const [freeTrialLoading, setFreeTrialLoading] = useState("");
  const [allSubsLoading, setAllSubsLoading] = useState(false);

  const [scheduledList, setScheduledList] = useState<SubsList[]>([]);
  const [expiredList, setExpiredList] = useState<SubsList[]>([]);

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
      if ((error as { response?: { status?: number } }).response?.status === 500) {
        // setFallback(true);
      }
    } finally {
      setActiveSubsLoading(false);
    }
  };

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

  const handleSubscribe = async (planID: string, amount: number) => {
    setFreeTrialLoading(planID);
    try {
      const res = await axiosPrivate.post("/api/subscribe", { planID, amount });
      if (res?.data?.success) {
        notify.success(res?.data?.message);
        setShowPlans(false);
      }
    } catch (error) {
      notify.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Something went wrong"
      );
    } finally {
      setFreeTrialLoading("");
    }
  };

  const getAllSubs = async () => {
    setAllSubsLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/all-subscriptions`);
      if (res?.data?.success) {
        const list = res?.data?.subscriptions || [];
        const sch = list?.filter((d: SubsList) => d?.status === "scheduled");
        const exp = list?.filter((d: SubsList) => d?.status === "expired");
        setScheduledList(sch);
        setExpiredList(exp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAllSubsLoading(false);
    }
  };

  useEffect(() => {
    getActiveSubscription();
    getAllSubs();
  }, []);

  return (
    <div className="space-y-5">
      {/* Active Plan Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        {/* Decorative glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

        <div className="flex sm:flex-row flex-col sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
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

      {/* Plans Grid — animated expand/collapse */}
      <AnimatePresence>
        {showPlans && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {getPlanLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-56 rounded-2xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10"
                  />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-2xl p-4">
                {plansList?.map((plan, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 light:border-black/10 bg-black/40 light:bg-white px-5 py-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)]"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

                    <div className="relative z-10">
                      <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-2">
                        Plan
                      </p>
                      <h3 className="font-bold text-white light:text-black">
                        {formattedText(plan?.planName)}
                      </h3>
                      <div className="mt-3 flex items-end gap-1">
                        <span className="text-2xl font-black text-white light:text-black">
                          ₹{plan?.amount}
                        </span>
                        <span className="text-slate-500 text-[11px] mb-1 ms-1">
                          one-time
                        </span>
                      </div>
                      <p className="mt-4 text-[12px] leading-6 text-slate-400 line-clamp-3">
                        {plan?.description}
                      </p>
                      <div className="my-4 h-px bg-white/10 light:bg-black/10" />
                      <CustomButtonForm
                        type="success"
                        styling="w-full"
                        onClick={() => {
                          if (freeTrialLoading === plan._id) return;
                          handleSubscribe(plan?._id, plan?.amount);
                        }}
                      >
                        {freeTrialLoading === plan._id ? (
                          <CircleLoader />
                        ) : (
                          "Activate Plan"
                        )}
                      </CustomButtonForm>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expired & Scheduled history — side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Expired Subscriptions */}
        <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-red-400 text-sm">
                Expired Subscriptions
              </h3>
              {!allSubsLoading && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {expiredList.length === 0
                    ? "No past subscriptions"
                    : `${expiredList.length} record${expiredList.length > 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          </div>

          <div className="divide-y divide-red-500/10">
            {allSubsLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : expiredList.length > 0 ? (
              expiredList.map((exp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-3.5 h-3.5 text-red-400" />
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
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

        {/* Scheduled Subscriptions */}
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <FiCalendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 text-sm">
                Scheduled Subscriptions
              </h3>
              {!allSubsLoading && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {scheduledList.length === 0
                    ? "Nothing queued"
                    : `${scheduledList.length} upcoming`}
                </p>
              )}
            </div>
          </div>

          <div className="divide-y divide-amber-500/10">
            {allSubsLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : scheduledList.length > 0 ? (
              scheduledList.map((sch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white light:text-black">
                        {formatMonthYearSimple(sch?.startDate)} →{" "}
                        {formatMonthYearSimple(sch?.endDate)}
                      </p>
                      <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                        {sch?.planType}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    Scheduled
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-28 gap-2 text-slate-500/50">
                <FiCalendar className="w-6 h-6" />
                <p className="text-xs">No scheduled subscriptions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
