import { motion, AnimatePresence } from "framer-motion";
import type { PlanI } from "../../../types";
import { formattedText, notify } from "../../../helper";
import { CustomButtonForm } from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { FiArrowRight, FiGift, FiLayers, FiZap } from "react-icons/fi";

const PlansGrid = ({
  showPlans,
  getPlanLoading,
  plansList,
  setShowPlans,
  showFree,
}: {
  showPlans: boolean;
  getPlanLoading: boolean;
  plansList: PlanI[];
  setShowPlans: Dispatch<SetStateAction<boolean>>;
  showFree: boolean;
}) => {
  const [freeTrialLoading, setFreeTrialLoading] = useState("");
  const [freePlanID, setFreePlanID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planID: string, amount: number) => {
    let res;
    if (!amount) {
      res = confirm("Are you sure you want to unlock the free trial ?");
    }
    if (!res) return;
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
          ?.message || "Something went wrong",
      );
    } finally {
      setFreeTrialLoading("");
    }
  };

  useEffect(() => {
    const getPlans = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/api/get-plans?type=free`);
        if (res?.data?.success) {
          setFreePlanID(res?.data?.plans[0]?._id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (showPlans) {
      getPlans();
    }
  }, [showPlans]);

  return (
    <>
      <AnimatePresence>
        {showPlans && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -5,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="overflow-hidden"
          >
            {getPlanLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-white/6 bg-white/2.5 light:border-black/6 light:bg-black/2.5"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/6 bg-white/1.5 p-3 light:border-black/6 light:bg-black/1.5 sm:p-4">
                <div className="mb-4 flex items-center justify-between px-1">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                      Available Plans
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      Choose a plan to extend your membership.
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/[0.07] text-indigo-400">
                    <FiLayers className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  {showFree ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => {
                        if (loading) return;

                        handleSubscribe(freePlanID, 0);
                      }}
                      className={`group relative overflow-hidden rounded-2xl border border-indigo-400/20 bg-indigo-500/6 p-5 transition-all duration-300 ${
                        loading
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer hover:-translate-y-1 hover:border-indigo-400/35 hover:bg-indigo-500/9 hover:shadow-[0_20px_50px_rgba(99,102,241,0.10)]"
                      } light:border-indigo-500/15 light:bg-indigo-50`}
                    >
                      {/* Glow */}
                      <div
                        className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 ${
                          !loading && "group-hover:bg-indigo-500/20"
                        }`}
                      />

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                            Welcome offer
                          </p>

                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <FiGift className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-3 text-sm font-semibold text-zinc-100 light:text-black">
                          Your first month is on us
                        </h3>

                        {/* Price */}
                        <div className="mt-3 flex items-end gap-2">
                          <span className="text-2xl font-bold tracking-tight text-white light:text-black">
                            ₹0
                          </span>

                          <span className="mb-1 text-[10px] text-zinc-500">
                            current month
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-3 min-h-13.5 text-[11px] leading-5 text-zinc-500">
                          Looks like you just joined Habitify. You can use
                          Habitify freely for the rest of the current month and
                          start building habits without any commitment.
                        </p>

                        {/* Divider */}
                        <div className="my-4 h-px bg-white/6 light:bg-black/6" />

                        {/* CTA */}
                        <div
                          className={`flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500/10 py-2 text-[11px] font-semibold text-indigo-300 light:text-indigo-600 ${
                            !loading &&
                            "transition-all duration-300 group-hover:bg-indigo-500/15"
                          }`}
                        >
                          {loading ? (
                            <CircleLoader />
                          ) : (
                            <>
                              Activate free month
                              <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {plansList?.map((plan, index) => (
                        <motion.div
                          key={plan?._id || index}
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.05,
                          }}
                          className="group relative overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-indigo-500/2.5 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] light:border-black/[0.07] light:bg-white"
                        >
                          {/* Soft hover glow */}
                          <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-indigo-500/0 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/12" />

                          <div className="relative z-10">
                            {/* Plan label */}
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                                Plan
                              </p>

                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/[0.07] text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500/10">
                                <FiZap className="h-3 w-3" />
                              </div>
                            </div>

                            {/* Name */}
                            <h3 className="mt-3 text-sm font-semibold text-zinc-200 light:text-black">
                              {formattedText(plan?.planName)}
                            </h3>

                            {/* Price */}
                            <div className="mt-3 flex items-end gap-1">
                              <span className="text-2xl font-bold tracking-tight text-white light:text-black">
                                ₹{plan?.amount}
                              </span>

                              <span className="mb-1 text-[10px] text-zinc-600">
                                one-time
                              </span>
                            </div>

                            {/* Description */}
                            <p className="mt-3 line-clamp-3 min-h-13.5 text-[11px] leading-5 text-zinc-600">
                              {plan?.description}
                            </p>

                            {/* Divider */}
                            <div className="my-4 h-px bg-white/6 light:bg-black/6" />

                            {/* CTA */}
                            <CustomButtonForm
                              type="success"
                              styling="w-full"
                              onClick={() => {
                                if (freeTrialLoading === plan._id) {
                                  return;
                                }

                                handleSubscribe(plan?._id, plan?.amount);
                              }}
                            >
                              {freeTrialLoading === plan._id ? (
                                <CircleLoader />
                              ) : (
                                <span className="flex items-center justify-center gap-2">
                                  Activate Plan
                                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </span>
                              )}
                            </CustomButtonForm>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlansGrid;
