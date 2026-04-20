import { useEffect, useState } from "react";
import { removeCreds, setCreds } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoMoon } from "react-icons/io5";
import { MdWbSunny } from "react-icons/md";
import type { RootState } from "../../redux/store/store";
import AnalysisMainComponent from "../dashboard/analysis/AnalysisMainComponent";
import TrackMainComponent from "../dashboard/track/TrackMainComponent";
import { notify } from "../../helper";
import { axiosPrivate } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { plans } from "../../staticData";
import Popup from "../shared/Popup";

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("track");
  const dispatch = useDispatch();
  const [isDark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const username = useSelector((state: RootState) => state.auth.username);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth);
  const [openPopup, setOpenPopup] = useState(false);
  const [freeTrialLoading, setFreeTrialLoading] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    // Update your DOM class here if needed (e.g., document.body.classList.toggle('dark', isDark))
  }, [isDark]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {

      const res = await axiosPrivate.post("/logout");

      if (res?.data?.success) {
        dispatch(removeCreds());
      }

    } catch (error) {
      console.error(error);
      notify.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  }

  const handleActivateFree = async () => {
    setFreeTrialLoading(true);
    try {

      const res = await axiosPrivate.patch("/free-trial");

      if (res?.data?.success) {
        notify.success(res?.data?.message);
        dispatch(setCreds({ isActiveSubs: true }));
        setOpenPopup(false);
      }

    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setFreeTrialLoading(false);
    }
  }

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

        {!user?.isActiveSubs && (
          <>
            {/* overlay for not subscribed */}
            <div className="z-9999 backdrop-blur fixed -top-5 left-0 w-full h-full mt-5 rounded-2xl overflow-x-hidden flex items-center justify-center flex-col">
              <div className="absolute top-3 right-3 flex items-center gap-3">
                <button className={`border-none py-1.5 min-w-24 min-h-8 flex items-center justify-center px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm ${!logoutLoading && 'cursor-pointer'}`} onClick={handleLogout}>
                  {logoutLoading ? <CircleLoader /> : 'Logout'}
                </button>
                <IoSettingsSharp className="cursor-pointer text-xl" onClick={() => navigate("/settings")} />
              </div>
              <p className="text-3xl mb-3 font-semibold">Oops! you don't have any active subscription.</p>
              <p className="mb-5">To activate, please choose any active plan from the following.</p>
              <div className="grid gap-3 grid-cols-5">
                {plans.map((plan, i) => (
                  <div key={i} className="bg-darkCard light:bg-lightCard p-5 rounded-lg text-center">
                    <h3>{plan.title}</h3>
                    <p style={{ fontSize: "22px", margin: "10px 0" }}>{plan.price}</p>
                    <p className="text-gray-400 text-[14px] mb-3.75 w-55">
                      {plan.desc}
                    </p>
                    <button onClick={() => {
                      if (i == 0) setOpenPopup(true);
                    }} className={`mr-2.5 py-2 px-5 text-sm rounded-md border-none cursor-pointer ${i === 0 ? 'bg-darkSuccess light:bg-lightSuccess text-black' : 'bg-darkPrimary light:bg-lightPrimary text-white'}`}>
                      {i === 0 ? 'Activate' : 'Choose Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Popup open={openPopup} setOpen={setOpenPopup}>
          <div className="flex items-center justify-center h-95 flex-col google-sans">
            <p>Are you sure you want to activate your free trial ? This action can be undone!</p>
            <p className="text-gray-500 text-sm mt-3 w-[80%] tracking-wider text-justify">Tip: Use your free trial wisely. It is suggested to activate you free trial in the beginning of the month, otherwise you will get advantage of using it for minimum days. For example - If you activate your free trial on 25th of April then your activation will only be valid till April 31st. And if you activate your free trial on 4th of April then also your activation will be valid till April 31st. Your free trial activation will be valid till end of the current month no matter at which date you are activating your free trial.</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              {freeTrialLoading ? (
                <button className={`mr-2.5 py-2.5 px-5 min-w-20 rounded-md border-none bg-darkSuccess light:bg-lightSuccess text-black`}>
                  <CircleLoader />
                </button>
              ) : (
                <button onClick={handleActivateFree} className={`mr-2.5 py-2 px-5 rounded-md border-none cursor-pointer bg-darkSuccess light:bg-lightSuccess text-black`}>
                  Confirm
                </button>
              )}
              <button onClick={() => setOpenPopup(false)} className={`mr-2.5 py-2 px-5 rounded-md border-none cursor-pointer bg-red-500 text-black`}>
                Cancel
              </button>
            </div>
          </div>
        </Popup>


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
            <button className={`border-none py-1.5 min-w-24 min-h-8 flex items-center justify-center px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm ${!logoutLoading && 'cursor-pointer'}`} onClick={handleLogout}>
              {logoutLoading ? <CircleLoader /> : 'Logout'}
            </button>
            <IoSettingsSharp className="cursor-pointer text-xl" onClick={() => navigate("/settings")} />
          </div>
        </div>

        {activeTab === "track" && <TrackMainComponent />}
        {activeTab === "analysis" && <AnalysisMainComponent />}

      </div >
    </>
  )
}

export default Dashboard
