import { useEffect, useRef, useState } from "react";
import { removeCreds } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import AnalysisMainComponent from "../dashboard/analysis/AnalysisMainComponent";
import TrackMainComponent from "../dashboard/track/TrackMainComponent";
import { formattedText, notify } from "../../helper";
import { axiosPrivate } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { plans } from "../../staticData";
import Popup from "../shared/Popup";
import PageLoader from "../loaders/PageLoader";
import type { DashboardI, DateLogI, PlanI, SubscriptionI } from "../../types";
import { IoMdLogOut } from "react-icons/io";
import CustomButton, { CustomButtonForm } from "../shared/CutomButton";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import NavigationBar from "../shared/NavigationBar";

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
  const [openPopup, setOpenPopup] = useState(false);
  const [freeTrialLoading, setFreeTrialLoading] = useState(false);

  const [plansList, setPlansList] = useState<PlanI[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashLoading, setDashLoading] = useState(false);
  const [showFree, setShowFree] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardI>({
    _id: "",
    userID: "",
    month: 0,
    year: 0,
    totalDays: 0,
    firstDay: 0,
  });
  const [taskList, setTaskList] = useState<
    { _id: string; taskName: string; monthDashID: string }[]
  >([]);
  const [openPlan, setOpenPlan] = useState(false);
  const [activeMonth, setActiveMonth] = useState<SubscriptionI | any>({});
  const [log, setLog] = useState<DateLogI>({
    _id: "",
    monthDashID: "",
    fullDate: new Date(),
    tasks: [],
  });
  const [todayDate, setTodayDate] = useState("");
  const [activeSubsLoading, setActiveSubsLoading] = useState(false);

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
  };

  const handleSubscribe = async (planID: string, amount: number) => {
    setFreeTrialLoading(true);
    try {
      const res = await axiosPrivate.post("/api/subscribe", { planID, amount });

      if (res?.data?.success) {
        notify.success(res?.data?.message);
        if (amount === 0) {
          setOpenPopup(false);
          setShowDashboard(true);
          await getActiveSubscription();
        } else {
          setOpenPlan(false);
        }
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setFreeTrialLoading(false);
    }
  };

  const getPlans = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/get-plans?type=${!showFree ? "free" : "paid"}`,
      );
      if (res?.data?.success) {
        setPlansList(res?.data?.plans || []);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDashboard = async () => {
    setDashLoading(true);
    try {
      const res = await axiosPrivate.get("/api/dashboard");
      if (res?.data?.success) {
        setDashboardData(res?.data?.monthData);
        setShowDashboard(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDashLoading(false);
    }
  };

  const getActiveSubscription = async () => {
    setActiveSubsLoading(true);
    try {
      const res = await axiosPrivate.get("/api/active-subscription");
      if (res?.data?.success) {
        const subscription = res?.data?.subscription;
        setActiveMonth(res?.data?.subscription);
        setShowFree(!!subscription);
        if (subscription) await getDashboard();
        // else await getPlans();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActiveSubsLoading(false);
    }
  };

  useEffect(() => {
    getActiveSubscription();
    getPlans();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      <div
        className={`sm:px-6 px-5 sm:pt-4 pt-3 overflow-x-hidden ${!showDashboard && "h-screen overflow-y-hidden"}`}
      >
        {dashLoading || activeSubsLoading ? (
          <div className="flex items-center justify-center h-screen">
            <PageLoader />
          </div>
        ) : (
          <>
            {!showDashboard && (
              <>
                <div className="z-9999 backdrop-blur absolute -top-5 left-0 w-full h-full mt-5 rounded-2xl overflow-x-hidden flex items-center flex-col">
                  <nav className="flex justify-between items-center py-5 sm:pt-5 pt-4 w-full px-5">
                    <NavigationBar />
                  </nav>
                  {openPopup ? (
                    <div className="px-5">
                      <div className="relative transition-transform duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)] rounded-[28px] bg-black mb-5 light:bg-white border border-white/10 p-8 hide-scrollbar">
                        <div className="relative">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                            <span className="text-3xl">⚠️</span>
                          </div>
                          <h2 className="text-center text-2xl font-bold">
                            Activate Free Trial
                          </h2>
                          <p className="mt-3 text-center text-darkSubText">
                            This action can only be used once and cannot be
                            reversed.
                          </p>
                          <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                            <p className="text-sm font-semibold text-yellow-400">
                              Important
                            </p>
                            <p className="mt-3 text-sm leading-7 text-darkSubText">
                              Your free trial remains active only until the end
                              of the current month, regardless of the activation
                              date.
                            </p>
                            <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm text-gray-400">
                              <strong>Example:</strong>
                              <ul className="mt-2 space-y-2">
                                <li>
                                  • Activate on April 4 → valid until April 30
                                </li>
                                <li>
                                  • Activate on April 25 → valid until April 30
                                </li>
                              </ul>
                            </div>
                            <p className="mt-4 text-sm text-yellow-300">
                              For maximum benefit, activate near the beginning
                              of a month.
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="mt-8 flex gap-3">
                            <CustomButtonForm
                              type="cancel"
                              styling="w-1/2"
                              onClick={() => setOpenPopup(false)}
                            >
                              Cancel
                            </CustomButtonForm>
                            <CustomButtonForm
                              type="success"
                              styling="w-1/2"
                              onClick={() =>
                                handleSubscribe(plansList?.[0]?._id, 0)
                              }
                              disabled={freeTrialLoading}
                            >
                              {freeTrialLoading ? (
                                <CircleLoader />
                              ) : (
                                "Activate Trial"
                              )}
                            </CustomButtonForm>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mb-5">
                      <p className="sm:text-3xl text-2xl sm:mt-0 mt-5 mb-3 font-semibold text-center sm:px-0 px-5">
                        Oops! you don't have any active subscription.
                      </p>
                      <p className="sm:mb-5 mb-1 text-center sm:px-0 px-8">
                        To activate, please choose any active plan from the
                        following.
                      </p>
                      <div
                        className={`grid gap-3 ${showFree ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}
                      >
                        {plansList
                          .slice(0, showFree ? plans.length : 1)
                          .map((plan, i) => (
                            <div
                              key={i}
                              className="p-3 flex items-center justify-center w-full"
                            >
                              <div
                                key={i}
                                className="group relative overflow-hidden sm:w-auto w-[80%] rounded-[30px] border border-white/10 bg-black p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)]"
                              >
                                {/* Glow */}
                                <div
                                  className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl transition-all duration-500 ${i === 0 ? "bg-darkSuccess/15" : "bg-darkPrimary/15"}`}
                                />
                                <div className="absolute top-5 right-5 rounded-full border border-darkSuccess/30 bg-darkSuccess/10 px-3 py-1 text-xs font-semibold text-darkSuccess">
                                  ACTIVE
                                </div>

                                <div className="relative z-10">
                                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                                    Membership
                                  </p>
                                  <h3 className="mt-2 text-3xl font-bold">
                                    {plan?.planName}
                                  </h3>
                                  <div className="mt-6 flex items-end gap-1">
                                    <span className="text-5xl font-black">
                                      ₹{plan?.amount}
                                    </span>
                                  </div>
                                  <p className="mt-5 text-[15px] leading-7 text-darkSubText light:text-black">
                                    {plan?.description}
                                  </p>
                                  <div className="my-6 h-px bg-white/10" />
                                  <CustomButtonForm
                                    type="success"
                                    styling="w-1/2"
                                    onClick={() => setOpenPopup(true)}
                                  >
                                    Activate Plan
                                  </CustomButtonForm>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* extent plan popup */}
            <Popup open={openPlan} setOpen={setOpenPlan}>
              <p className="text-3xl my-3 font-semibold text-center">
                Select your Plan
              </p>
              <p className="mb-8 text-center">
                To activate, please choose any active plan from the following.
              </p>
              <div
                className={`flex overflow-x-auto hide-scrollbar gap-3 ${showFree ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}
              >
                {plansList.map((plan, i) => (
                  <div
                    key={i}
                    className="glass-card p-2 rounded-lg text-center"
                  >
                    <h3>{formattedText(plan?.planName)}</h3>
                    <p style={{ fontSize: "22px", margin: "10px 0" }}>
                      ₹{plan?.amount}
                    </p>
                    <p className="text-gray-400 text-[14px] mb-3.75 w-55">
                      {plan?.description}
                    </p>
                    <button
                      onClick={() => {
                        handleSubscribe(plan?._id, Number(plan?.amount));
                      }}
                      className={`mr-2.5 py-2 px-5 text-sm rounded-md border-none cursor-pointer bg-darkSuccess light:bg-lightSuccess text-black`}
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </Popup>

            <div className="flex sm:flex-row flex-col sm:items-center justify-between mt-3">
              <div className="flex flex-col">
                <h1 className="text-[32px] font-bold google-sans">
                  Hello, {username}
                </h1>
                <div className="mt-2 text-sm flex items-center gap-4">
                  <span
                    className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === "track" ? "text-darkText light:text-lightText" : "text-gray-500"}`}
                    onClick={() => setActiveTab("track")}
                  >
                    Monthly Habit
                  </span>
                  <span>|</span>
                  <span
                    className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === "analysis" ? "text-darkText light:text-lightText" : "text-gray-500"}`}
                    onClick={() => setActiveTab("analysis")}
                  >
                    Analysis
                  </span>
                  <span>|</span>
                  <span
                    className={`cursor-pointer hover:text-darkText light:hover:text-lightText ${activeTab === "history" ? "text-darkText light:text-lightText" : "text-gray-500"}`}
                    onClick={() => setActiveTab("history")}
                  >
                    History
                  </span>
                </div>
              </div>
              <div className="sm:flex hidden items-center gap-4">
                {/* <div className="bg-darkBox/50 light:bg-lightBox/50 rounded-lg gap-4 p-2 ps-4 items-end">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-gray-500">
                      {activeMonth?.status === "active" && 'Current Plan'}
                      {activeMonth?.status === "scheduled" && 'Scheduled'}
                    </span>
                    {activeSubsLoading ? (
                      <div className="w-45 h-5 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
                    ) : (
                      <span className="text-[14px]">{formatMonthYearSimple(activeMonth?.startDate)} - {formatMonthYearSimple(activeMonth?.endDate)}</span>
                    )}
                  </div>
                  {!activeSubsLoading && (
                    <button className="py-2 px-4 text-[14px] border-none rounded-md text-white cursor-pointer bg-darkSuccess light:bg-lightSuccess" onClick={() => setOpenPlan(true)}>
                      Extend Plan
                    </button>
                  )}
                </div> */}
                {/* <button
                  onClick={toggleTheme}
                  className="relative w-14 h-8 flex items-center bg-darkBox light:bg-lightBox rounded-full p-1 transition cursor-pointer"
                >
                  <div
                    className={`w-6 h-6 bg-darkCard light:bg-lightBg flex items-center justify-center text-darkText light:text-lightText rounded-full shadow-md transform transition ${isDark ? "translate-x-6" : "translate-x-0"
                      }`}
                  >
                    {isDark ? <IoMoon /> : <MdWbSunny className="text-yellow-500" />}
                  </div>
                </button> */}
                <CustomButton onClick={toggleTheme} type="transparent">
                  <div className="flex items-center gap-1">
                    {isDark ? <LuSunMoon /> : <LuSunMedium />}
                    <span className="sm:block hidden">
                      {isDark ? "Dark Theme" : "Light Theme"}
                    </span>
                  </div>
                </CustomButton>
                {/* <button className={`border-none py-1.5 min-w-24 min-h-8 flex items-center justify-center px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-md text-sm ${!logoutLoading && 'cursor-pointer'}`} onClick={handleLogout}>
                  {logoutLoading ? <CircleLoader /> : 'Logout'}
                </button> */}
                <IoSettingsSharp
                  className="cursor-pointer text-xl"
                  onClick={() => navigate("/settings")}
                />
                <IoMdLogOut
                  className="cursor-pointer text-xl"
                  title="Logout"
                  onClick={handleLogout}
                />
              </div>
            </div>

            {activeTab === "track" && (
              <TrackMainComponent
                dashboardData={dashboardData}
                taskList={taskList}
                setTaskList={setTaskList}
                activeMonth={activeMonth}
                setActiveMonth={setActiveMonth}
                setDashboardData={setDashboardData}
                log={log}
                setLog={setLog}
              />
            )}
            {activeTab === "analysis" && (
              <AnalysisMainComponent
                taskList={taskList}
                monthDashID={dashboardData?._id}
                log={log}
                setLog={setLog}
                todayDate={todayDate}
                setTodayDate={setTodayDate}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
