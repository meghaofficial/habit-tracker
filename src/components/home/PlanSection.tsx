import { plans } from "../../staticData";

const PlanSection = () => {
  return (
    <>
      <section className="my-24">
            {/* Heading */}
            <div className="text-center">
              <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">
                Pricing
              </p>

              <h2 className="mt-3 text-[42px] font-black tracking-[-0.05em] text-white light:text-lightText">
                Choose Your Plan
              </h2>

              <p className="mx-auto mt-4 max-w-155 text-[16px] leading-7 text-darkSubText light:text-lightSubText">
                Start free and upgrade as your habits, productivity, and
                goals grow stronger over time.
              </p>
            </div>

            {/* Pricing Cards */}
            <div
              className="mt-16 grid items-center gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              {plans.map((plan, i) => {
                const isPopular = i === 1;

                return (
                  <div key={i} className={` group relative overflow-hidden rounded-[34px] border transition-all duration-500 hover:-translate-y-2 backdrop-blur-2xl ${isPopular ? ` scale-[1.03] border-[#6366F1]/40 bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] p-0.5 shadow-[0_40px_120px_rgba(99,102,241,0.35)] ` : ` border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_80px_rgba(99,102,241,0.15)] light:bg-lightCard ` } `} >
                    {/* Popular Glow */}
                    {isPopular && (
                      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-80" />
                    )}

                    {/* Inner */}
                    <div className={` relative h-full rounded-4xl p-7 ${isPopular ? "bg-[#0B1020]" : "bg-black/10 light:bg-lightCard" } `} >
                      {/* Floating Glow */}
                      <div className={` absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${isPopular ? "bg-[#6366F1]/25" : "bg-[#8B5CF6]/10" } `} />
                      {/* Top Label */}
                      <div className="relative z-10 flex items-center justify-between">
                        <p className={` text-[12px] font-extrabold uppercase tracking-[0.18em] ${isPopular ? "text-white/70" : "text-[#6B7280]" } `} >
                          {isPopular ? "Most Popular" : "Starter"}
                        </p>
                        {isPopular && (
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl">
                            ✦
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="relative z-10 mt-6">
                        <h3 className={` text-[34px] font-black tracking-[-0.04em] ${isPopular ? "text-white" : "text-white light:text-lightText" } `} >
                          {plan.title}
                        </h3>

                        <div className="mt-5 flex items-end gap-2">
                         <span className={` text-[68px] font-black leading-none tracking-[-0.06em] ${isPopular ? "text-white" : "text-white light:text-lightText" } `} >
                            {plan.price}
                          </span>

                          <span className={` mb-3 text-[18px] ${isPopular ? "text-white/35" : "text-darkSubText light:text-lightSubText" } `} >
                            / month
                          </span>
                        </div>

                        <p className={` mt-5 text-[15px] leading-7 ${isPopular ? "text-white/45" : "text-darkSubText light:text-lightSubText" } `} >
                          {plan.desc}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="relative z-10 mt-8 space-y-4">
                        {[
                          "Habit streak tracking",
                          "Smart productivity insights",
                          "Goal milestones",
                          "Cloud sync",
                        ].map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3" >
                            <div className={` flex h-9 w-9 items-center justify-center rounded-xl ${isPopular ? "bg-[#172036]" : "bg-white/10" } `} >
                              ✓
                            </div>

                            <span className={` text-[15px] font-medium ${isPopular ? "text-white/75" : "text-white/75 light:text-lightText" } `} >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button className={` relative z-10 mt-10 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl text-[16px] font-bold transition-all duration-500 ${isPopular ? ` bg-linear-to-r from-[#6366F1] via-[#3B82F6] to-[#A855F7] text-white shadow-[0_20px_50px_rgba(99,102,241,0.35)] ` : ` border border-white/10 bg-white/5 text-white hover:bg-white/10 light:text-lightText ` } `} >
                        {isPopular && (
                          <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-white/25 opacity-70" />
                        )}

                        <span className="relative z-10">
                          {i === 0
                            ? "Start Free"
                            : i === 1
                              ? "Upgrade Now"
                              : "Contact Sales"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Switch Buttons */}
            <div className="mt-10 flex items-center justify-center gap-3">
              {[0, 1, 2].map((_, i) => (
                <button key={i} className={` h-3 rounded-full transition-all duration-500 ${i === 1 ? "w-12 bg-linear-to-r from-[#6366F1] to-[#A855F7]" : "w-3 bg-white/20" } `} />
              ))}
            </div>
          </section>
    </>
  )
}

export default PlanSection
