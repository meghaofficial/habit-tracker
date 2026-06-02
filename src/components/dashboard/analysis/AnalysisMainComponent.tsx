import { useEffect, useState } from "react"
import { axiosPrivate } from "../../../api/axios"
import { MonthlyLineChart } from "../../charts/MonthlyLineChart"
import { ProgressPie } from "../../charts/ProgressPie"
import TodayAllTasks from "../../charts/TodayAllTasks"
import { WeeklyBarChart } from "../../charts/WeeklyBarChart"
import Calendar from "../track/calander/Calendar"
import { motion, AnimatePresence } from "framer-motion";
import { formatDateString } from "../../../helper"
import type { DateLogI, TaskI } from "../../../types"

const AnalysisMainComponent = ({ taskList, monthDashID, log, setLog, todayDate, setTodayDate }: {
  taskList: TaskI[], monthDashID: string,
  log: DateLogI,
  setLog: React.Dispatch<React.SetStateAction<DateLogI>>,
  todayDate: string,
  setTodayDate: React.Dispatch<React.SetStateAction<string>>
}) => {

  const [todayProgress, setTodayProgress] = useState("0");
  const [weeklyAna, setWeeklyAna] = useState<{
    date: string, week: string, range: string, weekDays: string[], taskDone: number[]
  }>({
    date: "", week: "", range: "", weekDays: [], taskDone: []
  });
  const [monthlyAna, setMonthlyAna] = useState<{ dates: number[], tasks: number[] }>({
    dates: [], tasks: []
  });
  const [streakData, setStreakData] = useState<{ streak: number, longestStreak: number, mostConsistentHabits: string[], leastConsistentHabits: string[] }>({
    streak: 0, longestStreak: 0, mostConsistentHabits: [], leastConsistentHabits: []
  })

  const getTodaysActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-today-activity`);
      if (res?.data?.success) {
        setTodayProgress(res?.data?.progress);
        setTodayDate(res?.data?.date);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getWeeklyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-weekly-activity?monthDashID=${monthDashID}`);
      if (res?.data?.success) {
        setWeeklyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getMonthlyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-monthly-activity?monthDashID=${monthDashID}`);
      if (res?.data?.success) {
        setMonthlyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getStreak = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-streak?monthDashID=${monthDashID}`);
      if (res?.data?.success) {
        setStreakData(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  useEffect(() => {
    getTodaysActivity();
    getWeeklyActivity();
    getMonthlyActivity();
    getStreak();
  }, [log?.tasks]);

  return (
    <>
      {/* upper daywise, weekly, todays task */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div className="bg-black/20 rounded-2xl px-2">
          {/* <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Calendar</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{formatDateString(weeklyAna?.date)}</p>
          </div> */}
          <div className="flex items-center justify-center">
            {/* <WeeklyBarChart data={weeklyAna} /> */}
            <Calendar year={(new Date).getFullYear()} month={(new Date).getMonth()} />
          </div>
        </div>
        <div className="bg-black/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Activity</p>
            {/* 3 April 2026 */}
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{formatDateString(todayDate)}</p>
          </div>
          <div className="flex items-center justify-center -mt-2">
            <ProgressPie value={Number(todayProgress)} type="analysis" />
          </div>
        </div>
        <div className="bg-black/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Tasks</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{formatDateString(todayDate)}</p>
          </div>
          <div className="flex items-center justify-center mt-5">
            <TodayAllTasks taskList={taskList} log={log} setLog={setLog} />
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 gap-4">
        <div className="bg-black/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Weekly Activity</p>
            {/* April 2026 */}
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{formatDateString(weeklyAna?.date)}</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-7">
            <WeeklyBarChart data={weeklyAna} maxValue={taskList?.length} />
          </div>
        </div>
        <div className="bg-black/20 rounded-2xl p-4 grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-black/20 p-4 flex flex-col justify-between min-h-37.5">
            <div>
              <span className="text-[13px] tracking-wide text-gray-500">
                Streak
              </span>
            </div>

            <div className="flex items-end justify-between mt-4">
              <span className="text-[64px] leading-none font-bold google-sans">
                {streakData?.streak}
              </span>

              <span className="text-[44px] leading-none">
                🔥
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 p-4 flex flex-col justify-between min-h-37.5">
            <div>
              <span className="text-[13px] tracking-wide text-gray-500">
                Longest Streak
              </span>
            </div>

            <div className="flex items-end justify-between mt-4">
              <span className="text-[52px] leading-none font-bold google-sans">
                {streakData?.longestStreak}
              </span>

              <span className="text-[40px] leading-none">
                🫡
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 p-4 flex flex-col justify-between min-h-35">
            <div>
              <span className="text-[13px] tracking-wide text-gray-500">
                Most Consistent Habit
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 mt-4">
              {/* <span className="text-[36px] leading-none font-bold google-sans line-clamp-1">
                DSA
              </span> */}
              <RotatingText words={streakData?.mostConsistentHabits?.length > 0 ? streakData?.mostConsistentHabits : ['None']} />

              <span className="text-[38px] leading-none shrink-0">
                {streakData?.mostConsistentHabits?.length > 0 ? '🤗' : '😥'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 p-4 flex flex-col justify-between min-h-35">
            <div>
              <span className="text-[13px] tracking-wide text-gray-500">
                Weakest Habit
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 mt-4">
              <RotatingText words={streakData?.leastConsistentHabits?.length > 0 ? streakData?.leastConsistentHabits : ['None']} />

              <span className="text-[38px] leading-none shrink-0">
                {streakData?.leastConsistentHabits?.length > 0 ? '😒' : '😓'}
              </span>
            </div>
          </div>

        </div>
      </div>
      {/* curr month progress */}
      <div className="bg-black/20 rounded-2xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg px-5 py-3">Monthly Activity</p>
          <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{formatDateString(weeklyAna?.date)}</p>
        </div>
        <div className="flex items-center justify-center mt-5 pe-5">
          <MonthlyLineChart data={monthlyAna} />
        </div>
      </div>
    </>
  )
}

function RotatingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  const shouldAnimate = words.length > 1;

  useEffect(() => {
    if (!shouldAnimate) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative h-10 overflow-hidden w-62.5">
      <AnimatePresence mode="wait">
        {shouldAnimate ? (
          <motion.div
            key={words[index]}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-0 w-full text-[36px] leading-none font-bold google-sans line-clamp-1"
            title={words[index]}
          >
            {words[index]}
          </motion.div>
        ) : (
          <div
            className="absolute left-0 w-full text-[36px] leading-none font-bold google-sans line-clamp-1"
            title={words[0]}
          >
            {words[0]}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnalysisMainComponent
