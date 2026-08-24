import {
  FaCalendarAlt,
  FaChartLine,
  FaHistory,
  FaRobot,
  FaBullseye,
  FaLightbulb,
} from "react-icons/fa";

const features = [
  {
    title: "Daily Planning",
    desc: "Organize your tasks and daily activities while keeping your routine on track.",
    icon: FaCalendarAlt,
  },
  {
    title: "Goals & Targets",
    desc: "Turn your bigger ambitions into clear weekly and monthly targets.",
    icon: FaBullseye,
  },
  {
    title: "Progress & Streaks",
    desc: "Track completion, maintain streaks, and build consistency day by day.",
    icon: FaChartLine,
  },
  {
    title: "Performance Insights",
    desc: "Understand your consistency, performance, and patterns through meaningful insights.",
    icon: FaLightbulb,
  },
  {
    title: "History & Reflection",
    desc: "Look back at your previous progress and reflect on your wins, lessons, and growth.",
    icon: FaHistory,
  },
  {
    title: "AI Coach",
    desc: "Get personalized guidance based on your goals, activity, and performance.",
    icon: FaRobot,
  },
];

const Features = () => {
  return (
    <section className="relative mt-32 mb-32 overflow-hidden px-4">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-80 w-160 -translate-x-1/2 rounded-full bg-indigo-500/6 blur-[120px]" />

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center">

          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Everything you need
          </p>

          <h2 className="mt-4 text-[40px] font-black tracking-[-0.045em] text-white light:text-lightText sm:text-[46px]">
            Everything in one place.
          </h2>

          <p className="mx-auto mt-5 max-w-150 text-[15px] leading-7 text-darkSubText light:text-lightSubText">
            Plan your goals, stay consistent, understand your progress,
            and keep improving every day.
          </p>

        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 lg:grid-cols-3">

          {features.map(feature => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="relative"
              >

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/8 bg-white/4.5 text-indigo-300 light:border-black/8 light:bg-black/3 light:text-indigo-600">
                  <Icon className="text-[18px]" />
                </div>

                {/* Content */}
                <div className="mt-5">

                  <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-white light:text-lightText">
                      {feature.title}
                    </h3>

                  <p className="mt-2.5 max-w-80 text-[14px] leading-6 text-gray-500 light:text-lightSubText">
                    {feature.desc}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default Features;