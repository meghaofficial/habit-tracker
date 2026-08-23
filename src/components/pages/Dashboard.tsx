import { useEffect, useState } from "react";
import AnalysisMainComponent from "../dashboard/analysis/AnalysisMainComponent";
import TrackMainComponent from "../dashboard/track/TrackMainComponent";
import { notify } from "../../helper";
import { axiosPrivate } from "../../api/axios";
import PageLoader from "../loaders/PageLoader";
import type { DashboardI, DateLogI, PlanI, SubscriptionI } from "../../types";
import NavigationBar from "../shared/NavigationBar";
import { useIsMobile } from "../hooks/mobileHook";
import HistoryMainComponent from "../dashboard/history/HistoryMainComponent";
import Fallback from "../shared/Fallback";
import AiCoachMainComponent from "../ai/AiCoachMainComponent";
import CalandarMainComponent from "../dashboard/calander/CalandarMainComponent";
import FreeSubsConfirm from "../dashboard/subscription/FreeSubsConfirm";
import SubsPlans from "../dashboard/subscription/SubsPlans";

const MASTER_MENU = [
  { key: "track", label: "Monthly Habit" },
  { key: "analysis", label: "Analysis" },
  { key: "calandar", label: "Calandar" },
  { key: "history", label: "History" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("track");
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
    totalTasks: 0,
    totalDays: 0,
    totalCount: 0,
    firstDay: 0,
  });
  const [openPlan, setOpenPlan] = useState(false);
  const [activeMonth, setActiveMonth] = useState<SubscriptionI | any>({});
  const [log, setLog] = useState<DateLogI>({
    _id: "",
    monthDashID: "",
    fullDate: new Date(),
    tasks: [],
    count: 0,
    progress: "0",
  });
  const [activeSubsLoading, setActiveSubsLoading] = useState(false);
  const [navMenu, setNavMenu] = useState(MASTER_MENU);
  const [fallback, setFallback] = useState(false);
  const isMobile = useIsMobile();

  const handleSubscribe = async (planID: string, amount: number) => {
    setFreeTrialLoading(true);
    try {
      const res = await axiosPrivate.post("/api/subscribe", { planID, amount });

      if (res?.data?.success) {
        notify.success(res?.data?.message);
        if (amount === 0) {
          setOpenPopup(false);
        } else {
          setOpenPlan(false);
        }
        setShowDashboard(true);
        await getActiveSubscription();
      }
    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      setFreeTrialLoading(false);
    }
  };

  const getPlans = async (showFree: boolean) => {
    try {
      const res = await axiosPrivate.get(
        `/api/get-plans?type=${showFree ? "free" : "paid"}`,
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
        setActiveMonth(subscription);
        const hasUsedFree = !res?.data?.hasUsedFree;
        setShowFree(!hasUsedFree);
        if (subscription) await getDashboard();
        if (!subscription) await getPlans(hasUsedFree);
      }
    } catch (error) {
      if ((error as any).response.status === 500) {
        setFallback(true);
      }
    } finally {
      setActiveSubsLoading(false);
    }
  };

  useEffect(() => {
    getActiveSubscription();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setNavMenu(MASTER_MENU.filter((item) => item.key !== "calandar"));
    } else {
      setNavMenu(MASTER_MENU);
    }
  }, [window.innerWidth]);

  return (
    <>
      {fallback ? (
        <Fallback />
      ) : (
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
                      <FreeSubsConfirm setOpenPopup={setOpenPopup} handleSubscribe={() => handleSubscribe(plansList?.[0]?._id, 0)} loading={freeTrialLoading} />
                    ) : (
                      <SubsPlans showFree={showFree} plansList={plansList} setOpenPopup={setOpenPopup} handleSubscribe={handleSubscribe} />
                    )}
                  </div>
                </>
              )}

              {/* extent plan popup */}
              {/* <Popup open={openPlan} setOpen={setOpenPlan}>
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
              </Popup> */}
              <nav className="flex justify-between items-center p-0 sm:mb-0 mb-7 sm:pt-5 pt-4 w-full">
                <NavigationBar />
              </nav>
              <div className="flex items-center justify-center w-full sm:mt-4">
                <div className="flex items-center gap-2 rounded-2xl sm:w-fit w-full border border-white/10 bg-black/20 light:border-black/10 p-1 backdrop-blur-xl light:bg-lightCard overflow-x-auto">
                  {navMenu.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-xl w-full text-nowrap sm:px-5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.key
                          ? "bg-darkPrimary light:bg-lightPrimary text-white shadow-lg"
                          : "text-gray-400 hover:text-white light:hover:text-black hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  {/* <button
                    onClick={() => setActiveTab("aiCoach")}
                    className={`rounded-xl w-full flex items-center gap-2 text-nowrap sm:px-5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === "aiCoach" ? "bg-darkPrimary light:bg-lightPrimary text-white shadow-lg" : "text-gray-400 hover:text-white light:hover:text-black hover:bg-white/5"}`}
                  >
                    <span>Ai Coach</span>
                    <LuSparkles />
                  </button> */}
                </div>
              </div>

              {activeTab === "track" && (
                <TrackMainComponent
                  dashboardData={dashboardData}
                  activeMonth={activeMonth}
                  log={log}
                  setLog={setLog}
                />
              )}
              {activeTab === "analysis" && (
                <AnalysisMainComponent monthDashID={dashboardData?._id} />
              )}
              {activeTab === "calandar" && <CalandarMainComponent />}
              {activeTab === "history" && (
                <HistoryMainComponent monthDashID={dashboardData?._id} />
              )}
              {activeTab === "aiCoach" && <AiCoachMainComponent />}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
