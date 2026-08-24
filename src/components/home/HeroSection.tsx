const HeroSection = () => {
  return (
    <section className="flex sm:flex-row flex-col sm:items-center justify-between py-15">
      <div className="w-full flex flex-col items-center">
        <p className=" text-violet-500 font-semibold uppercase">
          Build habits that actually stick.
        </p>
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 playfair-display">
          <p className="sm:text-[7em] text-[22vw] font-bold text-center">
            Habit
          </p>
          <p className="text-center sm:text-[7em] text-[22vw] sm:mt-0 -mt-5 font-bold leading-none bg-linear-to-r from-[#5B5CF6] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]">
            Tracker
          </p>
        </div>
        <p className="text-gray-500 sm:mt-0 mt-5 text-center w-[60%]">
          Track your daily habits, build lasting routines, and visualize your
          progress with beautifully organized insights. Stay motivated, maintain
          consistency effortlessly, and transform small daily actions into
          meaningful long-term growth.
        </p>
        <div className="mt-10 flex sm:flex-nowrap flex-wrap gap-10 google-sans">
          {[
            ["STREAKS", "Daily Consistency"],
            ["TRACKING", "Smart Insights"],
            ["GOALS", "Habit Milestones"],
            ["SYNC", "Cloud Connected"],
          ].map(([title, value], index) => (
            <div
              key={title}
              className="animate__animated animate__fadeInUp"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#6B7280]">
                {title}
              </p>

              <p className="mt-0.5 text-nowrap text-[14px] font-bold">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
