import { plans } from "../../staticData";

const PlanSection = () => {
  return (
    <>
      <div className="text-center mt-40">
        <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">
          Pricing
        </p>

        <h2 className="mt-3 text-[42px] font-black tracking-[-0.05em] text-white light:text-lightText">
          Choose Your Plan
        </h2>

        <p className="mx-auto mt-4 max-w-155 text-[16px] leading-7 text-darkSubText light:text-lightSubText">
          Start free and upgrade as your habits, productivity, and goals grow
          stronger over time.
        </p>
      </div>
      <div className="mt-16 flex flex-col gap-6 lg:flex-row">
        {/* LEFT FEATURED FREE PLAN */}
        <div className=" relative overflow-hidden rounded-[36px] border border-[#6366F1]/30 bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] p-0.5 shadow-[0_40px_120px_rgba(99,102,241,0.35)] lg:w-[42%] ">
          {/* Glow */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-80" />

          <div className="relative h-full rounded-[34px] bg-[#0B1020] p-8">
            {/* Top */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-white/65">
                New User
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl">
                ✦
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-[44px] font-black tracking-[-0.05em] text-white">
                Free {"  "}
              </span>
              <span className="mb-4 text-[22px]">/ month</span>

              <p className="mt-2 max-w-105 text-[16px]/6 text-white/45">
                Perfect to start building habits, tracking streaks, and
                improving your consistency every day.
              </p>
            </div>

            {/* Features */}
            <div className="mt-5 space-y-5">
              {[
                "Unlimited habit tracking",
                "Daily streak analytics",
                "Weekly insights",
                "Cloud synchronization",
                "Goal milestones",
                "Smart reminder notifications",
                "Monthly performance reports",
                "Cross-device access",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172036]">
                    ✓
                  </div>

                  <span className="text-[16px] font-medium text-white/75">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className=" relative mt-12 flex h-15 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-[#6366F1] via-[#3B82F6] to-[#A855F7] text-[17px] font-bold text-white shadow-[0_20px_50px_rgba(99,102,241,0.35)] ">
              <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-white/25 opacity-70" />

              <span className="relative z-10">Get Started Free</span>
            </button>
          </div>
        </div>

        {/* RIGHT 2x2 GRID */}
        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {plans.slice(1).map((plan, i) => (
            <div
              key={i}
              className=" group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.18)] light:bg-lightCard "
            >
              {/* Glow */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#8B5CF6]/10 blur-3xl transition-all duration-500 group-hover:bg-[#6366F1]/20" />

              {/* Title */}
              <div className="relative z-10">
                <h3 className="text-[20px] font-black tracking-[-0.04em] text-white light:text-lightText">
                  {plan.title}
                </h3>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-[40px] font-black leading-none tracking-[-0.06em] text-white light:text-lightText">
                    {plan.price}
                  </span>

                  <span className="mb-2 text-[16px] text-darkSubText light:text-lightSubText">
                    / month
                  </span>
                </div>

                <p className="mt-4 text-[14px] leading-7 text-darkSubText light:text-lightSubText">
                  {plan.desc}
                </p>
              </div>

              {/* Features */}
              <div className="relative z-10 mt-4 space-y-3">
                {[
                  "All features of free",
                  "Advanced analytics",
                  "AI productivity insights",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      ✓
                    </div>

                    <span className="text-[14px] text-white/70 light:text-lightText">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className=" mt-5 h-13 w-full rounded-2xl border border-white/10 bg-white/5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-white/10 light:text-lightText ">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlanSection;
