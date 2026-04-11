import { useState } from "react";
import { removeCreds } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoMoon } from "react-icons/io5";
import { MdWbSunny } from "react-icons/md";
import type { RootState } from "../../redux/store/store";
import AnalysisMainComponent from "../dashboard/analysis/AnalysisMainComponent";
import TrackMainComponent from "../dashboard/track/TrackMainComponent";

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("track");
  const dispatch = useDispatch();
  // const [dark, setDark] = useState(false);
  const [isDark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const username = useSelector((state: RootState) => state.auth.username);

  const toggleTheme = () => {
    // const newTheme = !dark;
    const newTheme = !isDark;
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

  // TRY UNCOMMENT THIS
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme === "dark") {
  //     setDark(true);
  //   }
  //   else {
  //     setDark(false)
  //   }
  // }, []);

  // useEffect(() => {
  //   const x = location.pathname.slice(1,);
  //   setActiveTab(x[0].toUpperCase() + x.slice(1,));
  // }, [location.pathname]);


  return (
    <>
      <div className="px-6 pt-4 overflow-x-hidden">
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <h1 className="text-[32px] font-bold google-sans">Hello, {username}</h1>
            <div className="mt-2 text-sm flex items-center gap-4">
              <span className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === 'track' ? 'text-darkText light:text-lightText' : 'text-gray-500'}`} onClick={() => setActiveTab("track")}>Monthly Habit</span>
              <span>|</span>
              <span className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === 'analysis' ? 'text-darkText light:text-lightText' : 'text-gray-500'}`} onClick={() => setActiveTab("analysis")}>Analysis</span>
              <span>|</span>
              <span className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === 'history' ? 'text-darkText light:text-lightText' : 'text-gray-500'}`} onClick={() => setActiveTab("history")}>History</span>
            </div>
          </div>
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
              className="relative w-14 h-8 flex items-center bg-darkBox light:bg-lightBox rounded-full p-1 transition cursor-pointer"
            >
              <div
                className={`w-6 h-6 bg-darkCard light:bg-lightBg flex items-center justify-center text-darkText light:text-lightText rounded-full shadow-md transform transition ${isDark ? "translate-x-6" : "translate-x-0"
                  }`}
              >
                {isDark ? <IoMoon /> : <MdWbSunny className="text-yellow-500" />}
              </div>
            </button>
            <button className="border-none py-1.5 cursor-pointer px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm" onClick={() => dispatch(removeCreds())}>
              Logout
            </button>
          </div>
        </div>

        {activeTab === "track" && <TrackMainComponent />}
        {activeTab === "analysis" && <AnalysisMainComponent />}

      </div>
    </>
  )
}

export default Dashboard
