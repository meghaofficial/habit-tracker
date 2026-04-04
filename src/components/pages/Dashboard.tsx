import { ProgressPie } from "../charts/ProgressPie";
import { WeeklyBarChart } from "../charts/WeeklyBarChart";
import { MonthlyLineChart } from "../charts/MonthlyLineChart";
import TodayAllTasks from "../charts/TodayAllTasks";
import { useEffect, useState } from "react";
import { removeCreds } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { IoMoon } from "react-icons/io5";
import { MdWbSunny } from "react-icons/md";

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("Dashboard");
  const dispatch = useDispatch();
  const [dark, setDark] = useState(false);

  const lineValues = Array.from({ length: 31 }, () =>
    Math.floor(Math.random() * 100)
  );

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

  // useEffect(() => {
  //   const x = location.pathname.slice(1,);
  //   setActiveTab(x[0].toUpperCase() + x.slice(1,));
  // }, [location.pathname]);


  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mt-3">
          <h1 className="text-[32px]/[0.5px] font-bold google-sans">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-darkCard light:bg-lightCard rounded-lg flex gap-4 p-2 ps-4 items-end">
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-gray-500">Current Plan</span>
                <span className="text-[14px]">April / 2026 - May / 2026</span>
              </div>
              <button className="py-2 px-4 text-[14px] border-none rounded-md text-white cursor-pointer bg-darkSuccess light:bg-lightSuccess">
                Extend Plan
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition cursor-pointer"
            >
              <div
                className={`w-6 h-6 bg-darkBg light:bg-lightBg flex items-center justify-center text-darkText light:text-lightText rounded-full shadow-md transform transition ${dark ? "translate-x-6" : "translate-x-0"
                  }`}
              >
                {dark ? <IoMoon /> : <MdWbSunny />}
              </div>
            </button>
            <button className="border-none py-1.5 cursor-pointer px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm" onClick={() => dispatch(removeCreds())}>
              Logout
            </button>
          </div>
        </div>

        {/* upper daywise, weekly, todays task */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="bg-darkCard light:bg-lightCard rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg px-5 py-3">Todays Activity</p>
              <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">3 April 2026</p>
            </div>
            <div className="flex items-center justify-center mt-5">
              <ProgressPie value={72} />
            </div>
          </div>
          <div className="bg-darkCard light:bg-lightCard rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg px-5 py-3">Weekly Activity</p>
              <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">April 2026</p>
            </div>
            <div className="flex items-center justify-center mt-5 pe-7">
              <WeeklyBarChart maxValue={100} />
            </div>
          </div>
          <div className="bg-darkCard light:bg-lightCard rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg px-5 py-3">Todays Tasks</p>
              <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">3 April 2026</p>
            </div>
            <div className="flex items-center justify-center mt-5">
              <TodayAllTasks />
            </div>
          </div>
        </div>

        {/* curr month progress */}
        <div className="bg-darkCard light:bg-lightCard rounded-2xl mt-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Monthly Activity</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-5">
            <MonthlyLineChart values={lineValues} />
          </div>
        </div>

      </div>
    </>
  )
}

export default Dashboard
