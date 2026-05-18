import { useEffect, useRef, useState } from "react"
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import HabitSection from "./HabitSection";
import HabitProgress from "./HabitProgress";
import TargetsList from "./TargetsList";
import { WeeklyTargetsAccordion } from "./WeeklyTargetsAccordion";
import { motion } from "framer-motion";
import MonthlyNote from "./MonthlyNote";
import { axiosPrivate } from "../../../api/axios";
import Calendar from "./calander/Calendar";
import { monMap } from "../../../staticData";

interface MonthsI { _id: string, planID: string, startDate: Date | string, endDate: Date | string, status: string }

function getInclusiveMonthCount(startDateISO: Date | string, endDateISO: Date | string) {
  const start = new Date(startDateISO);
  const end = new Date(endDateISO);
  const result = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    result.push(current.getMonth() + 1);
    current.setMonth(current.getMonth() + 1);
  }
  return result;
}

type Subscription = {
  _id: string;
  userID: string;
  planID: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const splitSubscriptionsByMonth = (
  subscriptions: Subscription[]
): Subscription[] => {
  const result: Subscription[] = [];

  for (const subscription of subscriptions) {
    const originalStart = new Date(subscription.startDate);
    const originalEnd = new Date(subscription.endDate);

    let currentYear = originalStart.getFullYear();
    let currentMonth = originalStart.getMonth();

    while (
      currentYear < originalEnd.getFullYear() ||
      (currentYear === originalEnd.getFullYear() &&
        currentMonth <= originalEnd.getMonth())
    ) {
      const isFirstMonth =
        currentYear === originalStart.getFullYear() &&
        currentMonth === originalStart.getMonth();

      const isLastMonth =
        currentYear === originalEnd.getFullYear() &&
        currentMonth === originalEnd.getMonth();

      let segmentStart: Date;
      let segmentEnd: Date;

      // START DATE
      if (isFirstMonth) {
        // preserve exact original start date/time
        segmentStart = new Date(originalStart);
      } else {
        // 1st day of month at 00:00:00
        segmentStart = new Date(
          currentYear,
          currentMonth,
          1,
          0,
          0,
          0,
          0
        );
      }

      // END DATE
      if (isLastMonth) {
        // preserve original end date/time
        segmentEnd = new Date(originalEnd);
      } else {
        // last day of month at 23:59:59.999
        segmentEnd = new Date(
          currentYear,
          currentMonth + 1,
          0,
          23,
          59,
          59,
          999
        );
      }

      result.push({
        ...subscription,
        startDate: segmentStart.toISOString(),
        endDate: segmentEnd.toISOString(),
      });

      // move to next month
      currentMonth++;

      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  }

  return result;
};

const TrackMainComponent = ({ dashboardData, taskList, activeMonth, setTaskList, setActiveMonth, setDashboardData }: {
  dashboardData: {
    _id: string;
    userID: string;
    month: number;
    year: number;
    totalDays: number;
    firstDay: number;
  },

  taskList: { _id: string, taskName: string }[],
  setTaskList: React.Dispatch<React.SetStateAction<{ _id: string, taskName: string }[]>>,
  setActiveMonth: React.Dispatch<React.SetStateAction<MonthsI>>,
  activeMonth: MonthsI,
  setDashboardData: React.Dispatch<React.SetStateAction<{
    _id: string;
    userID: string;
    month: number;
    year: number;
    totalDays: number;
    firstDay: number;
  }>>,
}) => {
  const [active, setActive] = useState<"dashboard" | "calendar">("dashboard");
  const [subsMonths, setSubsMonths] = useState<MonthsI[]>([]);
  const [progress, setProgress] = useState<{
    overallProgress: { total: number, count: number, progress: string | number },
    dateLogProgress: { fullDate: Date | string, count: number, progress: string | number }[],
    taskProgress: { id: string, count: number, progress: string | number }[]
  }>({
    overallProgress: { total: 0, count: 0, progress: 0 },
    dateLogProgress: [],
    taskProgress: []
  });

  const getDashboard = async (month: Date) => {
    // setDashLoading(true);
    try {
      const y = month.getFullYear();
      const m = month.getMonth();
      const res = await axiosPrivate.get(`/api/dashboard?year=${y}&month=${m}`);
      if (res?.data?.success) {
        setDashboardData(res?.data?.monthData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getAllSubscription = async () => {
    try {
      const res = await axiosPrivate.get("/api/all-subscriptions");
      if (res?.data?.success) {
        const s = res?.data?.subscriptions;
        const arr = splitSubscriptionsByMonth(s);
        setSubsMonths(arr);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const subsRef = useRef(false);

  useEffect(() => {
    if (subsRef.current) return;
    getAllSubscription();
    subsRef.current = true;
  }, []);

  return (
    <div className="py-5">
      {/* slider between dashboard & calander */}
      <div className="flex justify-end google-sans">
        <div className="relative flex bg-darkBox light:bg-lightBg rounded-full p-1 w-65">

          {/* Sliding Background */}
          <motion.div
            className="absolute top-1 bottom-1 w-1/2 bg-darkSuccess light:bg-lightSuccess rounded-full"
            animate={{
              x: active === "calendar" ? "94%" : "0%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Dashboard */}
          <button
            onClick={() => setActive("dashboard")}
            className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer`}
          >
            Dashboard
          </button>

          {/* Calendar */}
          <button
            onClick={() => setActive("calendar")}
            className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* MAIN CHART */}
      {active === "dashboard" ? (
        <>
          <div className="flex gap-4 mt-4">
            <div className="w-[20%]"></div>
            <div className="glass-card w-[65%] rounded-2xl h-25"></div>
            <div className="w-[15%]"></div>
          </div>
          <div className="flex gap-4 mt-4 relative">
            {/* left detail */}
            <div className="glass-card w-[19.5%] rounded-2xl overflow-x-hidden h-25 absolute -top-29 p-3 flex flex-col justify-between">
              <p className="text-3xl tracking-wider font-bold playfair-display text-center line-clamp-1" title={
                `${monMap?.[(new Date(activeMonth?.startDate)).getMonth() + 1]}, ${(new Date(activeMonth?.startDate)).getFullYear()}`
              }>
                {monMap?.[(new Date(activeMonth?.startDate)).getMonth() + 1]}, {(new Date(activeMonth?.startDate)).getFullYear()}
              </p>
              <div className="text-sm google-sans flex items-center gap-3 overflow-x-auto overflow-y-hidden hide-scrollbar">
                {subsMonths?.map((s, index) => (
                  <button key={index} className={`px-4 py-1 text-nowrap rounded-full cursor-pointer ${activeMonth?.startDate?.toString() === s?.startDate?.toString() && activeMonth?.endDate?.toString() === s?.endDate?.toString() ? 'bg-darkPrimary light:bg-lightPrimary text-white' : `border ${s?.status === "active" ? 'border-darkSuccess' : 'border-white/50'} hover:bg-darkBox/50 light:hover:bg-lightBox/50`}`}
                    onClick={() => {
                      getDashboard(new Date(s?.startDate));
                      setActiveMonth(s);
                    }}
                  >
                    {monMap[Number(getInclusiveMonthCount(s?.startDate, s?.endDate))]}
                    {(new Date(subsMonths?.[subsMonths?.length - 1]?.endDate)).getFullYear() !== (new Date(subsMonths?.[0]?.endDate)).getFullYear() ? (
                      <span>
                        {" "}{(new Date(s?.startDate)).getFullYear()}
                      </span>
                    ) : ""}
                  </button>
                ))}
              </div>
            </div>
            {/* right detail */}
            <div className="glass-card w-[14.5%] rounded-2xl overflow-x-hidden h-25 absolute -top-29 right-0 overflow-y-hidden">
              <ProgressPie value={Number.isNaN(Number(progress?.overallProgress?.progress)) ? 0 : Number(progress?.overallProgress?.progress)} type="" />
            </div>

            {/* below sections */}
            <div className="glass-card w-[20%] rounded-2xl overflow-x-hidden">
              <HabitSection taskList={taskList} />
            </div>
            <div className=" w-[65%] rounded-2xl relative">
              <DailyCalanderTaskSheet taskList={taskList} setTaskList={setTaskList} dashboardData={dashboardData} progress={progress} setProgress={setProgress} monthStatus={activeMonth?.status} />
            </div>
            <div className="glass-card w-[15%] rounded-2xl overflow-x-hidden">
              <HabitProgress progress={progress?.taskProgress} total={dashboardData?.totalDays} count={progress?.overallProgress.count} />
            </div>
          </div>
          {/* monthly targets */}
          <div className="flex gap-4 mt-4">
            {/* note */}
            <MonthlyNote monthID={dashboardData?._id} />
            {/* monthly targets */}
            <div className="glass-card w-1/3 rounded-2xl p-2">
              <p className="font-semibold text-lg px-5 py-3">Monthly Targets</p>
              <TargetsList type="monthly" monthID={dashboardData?._id} />
            </div>
            {/* gauge progress */}
            <div className="glass-card w-1/3 rounded-2xl">
              <p className="font-semibold text-lg px-5 pt-3">Your Monthly Targets Progress</p>
              <div className="relative left-10 top-10">
                <ProgressPie value={Number.isNaN(Number(progress?.overallProgress?.progress)) ? 0 : Number(progress?.overallProgress?.progress)} type="analysis" />
              </div>
            </div>
          </div>
          {/* weekly targets */}
          {/* <WeeklyTargetsAccordion monthID={dashboardData?._id} /> */}
        </>
      ) : (
        <Calendar month={(new Date(activeMonth?.startDate)).getMonth()} year={(new Date(activeMonth?.startDate)).getFullYear()} setActiveMonth={setActiveMonth} subsMonths={subsMonths} activeStartDate={activeMonth?.startDate?.toString()} />
      )}
    </div>
  )
}

export default TrackMainComponent
