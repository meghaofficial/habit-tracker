import {
  RiArrowRightLine,
  RiCheckLine,
  RiFireFill,
  RiShieldCheckFill,
  RiSparklingFill,
} from "react-icons/ri";
import { IoMdTrendingUp } from "react-icons/io";

export default function HeroRightSection() {
  return (
    <div className="relative flex h-[720px] w-full items-center justify-center overflow-hidden">
      hiii
      {/* Glow Background */}
      <div className="absolute h-[620px] w-[620px] rounded-full bg-gradient-to-br from-[#6366F1]/35 via-[#8B5CF6]/20 to-transparent blur-3xl" />

      <div className="absolute h-[540px] w-[540px] rounded-full border border-white/20 bg-gradient-to-br from-[#6366F1]/10 via-[#A855F7]/10 to-transparent" />

      {/* Floating Top Badge */}
      <div className="absolute left-[5%] top-[10%] z-20 flex items-center gap-3 rounded-full border border-white/40 bg-white/90 px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-lg">
          <IoMdTrendingUp className="text-[18px] text-white" />
        </div>

        <span className="text-[18px] font-bold text-[#111827]">
          +34% consistency
        </span>
      </div>

      {/* Main Card */}
      <div className="relative rounded-[42px] bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] p-[2px] shadow-[0_40px_120px_rgba(99,102,241,0.35)]">
        <div className="relative overflow-hidden rounded-[40px] bg-[#0B1020] px-8 pb-8 pt-6">
          {/* Soft Glow */}
          <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#6366F1]/20 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between">
            <span className="text-[18px] font-bold uppercase tracking-[0.18em] text-white/70 italic">
              Most Consistent
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl">
              <RiSparklingFill className="text-[18px] text-white" />
            </div>
          </div>

          {/* Inner Content */}
          <div className="relative mt-5 w-[430px] rounded-[34px] border border-white/5 bg-[#0F172A]/95 p-8 shadow-inner">
            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[40px] font-bold tracking-[-0.04em] text-white">
                  Habit Pro
                </p>

                <p className="mt-2 max-w-[280px] text-[17px] leading-[1.6] text-white/45">
                  Build powerful routines with streak tracking,
                  reminders, analytics and focus insights.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-[0_10px_30px_rgba(99,102,241,0.5)]">
                <RiFireFill className="text-[24px] text-white" />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-end gap-3">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-[82px] font-black leading-none text-transparent">
                92%
              </span>

              <span className="mb-3 text-[24px] font-medium text-white/35">
                success rate
              </span>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-4">
              {[
                "Smart habit reminders",
                "Daily streak tracking",
                "Weekly productivity insights",
                "Goal milestone analytics",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172036] shadow-inner">
                    <RiCheckLine className="text-[20px] text-[#60A5FA]" />
                  </div>

                  <span className="text-[17px] font-medium text-white/75">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="relative mt-10 flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#A855F7] text-[20px] font-bold text-white shadow-[0_20px_50px_rgba(99,102,241,0.4)]">
              {/* Shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 opacity-70" />

              <span className="relative z-10">
                Start Building Habits
              </span>

              <RiArrowRightLine className="relative z-10 text-[22px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Badge */}
      <div className="absolute bottom-[10%] right-[8%] flex items-center gap-3 rounded-full border border-white/40 bg-white/90 px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-lg">
          <RiShieldCheckFill className="text-[18px] text-white" />
        </div>

        <span className="text-[18px] font-bold text-[#111827]">
          100% synced
        </span>
      </div>
    </div>
  );
}