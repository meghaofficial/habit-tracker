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
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
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

const TrackMainComponent = ({
  dashboardData,
  taskList,
  activeMonth,
  setTaskList,
  log,
  setLog,
}: {
  dashboardData: DashboardI;
  taskList: TaskI[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskI[]>>;
  activeMonth: MonthsI;
  log: DateLogI;
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>;
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
  const isMobile = useIsMobile();

  return (
    <div className="pb-5 pt-1">
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
          >
            {new Date().getDate()},
            {monMap?.[new Date(activeMonth?.startDate).getMonth() + 1]}
            {/* {new Date(activeMonth?.startDate).getFullYear()} */}
          </p>
          <div className="flex flex-col items-start px-3">
            <span className="text-[10px] text-gray-500">
              {activeMonth?.status === "active" && "Current Plan"}
            </span>
            <span className="text-[10px] tracking-wider">
              {formatMonthYearSimple(activeMonth?.startDate)} -{" "}
              {formatMonthYearSimple(activeMonth?.endDate)}
            </span>
          </div>
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
          <HabitSection taskList={taskList} setTaskList={setTaskList} />
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
      <div className="sm:hidden mt-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-2xl">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-darkPrimary/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Today
              </p>

              <p className="google-sans mt-1 text-xl font-bold">
                {formatDateString2(new Date())}
              </p>
            </div>
            <div>
              <DonutGraph
                percentage={
                  Number.isNaN(Number(progress?.overallProgress?.progress))
                    ? 0
                    : Number(progress?.overallProgress?.progress)
                }
                size={50}
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

  useEffect(() => {
    if (!monthDashID) return;
    if (selectedDate.getDate() === new Date().getDate())
      setHeading("Todays Tasks");
    else setHeading("Other's Day Tasks");
    getLog(new Date());
  }, [selectedDate]);

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
          {!logLoading && (
            <div className="flex items-center gap-2 relative">
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
