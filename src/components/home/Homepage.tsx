import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { plans } from "../../staticData";
import { MdWbSunny } from "react-icons/md";
import { IoMoon, IoStatsChart } from "react-icons/io5";
import AuthForm from "../auth/AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { removeCreds } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store/store";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import { GoGoal } from "react-icons/go";

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

  
  const dispatch = useDispatch();

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

  return (
    <>
      <div className="min-h-screen">
        <div className="w-[90%] max-w-300 m-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
          {/* Navbar */}
          <nav className="flex justify-between items-center py-5 pt-10">
            <h1 className="text-[32px]/[0.5px] font-bold text-darkPrimary light:text-lightPrimary">Habitify</h1>

            <div className="flex gap-4 items-center justify-center">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-8 flex items-center bg-darkBox light:bg-lightBox rounded-full p-1 transition cursor-pointer"
              >
                <div
                  className={`w-6 h-6 bg-darkCard light:bg-lightBg flex items-center justify-center text-darkText light:text-lightText rounded-full shadow-md transform transition ${dark ? "translate-x-6" : "translate-x-0"
                    }`}
                >
                  {dark ? <IoMoon /> : <MdWbSunny className="text-yellow-500" />}
                </div>
              </button>

              {/* Login Button */}
              <button className="border-none py-1.5 cursor-pointer px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm" onClick={() => {
                if (!isLogin)
                  setOpen(true);
                else 
                  dispatch(removeCreds());
              }}>
                {isLogin ? 'Logout' : 'Login'}
              </button>
            </div>
          </nav>

          {/* Hero */}
          <section className="flex items-center justify-between py-15 flex-wrap">
            <div className="max-w-125">
              <h2 className="text-[42px] mb-5">Build habits that actually stick.</h2>
              <p className="mb-5 text-darkSubText light:text-lightSubText">
                Track your daily habits, visualize progress, and stay consistent effortlessly.
              </p>
              <div>
                <Link to="/dashboard" className="mr-2.5 py-3 px-5 rounded-lg border-none cursor-pointer text-white bg-darkPrimary light:bg-lightPrimary">
                  Get Started
                </Link>
                <Link to="/demo"
                  className="border border-darkPrimary light:border-lightPrimary text-darkPrimary light:text-lightPrimary cursor-pointer bg-transparent py-3 px-5 rounded-lg"
                >
                  View Demo
                </Link>
              </div>
            </div>

            <div className="bg-darkCard light:bg-lightCard p-5 rounded-lg grid gap-2" style={{ gridTemplateColumns: "repeat(7, 30px)" }}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7.5 h-7.5 rounded-md"
                  style={{
                    background: Math.random() > 0.5 ? "#22c55e" : dark ? "#334155" : "#e2e8f0",
                  }}
                />
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="grid gap-5 my-15" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-darkCard light:bg-lightCard p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {Icon}
                  <h3>{f.title}</h3>
                </div>
                <p className="text-darkSubText light:text-lightSubText">{f.desc}</p>
              </div>
              )
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