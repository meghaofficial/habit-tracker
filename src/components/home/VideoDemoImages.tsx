import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiPlay } from "react-icons/fi";

import dashboardImg from "../../assets/dashboard.png";
import analysisImg from "../../assets/analysis.png";
import calendarImg from "../../assets/calendar.png";
import historyImg from "../../assets/history.png";

const demoSlides = [
  {
    id: 1,
    image: dashboardImg,
    eyebrow: "YOUR DAILY COMMAND CENTER",
    title: "Turn your goals into action.",
    description:
      "Organize your daily tasks, track your progress and stay focused on what actually matters.",
    points: ["Daily task tracking", "Progress at a glance", "Stay consistent"],
  },
  {
    id: 2,
    image: calendarImg,
    eyebrow: "PLAN YOUR MONTH",
    title: "See your entire month at a glance.",
    description:
      "Build a clear picture of your commitments, goals and important milestones throughout the month.",
    points: ["Monthly planning", "Important dates", "Goal tracking"],
  },
  {
    id: 3,
    image: analysisImg,
    eyebrow: "UNDERSTAND YOUR PERFORMANCE",
    title: "Your effort becomes insight.",
    description:
      "Go beyond simply completing tasks. Understand your consistency, habits and overall performance.",
    points: ["Consistency analysis", "Performance insights", "Habit patterns"],
  },
  {
    id: 4,
    image: historyImg,
    eyebrow: "LOOK BACK. MOVE FORWARD.",
    title: "Your progress, over time.",
    description:
      "See how you've performed across previous days and months and identify where you're improving.",
    points: ["Progress history", "Past performance", "Long-term growth"],
  },
];

const VideoDemoImages = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlide = demoSlides[activeIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % demoSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const formattedText = (text: string) => text.toLowerCase();

  return (
    <section className="mt-20 mb-28 w-full px-4">
      <div className="mx-auto w-full max-w-6xl">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-400">
            One platform. Everything you need.
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your goals deserve
            <span className="text-indigo-400"> a system.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Plan your goals, build consistency, understand your performance and
            keep moving forward — all from one place.
          </p>
        </div>

        {/* Main Showcase */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border border-white/10
            bg-[#09090b]
            shadow-[0_30px_100px_rgba(99,102,241,0.14)]
          "
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

          {/* Content */}
          <div className="relative grid min-h-155 grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              {/* Step indicator */}
              <div className="mb-8 flex items-center gap-3">
                <span className="text-xs font-mono text-indigo-400">
                  0{activeIndex + 1}
                </span>

                <div className="h-px w-12 bg-white/10" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                  04
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Eyebrow */}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
                    {activeSlide.eyebrow}
                  </p>

                  {/* Title */}
                  <h3 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                    {activeSlide.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
                    {activeSlide.description}
                  </p>

                  {/* Points */}
                  <div className="mt-7 space-y-3">
                    {activeSlide.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
                          <FiCheck className="text-[10px] text-indigo-400" />
                        </div>

                        <span className="text-xs text-gray-400">{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-10 flex items-center gap-2">
                {demoSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIndex(index)}
                    className={`
                      h-1 rounded-full transition-all duration-500
                      ${
                        index === activeIndex
                          ? "w-10 bg-indigo-400"
                          : "w-4 bg-white/10 hover:bg-white/20"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Pause / status */}
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="
                  mt-7
                  flex
                  w-fit
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  text-gray-600
                  transition-colors
                  hover:text-gray-300
                "
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  {isPaused ? (
                    <FiPlay className="text-[9px]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </span>

                {isPaused ? "Play showcase" : "Pause showcase"}
              </button>
            </div>

            {/* RIGHT SIDE — SCREENSHOT */}
            <div className="relative flex items-center justify-center overflow-hidden p-6 sm:p-10 lg:p-12">
              {/* Glow behind screenshot */}
              <div className="absolute h-[70%] w-[70%] rounded-full bg-indigo-500/10 blur-[100px]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    x: 25,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                    x: -25,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                  className="relative w-full"
                >
                  {/* Browser frame */}
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
                    {/* Browser top */}
                    <div className="flex h-9 items-center gap-1.5 border-b border-white/5 bg-white/2.5 px-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

                      <div className="ml-4 h-4 flex-1 max-w-70 rounded-md bg-white/5" />
                    </div>

                    {/* Screenshot */}
                    <div className="relative overflow-hidden bg-black">
                      <img
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        className="
                          block
                          h-auto
                          w-full
                          object-cover
                        "
                      />

                      {/* Screenshot shine */}
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-indigo-500/4" />
                    </div>
                  </div>

                  {/* Floating label */}
                  <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-zinc-950/90 px-4 py-2.5 shadow-xl backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                      <span className="text-[10px] font-medium text-gray-400">
                        Live platform preview
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom navigation cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {demoSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              className={`
                group
                rounded-xl
                border
                p-4
                text-left
                transition-all
                duration-300
                ${
                  index === activeIndex
                    ? "border-indigo-400/30 bg-indigo-500/6"
                    : "border-white/6 bg-white/1.5 hover:border-white/10 hover:bg-white/3"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono ${
                    index === activeIndex ? "text-indigo-400" : "text-gray-600"
                  }`}
                >
                  0{index + 1}
                </span>

                <FiArrowRight
                  className={`
                    text-xs transition-transform duration-300
                    ${
                      index === activeIndex
                        ? "text-indigo-400 translate-x-0.5"
                        : "text-gray-700 group-hover:translate-x-0.5"
                    }
                  `}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-gray-300 capitalize">
                {formattedText(slide.eyebrow)
                  .replace("your ", "")
                  .replace("04", "")}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoDemoImages;
