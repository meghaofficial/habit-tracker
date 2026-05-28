import {
  RiBarChartBoxLine,
  RiCheckboxCircleFill,
  RiFireFill,
  RiLineChartLine,
  RiWaterFlashFill,
} from "react-icons/ri";

export default function HeroRightSection() {
  return (
    <div className="relative flex h-[620px] w-full items-center justify-center overflow-hidden">
      {/* Glow Background */}
      <div className="absolute h-[520px] w-full rounded-full bg-gradient-to-br from-[#6366F1]/30 via-[#A855F7]/15 to-transparent blur-3xl" />

      <div className="absolute h-[380px] w-[380px] rounded-full border border-white/20 bg-gradient-to-br from-[#6366F1]/15 to-transparent backdrop-blur-3xl" />

      {/* Floating Cards */}
      <div className="relative grid scale-[0.78] grid-cols-2 gap-5">
        {/* Progress Card */}
        <div className="translate-y-8 rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_80px_rgba(99,102,241,0.16)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-[#111827]">
              Today's Progress
            </p>

            <div className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-semibold text-[#6366F1]">
              78%
            </div>
          </div>

          {/* Donut */}
          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#6366F1_0deg,#8B5CF6_280deg,#E5E7EB_280deg)]">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[30px] font-bold text-[#111827]">
                  78%
                </span>

                <span className="text-[11px] text-[#6B7280]">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#6366F1]" />

              <span className="text-[12px] text-[#6B7280]">Done</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#C4B5FD]" />

              <span className="text-[12px] text-[#6B7280]">
                Remaining
              </span>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="-translate-y-4 rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_80px_rgba(99,102,241,0.16)] backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[16px] font-semibold text-[#111827]">
                Habit Streak
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-[48px] font-black leading-none text-[#111827]">
                  12
                </span>

                <span className="mb-1 text-[16px] text-[#6B7280]">
                  days
                </span>
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-lg">
              <RiFireFill className="text-[18px] text-white" />
            </div>
          </div>

          {/* Bars */}
          <div className="mt-6 flex h-28 items-end gap-2">
            {[20, 35, 50, 70, 90, 120].map((height, i) => (
              <div
                key={i}
                style={{ height }}
                className="w-7 rounded-t-xl bg-gradient-to-t from-[#6366F1] to-[#A855F7]"
              />
            ))}
          </div>
        </div>

        {/* Habits Card */}
        <div className="-translate-y-3 rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_80px_rgba(99,102,241,0.16)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-[#111827]">
              Daily Habits
            </p>

            <button className="rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] px-3 py-1.5 text-white shadow-lg">
              +
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: <RiCheckboxCircleFill />,
                title: "Workout",
                progress: "5/7",
              },
              {
                icon: <RiBarChartBoxLine />,
                title: "Reading",
                progress: "6/7",
              },
              {
                icon: <RiWaterFlashFill />,
                title: "Hydration",
                progress: "7/7",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-[#EEF2FF] bg-white/80 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] text-[18px] text-white shadow-md">
                    {item.icon}
                  </div>

                  <span className="text-[14px] font-semibold text-[#111827]">
                    {item.title}
                  </span>
                </div>

                <div className="rounded-full border border-[#C4B5FD] px-2.5 py-1 text-[11px] font-semibold text-[#6366F1]">
                  {item.progress}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <div className="translate-y-8 rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_80px_rgba(99,102,241,0.16)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-[#111827]">
              Weekly Overview
            </p>

            <div className="rounded-xl bg-[#EEF2FF] px-3 py-1.5 text-[11px] font-semibold text-[#6366F1]">
              This Week
            </div>
          </div>

          {/* Chart */}
          <div className="relative mt-6 h-36">
            <svg
              viewBox="0 0 300 160"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="lineGradient">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>

              <path
                d="M0 120 C40 40, 80 150, 120 70 S200 90, 260 30"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {[0, 60, 120, 180, 260].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={[120, 70, 110, 60, 30][i]}
                  r="5"
                  fill="#6366F1"
                />
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[#6366F1]">
            <RiLineChartLine className="text-[18px]" />

            <span className="text-[13px] font-semibold">
              +34% productivity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}