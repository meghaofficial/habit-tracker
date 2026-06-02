import { useRef, useState } from "react";
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import HabitSection from "./HabitSection";
import HabitProgress from "./HabitProgress";
import TargetsList from "./TargetsList";
import MonthlyNote from "./MonthlyNote";
import { axiosPrivate } from "../../../api/axios";
import Calendar from "./calander/Calendar";
import { monMap } from "../../../staticData";
import TodayAllTasks from "../../charts/TodayAllTasks";
import {
  formatDateString2,
  formatMonthYearSimple,
  splitSubscriptionsByMonth,
} from "../../../helper";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import type { DateLogI, MonthsI } from "../../../types";

function getInclusiveMonthCount(
  startDateISO: Date | string,
  endDateISO: Date | string,
) {
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

const TrackMainComponent = ({
  dashboardData,
  taskList,
  activeMonth,
  setTaskList,
  setActiveMonth,
  setDashboardData,
  log,
  setLog,
}: {
  dashboardData: {
    _id: string;
    userID: string;
    month: number;
    year: number;
    totalDays: number;
    firstDay: number;
  };

  taskList: { _id: string; taskName: string; monthDashID: string }[];
  setTaskList: React.Dispatch<
    React.SetStateAction<
      { _id: string; taskName: string; monthDashID: string }[]
    >
  >;
  setActiveMonth: React.Dispatch<React.SetStateAction<MonthsI>>;
  activeMonth: MonthsI;
  setDashboardData: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      userID: string;
      month: number;
      year: number;
      totalDays: number;
      firstDay: number;
    }>
  >;
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  // todayDate: string
}) => {
  const [active, setActive] = useState<"dashboard" | "calendar">("dashboard");
  const [subsMonths, setSubsMonths] = useState<MonthsI[]>([]);
  const [progress, setProgress] = useState<{
    overallProgress: {
      total: number;
      count: number;
      progress: string | number;
    };
    dateLogProgress: {
      fullDate: Date | string;
      count: number;
      progress: string | number;
    }[];
    taskProgress: { id: string; count: number; progress: string | number }[];
  }>({
    overallProgress: { total: 0, count: 0, progress: 0 },
    dateLogProgress: [],
    taskProgress: [],
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
  };

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
  };

  const subsRef = useRef(false);

  // useEffect(() => {
  //   if (subsRef.current) return;
  //   getAllSubscription();
  //   subsRef.current = true;
  // }, []);

  // For task list sm screen
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayDate, setTodayDate] = useState(new Date());

  const [logLoading, setLogLoading] = useState(false);
  const getLog = async (date: Date) => {
    setLogLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/get-log-date?monthDashID=${taskList?.[0]?.monthDashID}&fullDate=${getMidnightISO(date)}`,
      );

      if (res?.data?.success) {
        setLog(res?.data?.dateLog);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLogLoading(false);
    }
  };

  function getMidnightISO(date: Date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate.toISOString();
  }
  const handlePrevDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);

    setSelectedDate(prev);
    getLog(prev);
  };
  const handleNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);

    setSelectedDate(next);
    getLog(next);
  };

  return (
    <div className="py-5">
      {/* slider between dashboard & calander */}
      {/* <div className="flex justify-end google-sans pr-15">
        <div className="relative flex bg-darkBox light:bg-lightBg rounded-full p-1 w-65">
          <motion.div
            className="absolute top-1 bottom-1 w-1/2 bg-darkSuccess light:bg-lightSuccess rounded-full"
            animate={{
              x: active === "calendar" ? "94%" : "0%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <button
            onClick={() => setActive("dashboard")}
            className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActive("calendar")}
            className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition cursor-pointer`}
          >
            Calendar
          </button>
        </div>
      </div> */}

      {/* MAIN CHART */}
      {active === "dashboard" ? (
        <>
          <div className="sm:flex hidden gap-4 mt-4">
            <div className="w-[20%]"></div>
            <div className="bg-black/20 border border-white/10 w-[65%] rounded-2xl h-25"></div>
            <div className="w-[15%]"></div>
          </div>
          <div className="sm:flex hidden gap-4 mt-4 relative">
            {/* left detail */}
            <div className="bg-black/20 border border-white/10 w-[19.5%] backdrop-blur-2xl light:bg-lightCard rounded-2xl overflow-x-hidden h-25 absolute -top-29 p-3 flex flex-col justify-between">
              <p
                className="text-3xl tracking-wider font-bold playfair-display px-3 line-clamp-1"
                title={`${monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]}, ${new Date(activeMonth?.startDate).getFullYear()}`}
              >
                {monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]},{" "}
                {new Date(activeMonth?.startDate).getFullYear()}
              </p>
              <div className="flex flex-col items-start px-3">
                <span className="text-[10px] text-gray-500">
                  {activeMonth?.status === "active" && "Current Plan"}
                  {activeMonth?.status === "scheduled" && "Scheduled"}
                </span>
                <span className="text-[10px] tracking-wider">
                  {formatMonthYearSimple(activeMonth?.startDate)} -{" "}
                  {formatMonthYearSimple(activeMonth?.endDate)}
                </span>
                {/* {activeSubsLoading ? (
                      <div className="w-45 h-5 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
                    ) : (
                      <span className="text-[14px]">{formatMonthYearSimple(activeMonth?.startDate)} - {formatMonthYearSimple(activeMonth?.endDate)}</span>
                    )} */}
              </div>
              {/* <div className="text-sm google-sans flex items-center gap-3 overflow-x-auto overflow-y-hidden hide-scrollbar">
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
              </div> */}
            </div>
            {/* right detail */}
            <div className="bg-black/20 border border-white/10 w-[14.5%] backdrop-blur-2xl light:bg-lightCard rounded-2xl overflow-x-hidden h-25 absolute -top-29 right-0 overflow-y-hidden">
              <ProgressPie
                value={
                  Number.isNaN(Number(progress?.overallProgress?.progress))
                    ? 0
                    : Number(progress?.overallProgress?.progress)
                }
                type=""
              />
            </div>

            {/* below sections */}
            <div className="bg-black/20 border border-white/10 w-[20%] backdrop-blur-2xl light:bg-lightCard rounded-2xl overflow-x-hidden">
              <HabitSection taskList={taskList} />
            </div>
            <div className=" w-[65%] rounded-2xl relative">
              <DailyCalanderTaskSheet
                taskList={taskList}
                setTaskList={setTaskList}
                dashboardData={dashboardData}
                progress={progress}
                setProgress={setProgress}
                monthStatus={activeMonth?.status}
              />
            </div>
            <div className="bg-black/20 border border-white/10 backdrop-blur-2xl light:bg-lightCard w-[15%] rounded-2xl overflow-x-hidden">
              <HabitProgress
                progress={progress?.taskProgress}
                total={dashboardData?.totalDays}
                count={progress?.overallProgress.count}
              />
            </div>
          </div>
          {/* sm screen */}
          <div className="sm:hidden flex items-center justify-between">
            <p className="google-sans text-[25px] bg-darkPrimary/50 font-bold p-2 w-full rounded-lg">
              {formatDateString2(todayDate)}
            </p>
          </div>
          {/* monthly targets */}
          <div className="flex sm:flex-row flex-col gap-4 mt-4">
            {/* for sm screen */}
            <div className="bg-black/20 rounded-2xl sm:hidden">
              <div className="flex items-center justify-between py-3">
                <div className="px-5">
                  <p className="font-semibold text-lg">Todays Tasks</p>
                  {logLoading ? (
                    <div className="w-20 h-4 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
                  ) : (
                    <p className="text-gray-500 mt-1 text-[10px] cursor-default">
                      {formatDateString2(selectedDate.toString())}
                    </p>
                  )}
                </div>
                {!logLoading && (
                  <div className="px-5 flex items-center gap-2">
                    <button onClick={handlePrevDate}>
                      <IoIosArrowRoundBack size={20} />
                    </button>
                    <button onClick={handleNextDate}>
                      <IoIosArrowRoundForward size={20} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                {logLoading ? (
                  <div className="flex flex-col gap-2 w-full px-5 pb-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-full h-8 mt-1 rounded bg-gray-500/50 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <TodayAllTasks
                    taskList={taskList}
                    log={log}
                    setLog={setLog}
                  />
                )}
              </div>
            </div>
            <MonthlyNote monthID={dashboardData?._id} />
            <TargetsList type="monthly" monthID={dashboardData?._id} />
            <div className="bg-black/20 backdrop-blur-2xl light:bg-lightCard w-1/3 rounded-2xl sm:block hidden border border-white/10">
              <p className="font-semibold text-lg px-5 pt-3">
                Your Monthly Targets Progress
              </p>
              <div className="relative left-10 top-10">
                <ProgressPie
                  value={
                    Number.isNaN(Number(progress?.overallProgress?.progress))
                      ? 0
                      : Number(progress?.overallProgress?.progress)
                  }
                  type="analysis"
                />
              </div>
            </div>
          </div>
          {/* weekly targets */}
          {/* <WeeklyTargetsAccordion monthID={dashboardData?._id} /> */}
        </>
      ) : (
        <Calendar
          month={new Date(activeMonth?.startDate).getMonth()}
          year={new Date(activeMonth?.startDate).getFullYear()}
          setActiveMonth={setActiveMonth}
          subsMonths={subsMonths}
          activeStartDate={activeMonth?.startDate?.toString()}
        />
      )}
    </div>
  );
};

export default TrackMainComponent;
