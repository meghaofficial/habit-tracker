import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { plans } from "../../staticData";
import { MdWbSunny } from "react-icons/md";
import { IoMoon, IoStatsChart } from "react-icons/io5";
import AuthForm from "../auth/AuthForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { axiosPrivate } from "../../api/axios";
import Logo from "../shared/Logo";
import { IoMdLogIn } from "react-icons/io";
import CustomButton from "../shared/CutomButton";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import HeroRightSection from "../shared/HeroRightSection";

const features = [
  { title: "Daily Tracking", desc: "Mark habits daily with a clean interface.", icon: <FaCalendarAlt className="text-yellow-500" /> },
  { title: "Progress", desc: "Track streaks and completion rates.", icon: <IoStatsChart className="text-blue-500" /> },
  { title: "Goals", desc: "Set weekly and monthly targets.", icon: <GoGoal className="text-red-500" /> },
  { title: "Reminders", desc: "Never miss a habit again.", icon: <FaBell className="text-green-500" /> },
];

const HomePage = () => {

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    const root = window.document.documentElement;

    if (newTheme) {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    }
    else {
      setDark(false)
    }
  }, []);

  return (
    <>
      <div className="min-h-screen sm:px-0 px-4">
        <div className="w-[90%] max-w-300 m-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
          {/* Navbar */}
          <nav className="flex justify-between items-center py-5 sm:pt-10 pt-7">
            <Logo />
            <div className="flex items-center gap-4">
              <CustomButton
                title={(
                  <div className="flex items-center gap-1">
                    {dark ? <LuSunMoon /> : <LuSunMedium />}
                    <span>
                      {dark ? "Dark Theme" : "Light Theme"}
                    </span>
                  </div>
                )}
                onClick={toggleTheme}
                type="transparent"
              />
              <CustomButton
                title={(
                  <div className="flex items-center gap-1">
                    <span>Login</span>
                    <IoMdLogIn />
                  </div>
                )}
                onClick={() => {
                  if (!isLogin)
                    setOpen(true);
                }}
              />
            </div>
            {/* <button
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
              onClick={() => {
                if (!isLogin) setOpen(true);
              }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-r from-transparent via-white/8 to-transparent" />
              <span className="relative z-10">Login</span>
              <IoMdLogIn className="relative z-10 text-[18px] transition-all duration-300 group-hover:translate-x-0.5" />
            </button> */}

          </nav>

          {/* Hero */}
          <section className="flex items-center justify-between py-15">
            <div className="max-w-125">
              <p className="italic text-violet-500 font-semibold uppercase">Build habits that actually stick.</p>
              <div className="flex items-center gap-3">
                <p className="text-[100px] font-bold">Habit</p>
                <p className="text-[100px] font-bold leading-none bg-linear-to-r from-[#5B5CF6] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]">Tracker</p>
              </div>
              <p className="text-gray-500">Track your daily habits, build lasting routines, and visualize your progress with beautifully organized insights. Stay motivated, maintain consistency effortlessly, and transform small daily actions into meaningful long-term growth.</p>
              <div className="mt-5 flex gap-10 google-sans">
                {[
                  ["STREAKS", "Daily Consistency"],
                  ["TRACKING", "Smart Insights"],
                  ["GOALS", "Habit Milestones"],
                  ["SYNC", "Cloud Connected"],
                ].map(([title, value]) => (
                  <div key={title}>
                    <p className="font-extrabold text-[12px] tracking-[0.18em] text-[#6B7280] uppercase">
                      {title}
                    </p>

                    <p className="mt-0.5 text-[14px] text-nowrap font-bold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              {/* <div className="flex flex-row items-center gap-3">
                <span className="sm:mr-2.5 py-3 px-5 rounded-lg border-none cursor-pointer text-white bg-darkPrimary light:bg-lightPrimary" onClick={() => setOpen(true)}>
                  Get Started
                </span>
                <Link to="/demo"
                  className="border hover:bg-darkPrimary hover:text-white border-darkPrimary light:border-lightPrimary text-darkPrimary light:text-lightPrimary cursor-pointer bg-transparent py-3 px-5 rounded-lg"
                >
                  View Demo
                </Link>
              </div> */}
            </div>
            {/* <HeroRightSection /> */}

            {/* <div className="bg-black/20 light:bg-lightCard p-5 rounded-lg grid gap-2" style={{ gridTemplateColumns: "repeat(7, 30px)" }}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7.5 h-7.5 rounded-md"
                  style={{
                    background: Math.random() > 0.5 ? "#22c55e" : dark ? "#334155" : "#e2e8f0",
                  }}
                />
              ))}
            </div> */}
            {/* <div
              className="
    relative
    overflow-hidden
    rounded-3xl
    border border-white/10
    bg-white/5
    backdrop-blur-xl
    p-6
  "
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    Habit Activity
                  </h3>

                  <p className="text-sm text-darkSubText">
                    Your consistency this month
                  </p>
                </div>

                <div
                  className="
        px-4
        py-2
        rounded-full
        bg-green-500/15
        text-green-400
        text-sm
        border border-green-500/20
      "
                >
                  82%
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  "🔥 7 Day Streak",
                  "✅ 18 Completed",
                  "⚡ Productive",
                  "🎯 Goals Met",
                  "📈 +12% Growth",
                  "💪 Strong Week",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border border-white/10
          backdrop-blur-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-white/10
          hover:border-white/20
        "
                  >
                    <span className="text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="
      absolute
      -bottom-20
      right-0
      w-40
      h-40
      bg-green-500/10
      blur-3xl
      rounded-full
    "
              />
            </div> */}
          </section>

          {/* Features */}
          <section className="grid gap-5 my-15"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 light:bg-lightCard backdrop-blur-md p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                >
                  {/* glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-white/5 to-transparent" />

                  {/* icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-white/10 border border-white/10 mb-5 backdrop-blur-lg">
                    {Icon}
                  </div>

                  {/* title */}
                  <h3 className="text-xl font-semibold text-white light:text-lightText mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-6 text-darkSubText light:text-lightSubText">
                    {f.desc}
                  </p>

                  {/* bottom glow line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-white/70 to-transparent transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </section>


          {/* Pricing Section */}
          <section className="my-20">
            <h2 className="text-[32px] font-semibold mb-7.5 text-center">Choose Your Plan</h2>
            <div className="grid gap-5 grid-cols-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {plans.map((plan, i) => (
                <div key={i} className="bg-darkCard light:bg-lightCard p-5 rounded-lg text-center">
                  <h3>{plan.title}</h3>
                  <p style={{ fontSize: "22px", margin: "10px 0" }}>{plan.price}</p>
                  <p className="text-gray-400 text-[14px] mb-3.75">
                    {plan.desc}
                  </p>
                  <button className={`mr-2.5 py-2 px-5 text-sm rounded-md border-none cursor-pointer ${i === 0 ? 'bg-darkSuccess light:bg-lightSuccess text-black hover:text-white' : 'bg-darkPrimary light:bg-lightPrimary text-white'}`}>
                    {i === 0 ? 'Activate' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Extend Plan Section */}
          {/* <section className="text-center my-15">
            <h2>Extend Your Plan</h2>
            <p className="mb-3.75 mt-1 text-[12px] text-gray-500">
              Already have a plan? Extend it anytime.
            </p>
            <button className="py-2 hover:text-white px-6.25 border-none rounded-md cursor-pointer bg-darkSuccess light:bg-lightSuccess" onClick={() => setOpen(true)}>
              Extend Plan
            </button>
          </section> */}

          {/* Footer */}
          <footer className="text-center p-5 border-t border-darkBorder light:border-lightBorder">
            <p>© 2026 Habitify. All rights reserved.</p>
          </footer>
        </div>
      </div>


      {/* auth form */}
      <div>
        <AuthForm open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default HomePage;