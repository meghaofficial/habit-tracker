import { motion, AnimatePresence } from "framer-motion";
import type { PlanI } from "../../../types";
import { formattedText, notify } from "../../../helper";
import { CustomButtonForm } from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";

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
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

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
  );
};

export default PlansGrid;
