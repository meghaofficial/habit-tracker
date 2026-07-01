import { useEffect, useState } from "react";
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import HabitSection from "./HabitSection";
import HabitProgress from "./HabitProgress";
import TargetsList from "./TargetsList";
import MonthlyNote from "./MonthlyNote";
import { axiosPrivate } from "../../../api/axios";
import { monMap } from "../../../staticData";
import TodayAllTasks from "../../charts/TodayAllTasks";
import { formatDateString2, formatMonthYearSimple } from "../../../helper";
// import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import type {
  DashboardI,
  DateLogI,
  DateLogProgressI,
  MonthsI,
  OverallProgressI,
  TaskI,
  TaskProgressI,
} from "../../../types";
import { useIsMobile } from "../../hooks/mobileHook";
import Card from "../../shared/Card";
import CustomButton from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import DonutGraph from "./DonutGraph";
import { type StreakI } from "../../../types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";

const TrackMainComponent = ({
  dashboardData,
  taskList,
  activeMonth,
  setTaskList,
  log,
  setLog,
  streakData,
  dateLogs,
  setDateLogs,
}: {
  dashboardData: DashboardI;
  taskList: TaskI[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  activeMonth: MonthsI;
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  streakData: StreakI;
  dateLogs: DateLogI[];
  setDateLogs: React.Dispatch<React.SetStateAction<DateLogI[]>>;
}) => {
  const [progress, setProgress] = useState<{
    overallProgress: OverallProgressI;
    dateLogProgress: DateLogProgressI[];
    taskProgress: TaskProgressI[];
  }>({
    overallProgress: { total: 0, count: 0, progress: 0 },
    dateLogProgress: [],
    taskProgress: [],
  });
  const [getLogLoading, setGetLogLoading] = useState(false);
  const isMobile = useIsMobile();
  const user = useSelector((state: RootState) => state.auth);

  const getTodayProgress = () => {
    const d = new Date();
    const custom = d.toISOString().split("T")[0];
    const matched = progress.dateLogProgress.find(
      (p: DateLogProgressI) => p.fullDate.toString().split("T")[0] === custom,
    );
    return {
      count: matched?.count,
      progress: matched?.progress,
    };
  };

  return (
    <div className="pb-5 pt-1">
      <div className="sm:flex hidden gap-4 mt-4">
        <div className="w-[20%]"></div>
        <div className="bg-black/20 border border-white/10 light:border-lightBorder light:bg-lightCard w-[65%] rounded-2xl h-25"></div>
        <div className="w-[15%]"></div>
      </div>
      <div className="sm:flex hidden gap-4 mt-4 relative">
        {/* left detail */}
        <div className="bg-black/20 border border-white/10 w-[19.5%] backdrop-blur-2xl light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden h-25 absolute -top-29 p-3 flex flex-col justify-between">
          <div className="flex gap-4">
            <div className="border border-white/10 light:border-black/10 rounded-full h-10 w-10 flex items-center justify-center">
              <div className="h-9 w-9 border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 rounded-full flex items-center justify-center uppercase">
                {user.username.slice(0, 1)}
              </div>
            </div>
            <div>
              <p className="font-bold playfair-display">
                Hello, <br /> {user.username}
              </p>
              <span className="text-[10px] text-gray-500">{user.email}</span>
            </div>
          </div>
          {/* <p className="text-3xl tracking-wider font-bold playfair-display px-3 line-clamp-1">
            {new Date().getDate()},
            {monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]}
          </p>
          <div className="flex flex-col items-start px-3">
            <span className="text-[10px] text-gray-500">
              {activeMonth?.status === "active" && "Current Plan"}
            </span>
            <span className="text-[10px] tracking-wider">
              {formatMonthYearSimple(activeMonth?.startDate)} -{" "}
              {formatMonthYearSimple(activeMonth?.endDate)}
            </span>
          </div> */}
        </div>
        {/* right detail */}
        <div className="bg-black/20 border border-white/10 w-[14.5%] backdrop-blur-2xl light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden h-25 absolute -top-29 py-2 right-0 overflow-y-hidden flex flex-col justify-between">
          <p className="text-2xl tracking-wider font-bold playfair-display px-3 line-clamp-1">
            {new Date().getDate()},
            {monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]}
          </p>
          <div className="flex flex-col items-start px-3">
            <span className="text-[10px] text-gray-500">
              {activeMonth?.status === "active" && "Current Plan"}
            </span>
            <p className="text-[9px] mt-0.5 tracking-wider text-nowrap">
              <span className="text-gray-500">Started at -</span>{" "}
              {formatMonthYearSimple(activeMonth?.startDate)}
            </p>
            <p className="text-[9px] tracking-wider text-nowrap">
              <span className="text-gray-500">Ended at&nbsp; -</span>{" "}
              {formatMonthYearSimple(activeMonth?.endDate)}
            </p>
          </div>
        </div>

        {/* below sections */}
        <div className="bg-black/20 border border-white/10 w-[20%] light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden">
          <HabitSection
            taskList={taskList}
            setTaskList={setTaskList}
            getLogLoading={getLogLoading}
          />
        </div>
        <div className="w-[65%] rounded-2xl relative">
          <DailyCalanderTaskSheet
            taskList={taskList}
            setTaskList={setTaskList}
            dashboardData={dashboardData}
            progress={progress}
            setProgress={setProgress}
            monthStatus={activeMonth?.status}
            getLogLoading={getLogLoading}
            setGetLogLoading={setGetLogLoading}
            dateLogs={dateLogs}
            setDateLogs={setDateLogs}
          />
        </div>
        <div className="bg-black/20 border border-white/10 backdrop-blur-2xl light:border-lightBorder light:bg-lightCard w-[15%] rounded-2xl overflow-x-hidden">
          <HabitProgress
            progress={progress?.taskProgress}
            total={dashboardData?.totalDays}
            count={progress?.overallProgress.count}
            getLogLoading={getLogLoading}
          />
        </div>
      </div>
      {/* sm screen */}
      <div className="sm:hidden mt-3">
        <div className="relative mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 h-20 light:bg-lightCard light:border-lightBorder flex items-center gap-4 ps-4">
          <div className="h-9 w-9 border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 rounded-full flex items-center justify-center uppercase">
            {user.username.slice(0, 1)}
          </div>
          <div>
            <p className="google-sans text-xl font-bold">{user.username}</p>
            <p className="text-xs mt-1 text-gray-500">{user?.email}</p>
          </div>
          {/* <p className="text-xs text-gray-500">Today</p>
          <p className="google-sans mt-1 text-xl font-bold">
            {formatDateString2(new Date())}
          </p> */}
        </div>
        {/* overall & todays progress */}
        <div className="flex items-center gap-2">
          {/* todays progress */}
          <div className="relative mt-2 w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/20 h-20 light:bg-lightCard light:border-lightBorder flex">
            <div className="">
              <p className="text-[10px] text-nowrap absolute top-3 left-3 text-gray-500">
                Daily View
              </p>
              <p className="text-[20px] font-bold absolute bottom-3 left-3 tracking-widest">
                {getTodayProgress().count}/{taskList?.length}
              </p>
            </div>
            <div className="absolute right-3 bottom-3">
              <DonutGraph
                percentage={
                  Number.isNaN(Number(getTodayProgress().progress))
                    ? 0
                    : Number(getTodayProgress().progress)
                }
                size={30}
                textSize={10}
              />
            </div>
          </div>
          {/* overall progress */}
          <div className="relative mt-2 w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/20 h-20 light:bg-lightCard light:border-lightBorder flex">
            <div className="">
              <p className="text-[10px] text-nowrap absolute top-3 left-3 text-gray-500">
                Monthly View
              </p>
              <p className="text-[20px] font-bold absolute bottom-3 left-3">
                {progress?.overallProgress?.count}/
                {progress?.overallProgress?.total}
              </p>
            </div>
            <div className="absolute right-3 bottom-3">
              <DonutGraph
                percentage={
                  Number.isNaN(Number(progress?.overallProgress?.progress))
                    ? 0
                    : Number(progress?.overallProgress?.progress)
                }
                size={30}
                textSize={10}
              />
            </div>
          </div>
        </div>
      </div>
      {/* monthly targets */}
      <div className="flex sm:flex-row flex-col gap-4 mt-4">
        {/* for sm screen */}
        {isMobile && (
          <div className="bg-black/20 rounded-2xl sm:hidden">
            <TodayTasksSmScreen
              taskList={taskList}
              log={log}
              setLog={setLog}
              monthDashID={dashboardData?._id}
              monthStatus={activeMonth?.status}
              setTaskList={setTaskList}
              setProgress={setProgress}
            />
          </div>
        )}
        <MonthlyNote monthID={dashboardData?._id} />
        <TargetsList type="monthly" monthID={dashboardData?._id} />
        <div className="sm:flex flex-col gap-4 hidden w-1/3">
          <Card
            heading="Daily View"
            subHeading="Your productivity breakdown for today."
            bodyHeight="h-40"
          >
            <div className="flex items-center justify-center">
              <p className="text-[40px] font-bold tracking-widest w-full text-center playfair-display">
                {getTodayProgress().count || 0}/{taskList?.length}
              </p>
              <div className="w-full">
                <ProgressPie
                  value={
                    Number.isNaN(Number(getTodayProgress().progress))
                      ? 0
                      : Number(getTodayProgress().progress)
                  }
                  type="analysis"
                />
              </div>
            </div>
          </Card>
          <Card
            heading="Monthly View"
            subHeading="Your cumulative performance this month."
            bodyHeight="h-40"
          >
            <div className="flex items-center justify-center">
              <p className="text-[40px] font-bold tracking-widest w-full text-center playfair-display">
                {progress?.overallProgress?.count}/
                {progress?.overallProgress?.total}
              </p>
              <div className="w-full">
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
          </Card>
        </div>
      </div>
      {/* weekly targets */}
      {/* <WeeklyTargetsAccordion monthID={dashboardData?._id} /> */}
    </div>
  );
};

