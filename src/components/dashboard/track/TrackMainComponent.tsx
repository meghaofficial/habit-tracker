import { useEffect, useState } from "react"
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import HabitSection from "./HabitSection";
import HabitProgress from "./HabitProgress";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import TargetsList from "./TargetsList";
import { WeeklyTargetsAccordion } from "./WeeklyTargetsAccordion";
import { motion } from "framer-motion";
import Calendar from "./calander/Calendar";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";
import type { ITask } from "../../../types";

const TrackMainComponent = () => {

  const [months, setMonths] = useState<string[]>([]);
  const [activeMon, setActiveMon] = useState<string | undefined>();
  const [activeYear, setActiveYear] = useState("");
  const [overallProgress, setOverallProgress] = useState<{ total: number, count: number, progress: string }>({ total: 0, count: 0, progress: "0" });
  const [taskList, setTaskList] = useState<ITask[]>([{ _id: "", name: "", taskData: [] }]);
  const [chartData, setChartData] = useState<{ firstDay: number, totalDays: number, overallDays: number }>({ firstDay: 0, totalDays: 0, overallDays: 0 });
  const year = "2026";
  const [monthlyNote, setMonthlyNote] = useState("");
  const [active, setActive] = useState<"dashboard" | "calendar">("dashboard");
  const [daywiseData, setDaywiseData] = useState<{ fullDate: string, count: number, total: number, progress: string }[]>([{ fullDate: "", count: 0, total: 0, progress: "0" }]);

  const monMap: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

  const getData = async () => {
    // setFreeTrialLoading(true);
    try {

      const res = await axiosPrivate.get(`/api/get-dashboard`);

      if (res?.data?.success) {
        const { data } = res.data;
        setMonths(data.month_year);
        setActiveMon(monMap[Number(data.month_year[0].split("-")[0])]);
        setActiveYear(data.month_year[0].split("-")[1]);
        setOverallProgress(data.overallProgress);
        setTaskList(data.taskList);
        setChartData({ firstDay: data.firstDay, totalDays: data.totalDays, overallDays: data.overallDays });
        setDaywiseData(data?.daywiseProgress || []);
      }

    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      // setFreeTrialLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="pb-5">
      {/* details */}
      <div className="flex gap-4 mt-6">
        <div className="bg-darkCard light:bg-lightCard rounded-2xl w-[80%] p-6 flex flex-col gap-3">
          <span className="text-3xl tracking-wider font-bold playfair-display">{activeMon}, {activeYear}</span>
          <div className="flex items-center justify-between">
            {/* months */}
            <div className="text-sm google-sans flex items-center gap-3 mt-3">
              {months?.map((mon, index) => (
                <button key={index} className={`px-4 py-2 rounded-full cursor-pointer hover:bg-darkPrimary light:hover:bg-lightPrimary ${activeMon === monMap[Number(mon.split("-")[index])] ? 'bg-darkPrimary light:bg-lightPrimary text-white' : 'bg-darkBox light:bg-lightBg'}`} onClick={() => setActiveMon(monMap[Number(mon.split("-")[index])])}>{monMap[Number(mon.split("-")[index])]}</button>
              ))}
            </div>
            {/* switch to calander */}
            <div className="flex justify-center google-sans -mb-5 -mr-2">
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
          </div>
        </div>
        {/* monthly progress */}
        <div className="bg-darkCard light:bg-lightCard rounded-2xl w-[20%] p-6">
          <ProgressPie value={Number(overallProgress?.progress)} type="track" />
        </div>
      </div>

      {/* MAIN CHART */}
      {active === "dashboard" ? (
        <>
          <div className="flex gap-4 mt-4">
            <div className="w-[20%]"></div>
            <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl h-25"></div>
            <div className="w-[15%]"></div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="bg-darkCard light:bg-lightCard w-[20%] rounded-2xl">
              <HabitSection data={taskList} />
            </div>
            <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl">
              <DailyCalanderTaskSheet taskList={taskList} setTaskList={setTaskList} metaData={chartData} daywiseData={daywiseData} setDaywiseData={setDaywiseData} />
            </div>
            <div className="bg-darkCard light:bg-lightCard w-[15%] rounded-2xl">
              {/* <HabitProgress rows={rows} month={month || ""} /> */}
            </div>
          </div>
          {/* monthly targets */}
          <div className="flex gap-4 mt-4">
            {/* note */}
            <div className="bg-darkCard light:bg-lightCard w-1/3 rounded-2xl p-2 h-100 overflow-y-auto">
              <p className="font-semibold text-lg px-5 py-3">Note for this Month</p>
              <div className="px-4">
                <textarea value={monthlyNote} onChange={(e) => setMonthlyNote(e.target.value)} className="outline-none bg-darkBox light:bg-lightBg resize-none rounded-xl px-3 py-2 text-[14px] w-full h-78" placeholder="Write something for this month for your motivation."></textarea>
              </div>
            </div>
            {/* monthly targets */}
            <div className="bg-darkCard light:bg-lightCard w-1/3 rounded-2xl p-2">
              <p className="font-semibold text-lg px-5 py-3">Monthly Targets</p>
              <TargetsList />
            </div>
            {/* gauge progress */}
            <div className="bg-darkCard light:bg-lightCard w-1/3 rounded-2xl">
              <p className="font-semibold text-lg px-5 pt-3">Your Monthly Targets Progress</p>
              <div className="relative left-10 top-10">
                <ProgressPie value={75} type="analysis" />
              </div>
            </div>
          </div>
          {/* weekly targets */}
          <WeeklyTargetsAccordion />
        </>
      ) : (
        <Calendar activeMon={activeMon} currYear={year} />
      )}
    </div>
  )
}

export default TrackMainComponent
