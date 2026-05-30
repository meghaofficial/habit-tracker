import { useEffect, useState } from "react";
import { IoStatsChart } from "react-icons/io5";
import AuthForm from "../auth/AuthForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import Logo from "../shared/Logo";
import { IoMdLogIn } from "react-icons/io";
import CustomButton from "../shared/CutomButton";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import PlanSection from "../home/PlanSection";

const features = [
  {
    title: "Daily Tracking",
    desc: "Mark habits daily with a clean interface.",
    icon: <FaCalendarAlt className="text-yellow-500" />,
  },
  {
    title: "Progress",
    desc: "Track streaks and completion rates.",
    icon: <IoStatsChart className="text-blue-500" />,
  },
  {
    title: "Goals",
    desc: "Set weekly and monthly targets.",
    icon: <GoGoal className="text-red-500" />,
  },
  {
    title: "Reminders",
    desc: "Never miss a habit again.",
    icon: <FaBell className="text-green-500" />,
  },
];

const HomePage = () => {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");
  const [showNavbar, setShowNavbar] = useState(false);

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
    } else {
      setDark(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen sm:px-0 px-4">
        <div
          className="w-[90%] max-w-300 m-auto"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {/* Navbar */}
          <nav className="flex justify-between items-center py-5 sm:pt-10 pt-7">
            <Logo />
            <div className="flex items-center gap-4">
              <CustomButton onClick={toggleTheme} type="transparent">
                <div className="flex items-center gap-1">
                  {dark ? <LuSunMoon /> : <LuSunMedium />}
                  <span className="sm:block hidden">{dark ? "Dark Theme" : "Light Theme"}</span>
                </div>
              </CustomButton>
              <CustomButton
                onClick={() => {
                  if (!isLogin) setOpen(true);
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="sm:block hidden">Login</span>
                  <IoMdLogIn />
                </div>
              </CustomButton>
            </div>
          </nav>
          <nav
            className={`fixed left-1/2 top-2 z-50 flex w-[95%] max-w-300 -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-500 ease-out ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"} light:bg-white/70 `}
          >
            <Logo />

            <div className="flex items-center gap-4">
              <CustomButton onClick={toggleTheme} type="transparent">
                <div className="flex items-center gap-1">
                  {dark ? <LuSunMoon /> : <LuSunMedium />}
                  <span className="sm:block hidden">{dark ? "Dark Theme" : "Light Theme"}</span>
                </div>
              </CustomButton>

              <CustomButton
                onClick={() => {
                  if (!isLogin) setOpen(true);
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="sm:block hidden">Login</span>
                  <IoMdLogIn />
                </div>
              </CustomButton>
            </div>
          </nav>

          {/* Hero */}
          <section className="flex sm:flex-row flex-col sm:items-center justify-between py-15">
            <div className="sm:max-w-125">
              <p className="italic text-violet-500 font-semibold uppercase">
                Build habits that actually stick.
              </p>
              <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <p className="sm:text-[7em] text-[22vw] font-bold">Habit</p>
                <p className="sm:text-[7em] text-[22vw] sm:mt-0 -mt-5 font-bold leading-none bg-linear-to-r from-[#5B5CF6] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]">
                  Tracker
                </p>
              </div>
              <p className="text-gray-500 sm:mt-0 mt-5">
                Track your daily habits, build lasting routines, and visualize
                your progress with beautifully organized insights. Stay
                motivated, maintain consistency effortlessly, and transform
                small daily actions into meaningful long-term growth.
              </p>
              <div className="mt-5 flex sm:flex-nowrap flex-wrap gap-10 google-sans">
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

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl light:bg-lightCard sm:mt-0 mt-10">
              {/* Glow */}
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-darkSuccess/10 blur-3xl" />

              {/* Header */}
              <div className="relative mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-white/90 light:text-black">
                    Activity
                  </p>

                  <p className="mt-1 text-[12px] text-white/45 light:text-black/45">
                    Your consistency this month
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-darkSuccess" />

                  <span className="text-[12px] font-medium text-white/50 light:text-black/50">
                    Active days
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div
                className="relative grid gap-2"
                style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
              >
                {Array.from({ length: 35 }).map((_, i) => {
                  const level = Math.floor(Math.random() * 5);

                  const colors = dark
                    ? ["#1e293b", "#14532d", "#166534", "#16a34a", "#22c55e"]
                    : ["#e2e8f0", "#dcfce7", "#86efac", "#4ade80", "#22c55e"];

                  return (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-[10px] transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]"
                      style={{
                        background: colors[level],
                      }}
                    />
                  );
                })}
              </div>

              {/* Footer */}
              <div className="relative mt-5 flex items-center justify-between">
                <p className="text-[12px] text-white/40 light:text-black/40">
                  82% consistency
                </p>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-darkSuccess"
                      style={{ opacity: i / 4 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <div className="text-center mt-30">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">
              Features
            </p>

            <h2 className="mt-3 text-[42px] font-black tracking-[-0.05em] text-white light:text-lightText">
              Build Better Habits
            </h2>

            <p className="mx-auto mt-4 max-w-155 text-[16px] leading-7 text-darkSubText light:text-lightSubText">
              Track habits, maintain streaks, set meaningful goals, and gain
              actionable insights to stay consistent and achieve lasting
              personal growth.
            </p>
          </div>
          <section
            className="my-15 grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.18)] light:bg-lightCard"
                >
                  {/* Glow BG */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6366F1]/10 blur-3xl transition-all duration-500 group-hover:bg-[#8B5CF6]/20" />

                  {/* Shine Overlay */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-linear-to-br from-white/[0.07] via-transparent to-transparent" />
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-linear-to-br from-white/10 to-white/5 text-[28px] text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {Icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-6">
                    <h3 className="text-[22px] font-bold tracking-[-0.03em] text-white light:text-lightText">
                      {f.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-darkSubText light:text-lightSubText">
                      {f.desc}
                    </p>
                  </div>

                  {/* Bottom Line */}
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-linear-to-r from-transparent via-[#8B5CF6] to-transparent transition-all duration-500 group-hover:w-[80%]" />

                  {/* Floating Dot */}
                  <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#8B5CF6]/60 opacity-0 blur-[1px] transition-all duration-500 group-hover:opacity-100" />
                </div>
              );
            })}
          </section>

          {/* Pricing Section */}
          <PlanSection />

          {/* Footer */}
          <footer className="text-center p-5 border-t mt-20 border-darkBorder light:border-lightBorder">
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
