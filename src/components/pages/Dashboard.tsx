import { useEffect, useState } from "react";
import AnalysisMainComponent from "../dashboard/analysis/AnalysisMainComponent";
import TrackMainComponent from "../dashboard/track/TrackMainComponent";
import { formattedText, notify } from "../../helper";
import { axiosPrivate } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import Popup from "../shared/Popup";
import PageLoader from "../loaders/PageLoader";
import type { DashboardI, DateLogI, PlanI, SubscriptionI } from "../../types";
import { CustomButtonForm } from "../shared/CutomButton";
import NavigationBar from "../shared/NavigationBar";
import { useIsMobile } from "../hooks/mobileHook";
import HistoryMainComponent from "../dashboard/history/HistoryMainComponent";
import Fallback from "../shared/Fallback";
import { LuSparkles } from "react-icons/lu";
import AiCoachMainComponent from "../ai/AiCoachMainComponent";
import CalandarMainComponent from "../dashboard/calander/CalandarMainComponent"

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
    totalDays: 0,
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
                                Your free trial remains active only until the
                                end of the current month, regardless of the
                                activation date.
                              </p>
                              <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm text-gray-400">
                                <strong>Example:</strong>
                                <ul className="mt-2 space-y-2">
                                  <li>
                                    • Activate on April 4 → valid until April 30
                                  </li>
                                  <li>
                                    • Activate on April 25 → valid until April
                                    30
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
                          className={`grid gap-3 ${showFree ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
                        >
                          {plansList.map((plan, i) => (
                            <div
                              key={i}
                              className="p-3 flex items-center justify-center w-full"
                            >
                              <div
                                key={i}
                                className="group relative overflow-hidden w-full max-w-100 rounded-[30px] border border-white/10 bg-black p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)]"
                              >
                                <div className="relative z-10">
                                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                                    Membership
                                  </p>
                                  <h3 className="mt-2 text-3xl font-bold">
                                    {formattedText(plan?.planName)}
                                  </h3>
                                  <div className="mt-6 flex items-end gap-1">
                                    <span className="text-5xl font-black">
                                      ₹{plan?.amount}
                                    </span>
                                    <span className="text-gray-500 text-[12px]">
                                      Full Amount
                                    </span>
                                  </div>
                                  <p className="mt-5 text-[15px] leading-7 text-darkSubText light:text-black">
                                    {plan?.description}
                                  </p>
                                  <div className="my-6 h-px bg-white/10" />
                                  <CustomButtonForm
                                    type="success"
                                    styling="w-1/2"
                                    onClick={() => {
                                      if (plansList.length > 1) {
                                        handleSubscribe(
                                          plan?._id,
                                          plan?.amount,
                                        );
                                      } else setOpenPopup(true);
                                    }}
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
                  <button
                    onClick={() => setActiveTab("aiCoach")}
                    className={`rounded-xl w-full flex items-center gap-2 text-nowrap sm:px-5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === "aiCoach" ? "bg-darkPrimary light:bg-lightPrimary text-white shadow-lg" : "text-gray-400 hover:text-white light:hover:text-black hover:bg-white/5"}`}
                  >
                    <span>Ai Coach</span>
                    <LuSparkles />
                  </button>
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
              {activeTab === "history" && <HistoryMainComponent monthDashID={dashboardData?._id} />}
              {activeTab === "aiCoach" && <AiCoachMainComponent />}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
