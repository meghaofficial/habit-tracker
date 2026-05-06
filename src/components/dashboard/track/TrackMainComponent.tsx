import { useState } from "react"
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import HabitSection from "./HabitSection";
import HabitProgress from "./HabitProgress";
import TargetsList from "./TargetsList";
import { WeeklyTargetsAccordion } from "./WeeklyTargetsAccordion";
import { motion } from "framer-motion";
import Calendar from "./calander/Calendar";
import type { ITask } from "../../../types";

const TrackMainComponent = ({ dashboardData, totalMonths }: {
  dashboardData: {
    _id: string;
    userID: string;
    month: number;
    year: number;
    totalDays: number;
    firstDay: number;
  },
  totalMonths: number[]
}) => {

  const [activeMon, setActiveMon] = useState<number | null>(null);
  const selectedMonth =
    activeMon && totalMonths.includes(activeMon)
      ? activeMon
      : totalMonths[0];
  const year = "2026";
  const [active, setActive] = useState<"dashboard" | "calendar">("dashboard");


  const [taskList, setTaskList] = useState<string[]>([]);
  const [daywiseData, setDaywiseData] = useState<{ fullDate: string, count: number, progress: string, _id: string }[]>([{ fullDate: "", count: 0, progress: "0", _id: "" }]);
  // const [monthlyNote, setMonthlyNote] = useState("");
  // const [currMon, setCurrMon] = useState<number>(-1);
  // const [currYear, setCurrYear] = useState<number>(-1);


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

  return (
    <div className="pb-5">
      {/* details */}
      <div className="flex gap-4 mt-6">
        <div className="bg-darkCard light:bg-lightCard rounded-2xl w-[80%] p-6 flex flex-col gap-3">
          <span className="text-3xl tracking-wider font-bold playfair-display">{monMap?.[dashboardData?.month]}, {dashboardData?.year}</span>
          <div className="flex items-center justify-between">
            {/* months */}
            <div className="text-sm google-sans flex items-center gap-3 mt-3">
              {totalMonths?.map((mon, index) => (
                <button key={index} className={`px-4 py-2 rounded-full cursor-pointer hover:bg-darkPrimary light:hover:bg-lightPrimary ${selectedMonth === mon ? 'bg-darkPrimary light:bg-lightPrimary text-white' : 'bg-darkBox light:bg-lightBg'}`}
                  onClick={() => setActiveMon(mon)}
                >
                  {monMap[mon]}
                </button>
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
          {/* <ProgressPie value={Number(overallProgress?.progress)} type="track" /> */}
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
              <HabitSection taskList={taskList} />
            </div>
            <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl">
              <DailyCalanderTaskSheet taskList={taskList} setTaskList={setTaskList} daywiseData={daywiseData} setDaywiseData={setDaywiseData} dashboardData={dashboardData} />
            </div>
            <div className="bg-darkCard light:bg-lightCard w-[15%] rounded-2xl">
              {/* <HabitProgress taskList={taskList} total={dashboardData?.totalDays} /> */}
            </div>
          </div>
          {/* monthly targets */}
          <div className="flex gap-4 mt-4">
            {/* note */}
            {/* <MonthlyNote note={monthlyNote} currMon={currMon} currYear={currYear} /> */}
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
