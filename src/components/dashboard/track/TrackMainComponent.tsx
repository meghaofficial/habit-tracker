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
import type {
  DashboardI,
  DateLogI,
  DateLogProgressI,
  MonthsI,
  TaskI,
} from "../../../types";
import { useIsMobile } from "../../hooks/mobileHook";
import Card from "../../shared/Card";
import CustomButton from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import DonutGraph from "./DonutGraph";
import { type StreakI } from "../../../types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useQuery } from "@tanstack/react-query";
import { getDateLogs, getTasks } from "../../../api/dashboardApi";
import { TargetsSection } from "./DailyCalanderTaskSheet";

const TrackMainComponent = ({
  dashboardData,
  activeMonth,
  setTaskList,
  log,
  setLog,
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
  const isMobile = useIsMobile();
  const user = useSelector((state: RootState) => state.auth);

  const dateLogsData = useQuery({
    queryKey: ["date_logs", dashboardData?._id],
    queryFn: () => getDateLogs(dashboardData!._id),
    enabled: !!dashboardData?._id,
  });
  const taskListData = useQuery({
    queryKey: ["tasks", dashboardData?._id],
    queryFn: () => getTasks(dashboardData?._id),
    enabled: !!dashboardData?._id, // only when we want to trigger
  });
  const progress = dateLogsData.data?.progress;
  const taskList: TaskI[] = taskListData?.data?.tasks;

  const getTodayProgress = () => {
    const d = new Date();
    const custom = d.toISOString().split("T")[0];
    const matched = progress?.dateLogProgress?.find(
      (p: DateLogProgressI) => p.fullDate.toString().split("T")[0] === custom,
    );
    return {
      count: matched?.count,
      progress: matched?.progress,
    };
  };

  const totalD = dashboardData?.totalDays || 0;
  const hasWeek5 = totalD > 28;

  return (
    <div className="pb-5 pt-1">
      <div className="sm:flex hidden gap-4 mt-4 relative">
        {/* left detail */}
        <div className="bg-black/20 border border-white/10 w-[19.5%] backdrop-blur-2xl light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden absolute p-3 flex flex-col justify-between h-43">
          <div className="h-full flex flex-col justify-between">
            {/* User */}
            <div className="flex items-center gap-3 border-b border-white/10 light:border-black/10 pb-3">
              <div className="h-10 w-10 rounded-full border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 flex items-center justify-center">
                <span className="text-sm font-semibold uppercase playfair-display">
                  {user.username.slice(0, 1)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold playfair-display">
                  {user.username}
                </h2>
                <p className="truncate text-[10px] text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Plan */}
            <div className="flex items-center justify-between px-1 pt-2">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500">
                  {activeMonth?.status === "active"
                    ? "Current Plan"
                    : "Dashboard"}
                </p>

                <div className="mt-1 flex items-end gap-1">
                  <span className="text-4xl font-bold leading-none playfair-display">
                    {new Date().getDate()}
                  </span>

                  <span className="pb-0.5 text-sm text-gray-400">
                    {monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]}
                  </span>
                </div>
              </div>

              <div className="text-right text-[9px] space-y-1">
                <p>
                  <span className="text-gray-500">Start</span>
                  <br />
                  {formatMonthYearSimple(activeMonth?.startDate)}
                </p>

                <p>
                  <span className="text-gray-500">End</span>
                  <br />
                  {formatMonthYearSimple(activeMonth?.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* right detail */}
        <div className="bg-black/20 border border-white/10 w-[14.5%] backdrop-blur-2xl light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden h-43 absolute py-2 right-0 overflow-y-hidden flex flex-col justify-between">
          <div className="h-full flex flex-col justify-between">
            {/* Daily */}
            <div className="px-5 py-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Today
                </p>

                <span className="text-[9px] text-gray-500">
                  {Math.round(
                    ((getTodayProgress().count || 0) /
                      (taskList?.length || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>

              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-bold playfair-display">
                  {getTodayProgress().count || 0}
                </span>
                <span className="text-[11px] text-gray-500 mb-1">
                  / {taskList?.length || 0}
                </span>
              </div>

              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{
                    width: `${
                      taskList?.length
                        ? (getTodayProgress().count / taskList.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            {/* Monthly */}
            <div className="pt-2 pb-1 border-t border-white/10 px-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Month
                </p>
                <span className="text-[9px] text-gray-500">
                  {Math.round(
                    ((progress?.overallProgress?.count || 0) /
                      (progress?.overallProgress?.total || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>

              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-bold playfair-display">
                  {progress?.overallProgress?.count || 0}
                </span>
                <span className="text-[11px] text-gray-500 mb-1">
                  / {progress?.overallProgress?.total || 0}
                </span>
              </div>

              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      progress?.overallProgress?.total
                        ? (progress.overallProgress.count /
                            progress.overallProgress.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* below sections */}
        <div className="bg-black/20 border border-white/10 w-[20%] light:bg-lightCard light:border-lightBorder rounded-2xl overflow-x-hidden relative top-47 h-full">
          <HabitSection
            setTaskList={setTaskList}
            dashboardID={dashboardData?._id}
            loading={dateLogsData.isPending}
          />
        </div>
        <div className="w-[65%] rounded-2xl">
          <DailyCalanderTaskSheet
            dashboardData={dashboardData}
            monthStatus={activeMonth?.status}
          />
        </div>
        <div className="bg-black/20 border border-white/10 backdrop-blur-2xl light:border-lightBorder light:bg-lightCard w-[15%] rounded-2xl overflow-x-hidden relative top-47 h-full">
          <HabitProgress
            progress={progress?.taskProgress}
            total={dashboardData?.totalDays}
            count={progress?.overallProgress.count}
            loading={dateLogsData.isPending}
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
              // setProgress={setProgress}
            />
          </div>
        )}
        {dashboardData?._id && (
          <div className="flex gap-4 w-full">
            <div className="w-[70%]">
              <TargetsSection
                monthID={dashboardData._id}
                totalWeeks={hasWeek5 ? 5 : 4}
              />
            </div>
            <MonthlyNote monthID={dashboardData?._id} />
          </div>
        )}
        {/* <MonthlyNote monthID={dashboardData?._id} /> */}
        {/* <TargetsList type="monthly" monthID={dashboardData?._id} /> */}
        {/* <div className="sm:flex flex-col gap-4 hidden w-1/3">
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
        </div> */}
      </div>
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
  // setProgress,
}: {
  taskList: TaskI[];
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
  monthDashID: string;
  monthStatus: string;
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  // setProgress: React.Dispatch<
  //   React.SetStateAction<{
  //     overallProgress: OverallProgressI;
  //     dateLogProgress: DateLogProgressI[];
  //     taskProgress: TaskProgressI[];
  //   }>
  // >;
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
        // setProgress(res?.data?.progress);
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
              // setProgress={setProgress}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default TrackMainComponent;
