import { motion, AnimatePresence } from "framer-motion";
import type { PlanI } from "../../../types";
import { formattedText, notify } from "../../../helper";
import { CustomButtonForm } from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { FiArrowRight, FiLayers, FiZap } from "react-icons/fi";

const PlansGrid = ({
  showPlans,
  getPlanLoading,
  plansList,
  setShowPlans,
}: {
  showPlans: boolean;
  getPlanLoading: boolean;
  plansList: PlanI[];
  setShowPlans: Dispatch<SetStateAction<boolean>>;
}) => {
  const [freeTrialLoading, setFreeTrialLoading] = useState("");

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
          ?.message || "Something went wrong",
      );
    } finally {
      setFreeTrialLoading("");
    }
  };

  return (
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
        /* =================================================
           LOADING
        ================================================== */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-white/6 bg-white/2.5 light:border-black/6 light:bg-black/2.5"
            />
          ))}
        </div>
      ) : (
        /* =================================================
           PLANS
        ================================================== */
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
                      if (
                        freeTrialLoading === plan._id
                      ) {
                        return;
                      }

                      handleSubscribe(
                        plan?._id,
                        plan?.amount
                      );
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
        </div>
      )}
    </motion.div>
  )}
</AnimatePresence>
  );
};

export default PlansGrid;
