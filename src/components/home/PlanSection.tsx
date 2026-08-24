import { FaCheck, FaCrown } from "react-icons/fa";
import { FiArrowRight, FiLock } from "react-icons/fi";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import type { PlanI } from "../../types";
import { formattedText } from "../../helper";
import { useNavigate } from "react-router-dom";

const freeFeatures = [
  "Daily task & habit tracking",
  "Goals and monthly targets",
  "Progress & streak tracking",
  "Performance insights",
  "History & monthly reflection",
  // "AI Coach",
];

const paidFeatures = [
  "Everything from your free month",
  "Advanced performance analytics",
  "Detailed monthly insights",
  // "AI-powered recommendations",
  "Personalized productivity insights",
];

const PlanSection = () => {
  const [plans, setPlans] = useState<PlanI[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getPlans = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-plans?type=paid`);
      if (res?.data?.success) {
        setPlans(res?.data?.plans || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <section className="relative mt-40 mb-32 overflow-hidden px-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-100 w-175 -translate-x-1/2 rounded-full bg-indigo-500/6 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Pricing
          </p>

          <h2 className="mt-4 text-[40px] font-black tracking-[-0.05em] text-white light:text-lightText sm:text-[48px]">
            Start free. Build consistency.
          </h2>

          <p className="mx-auto mt-5 max-w-145 text-[15px] leading-7 text-darkSubText light:text-lightSubText">
            Get full access to your current month at no cost. Track your goals,
            understand your progress, and discover what works for you.
          </p>
        </div>

        {/* Free Month */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* subtle outer glow */}
          <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-indigo-500/[0.035] blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#09090b]">
            {/* top gradient */}
            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-indigo-500/8 to-transparent" />

            <div className="relative grid lg:grid-cols-[1fr_1.15fr]">
              {/* =================================================
                  LEFT
              ================================================= */}

              <div className="border-b border-white/[0.07] p-7 sm:p-9 lg:border-b-0 lg:border-r lg:p-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      ✦
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                      Start Free
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-gray-600">
                    CURRENT MONTH
                  </span>
                </div>

                <h3 className="mt-8 text-[30px] font-bold tracking-[-0.04em] text-white light:text-lightText sm:text-[34px]">
                  Your month is on us.
                </h3>

                <p className="mt-4 max-w-md text-[14px] leading-7 text-gray-500">
                  Experience the complete platform before deciding what comes
                  next. No payment is required to get started.
                </p>

                {/* Price */}
                <div className="mt-8 flex items-end gap-2">
                  <span className="text-[56px] font-black leading-none tracking-[-0.07em] text-white light:text-lightText">
                    ₹0
                  </span>

                  <span className="mb-2 text-[13px] text-gray-500">
                    for your current month
                  </span>
                </div>

                {/* CTA */}
                <button
                  className=" group relative mt-8 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-500 text-[13px] text-white transition-colors hover:bg-indigo-400 sm:w-65 "
                  onClick={() => navigate("/login")}
                >
                  <span>Get Started Free</span>
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <p className="mt-4 flex items-center gap-2 text-[10px] text-gray-600">
                  <FaCheck className="text-[8px] text-emerald-400" />
                  No payment required
                </p>
              </div>

              {/* Right Included */}
              <div className="p-7 sm:p-9 lg:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Included during your free month
                </p>
                <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {freeFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <FaCheck className="text-[8px]" />
                      </div>
                      <span className="text-[13px] leading-5 text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom message */}
                <div className="mt-9 border-t border-white/[0.07] pt-6">
                  <p className="text-[12px] font-medium text-gray-400">
                    Explore everything first.
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-600">
                    When your free month ends, choose the plan that best fits
                    the way you want to continue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* After Free Month */}
        <div className="mt-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-white/8" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                After your free month
              </p>
              <div className="h-px w-10 bg-white/8" />
            </div>

            <h3 className="mt-4 text-[25px] font-bold tracking-[-0.035em] text-white light:text-lightText">
              Choose how you want to continue.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-[13px] leading-6 text-gray-500">
              Unlock additional capabilities when you're ready to take your
              tracking and personal growth further.
            </p>
          </div>

          {/* Paid plans */}
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-3xl animate-pulse bg-white/5 h-100 w-full"></div>
              ))
            ) : (
              <>
                {plans.map((plan, index) => {
                  const isPopular = index === 0;
                  return (
                    <div
                      key={plan._id}
                      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 ${isPopular ? "border-indigo-400/20 bg-indigo-500/[0.035]" : "border-white/8 bg-white/2"} `}
                    >
                      {isPopular && (
                        <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-indigo-400/15 bg-indigo-500/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                          <FaCrown className="text-[7px]" />
                          Recommended
                        </div>
                      )}
                      <div className="pr-20">
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isPopular ? "text-indigo-300" : "text-gray-500"} `}
                        >
                          {formattedText(plan.planName)}
                        </p>
                        <div className="mt-4 flex items-end gap-1">
                          <span className="text-[36px] font-black leading-none tracking-[-0.06em] text-white light:text-lightText">
                            {plan.amount / plan.no_of_months}
                          </span>
                          <span className="mb-1 text-[11px] text-gray-500">
                            / month
                          </span>
                        </div>
                        <p className="mt-4 text-[12px] leading-6 text-gray-500">
                          {plan.description}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="my-6 h-px bg-white/[0.07]" />

                      {/* Features */}
                      <div className="space-y-3">
                        {paidFeatures.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <div
                              className={` mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isPopular ? "bg-indigo-500/10 text-indigo-400" : "bg-white/6 text-gray-500"} `}
                            >
                              <FaCheck className="text-[7px]" />
                            </div>
                            <span className="text-[12px] leading-5 text-gray-500">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Locked state */}
                      <div className="mt-7 flex items-center gap-2 border-t border-white/[0.07] pt-5">
                        <FiLock className="text-[11px] text-gray-600" />
                        <span className="text-[10px] text-gray-600">
                          Available after your free month
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Bottom Trust */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2 text-[10px] text-gray-600">
            <FaCheck className="text-[8px] text-emerald-400" />
            Start with ₹0
          </span>
          <span className="flex items-center gap-2 text-[10px] text-gray-600">
            <FaCheck className="text-[8px] text-emerald-400" />
            Explore before subscribing
          </span>
          <span className="flex items-center gap-2 text-[10px] text-gray-600">
            <FaCheck className="text-[8px] text-emerald-400" />
            Upgrade when you're ready
          </span>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