export const TodayTasksSmScreen = ({
  taskList,
  log,
  setLog,
  monthDashID,
  monthStatus,
  setTaskList,
  setProgress,
}: {
  taskList: TaskI[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
  monthStatus: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  setProgress: React.Dispatch<
    React.SetStateAction<{
      overallProgress: OverallProgressI;
      dateLogProgress: DateLogProgressI[];
      taskProgress: TaskProgressI[];
    }>
  >;
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logLoading, setLogLoading] = useState(false);
  const [heading, setHeading] = useState("Todays Tasks");
  const [addRowLoading, setAddRowLoading] = useState<boolean>(false);

  const getLog = async (date: Date) => {
    setLogLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/get-log-date?monthDashID=${monthDashID}&fullDate=${getMidnightISO(date)}`,
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
  // const handlePrevDate = () => {
  //   const prev = new Date(selectedDate);
  //   prev.setDate(prev.getDate() - 1);
  //   setSelectedDate(prev);
  //   getLog(prev);
  // };
  // const handleNextDate = () => {
  //   const next = new Date(selectedDate);
  //   next.setDate(next.getDate() + 1);
  //   setSelectedDate(next);
  //   getLog(next);
  // };

  useEffect(() => {
    if (!monthDashID) return;
    if (selectedDate.getDate() === new Date().getDate())
      setHeading("Todays Tasks");
    else setHeading("Other's Day Tasks");
  }, [selectedDate]);

  useEffect(() => {
    getLog(new Date());
  }, []);

  const handleAddRow = async () => {
    if (monthStatus === "scheduled") {
      alert(
        "Can not add task as the subscription for this month is not active",
      );
      return;
    }
    if (taskList?.length >= 10) {
      alert("Can't add more than 10 Tasks");
      return;
    }
    setAddRowLoading(true);
    try {
      const res = await axiosPrivate.post(
        `/api/task?monthDashID=${monthDashID}`,
        { taskName: "" },
      );
      if (res?.data?.success) {
        setTaskList(res?.data?.tasks);
        setProgress(res?.data?.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddRowLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Card heading={heading}>
        <div className="absolute right-5 top-5 z-9999">
          <CustomButton type="transparent" onClick={handleAddRow}>
            {addRowLoading ? (
              <p className="px-3">
                <CircleLoader className="h-4 w-4" />
              </p>
            ) : (
              "Add Task"
            )}
          </CustomButton>
        </div>
        <div className="flex items-center justify-between pb-3 pt-2">
          {logLoading ? (
            <div className="w-20 h-4 mt-1 rounded bg-gray-500/50 animate-pulse"></div>
          ) : (
            <p className="text-gray-500 mt-1 text-[10px] cursor-default">
              {formatDateString2(selectedDate.toString())}
            </p>
          )}
          {/* {!logLoading && (
            <div className="flex items-center gap-2 relative">
              <button onClick={handlePrevDate}>
                <IoIosArrowRoundBack size={20} />
              </button>
              <button onClick={handleNextDate}>
                <IoIosArrowRoundForward size={20} />
              </button>
            </div>
          )} */}
        </div>
        <div className="flex items-center justify-center">
          {logLoading ? (
            <div className="flex flex-col gap-2 w-full pb-5">
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
              monthDashID={monthDashID}
              setTaskList={setTaskList}
              setProgress={setProgress}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default TrackMainComponent;
