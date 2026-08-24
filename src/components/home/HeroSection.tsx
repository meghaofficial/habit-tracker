import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();

  const highlights = [
    {
      label: "STREAKS",
      value: "Daily Consistency",
    },
    {
      label: "GOALS",
      value: "Stay Focused",
    },
    {
      label: "INSIGHTS",
      value: "Know Your Progress",
    },
    {
      label: "SYNC",
      value: "Always Connected",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-8">
      <div className="pointer-events-none absolute left-[15%] top-[35%] -z-10 h-40 w-40 rounded-full bg-blue-500/4 blur-[100px]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 text-center sm:px-8">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3.5 py-1.5 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-300 sm:text-[10px]">
            Build habits that actually stick
          </p>
        </div>

        {/* Main Heading */}

        <h1 className="playfair-display mt-7 max-w-5xl text-[15vw] font-bold leading-[0.88] tracking-[-0.055em] sm:text-[7.5rem] lg:text-[8.5rem]">
          <span className="text-white light:text-lightText">Habit </span>

          <br className="sm:hidden" />

          <span className="bg-linear-to-r from-[#6366F1] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(99,102,241,0.15)]">
            Tracker
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-2xl text-[14px] leading-7 text-gray-500 sm:mt-8 sm:text-[16px] sm:leading-8">
          Track your daily habits, build lasting routines, and understand your
          progress through meaningful insights. Turn small actions into
          consistent growth.
        </p>

        {/* CTA */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
          <button className=" group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6366F1] via-[#3B82F6] to-[#A855F7] px-7 text-[13px] font-bold text-white shadow-[0_15px_45px_rgba(99,102,241,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(99,102,241,0.35)] sm:w-auto " onClick={() => navigate("/login")}>
            Get Started Free
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>

          <button className=" flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/3 px-7 text-[13px] font-semibold text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/6 sm:w-auto " onClick={() => navigate("/login")}>
            Explore Habitify
          </button>
        </div>
        <p className="mt-4 text-[10px] text-gray-600">
          Start your current month free · No payment required
        </p>
        <div className="mt-14 grid w-full max-w-3xl grid-cols-2 border-y border-white/[0.07] py-6 sm:mt-16 sm:grid-cols-4">
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center px-3 py-2 ${
                index === 0
                  ? ""
                  : index === 2
                    ? "border-l-0 sm:border-l border-white/[0.07]"
                    : "border-l border-white/[0.07]"
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 sm:text-[10px]">
                {item.label}
              </p>

              <p className="mt-1.5 text-[11px] font-semibold text-gray-400 sm:text-[12px]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
