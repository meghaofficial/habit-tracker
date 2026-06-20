import { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { MonthlyLineChart } from "../../charts/MonthlyLineChart";
import { WeeklyBarChart } from "../../charts/WeeklyBarChart";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateString } from "../../../helper";
import type { DateLogI, TaskI, StreakI } from "../../../types";
import { IoDesktopOutline } from "react-icons/io5";
import Card from "../../shared/Card";
import HeatMap from "./HeatMap";

const AnalysisMainComponent = ({
  taskList,
  monthDashID,
  log,
  streakData,
}: {
  taskList: TaskI[];
  monthDashID: string;
  log: DateLogI;
  streakData: StreakI;
}) => {
  const [weeklyAna, setWeeklyAna] = useState<{
    date: string;
    week: string;
    range: string;
    weekDays: string[];
    taskDone: number[];
  }>({
    date: "",
    week: "",
    range: "",
    weekDays: [],
    taskDone: [],
  });
  const [monthlyAna, setMonthlyAna] = useState<{
    dates: number[];
    tasks: number[];
  }>({
    dates: [],
    tasks: [],
  });

  const getWeeklyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/get-weekly-activity?monthDashID=${monthDashID}`,
      );
      if (res?.data?.success) {
        setWeeklyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  };

  const getMonthlyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/get-monthly-activity?monthDashID=${monthDashID}`,
      );
      if (res?.data?.success) {
        setMonthlyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  };

  useEffect(() => {
    getWeeklyActivity();
    getMonthlyActivity();
  }, [log?.tasks]);

  return (
    <>
      <div className="sm:hidden rounded-2xl border border-white/10 bg-black/20 light:bg-black/5 light:border-black/10 p-6 my-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-darkPrimary/15 text-3xl">
            <IoDesktopOutline />
          </div>
          <h3 className="text-xl font-bold">Desktop Experience Available</h3>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            This dashboard is optimized for larger screens. Advanced analytics,
            detailed reports, and management tools are currently available only
            on desktop and laptop devices.
          </p>
          <div className="mt-5 rounded-full bg-darkPrimary/10 px-4 py-2 text-xs font-medium text-darkPrimary">
            Recommended: Desktop or Laptop
          </div>
        </div>
      </div>
      <div className="sm:block hidden">
        <div className="my-4 grid grid-cols-2 gap-4">
          <Card
            heading="Weekly Activity"
            cardWidth="w-full"
            rightOfHeading={
              <p
                className="text-gray-500 text-[10px] cursor-default"
                title="Today's Date"
              >
                {formatDateString(weeklyAna?.date)}
              </p>
            }
          >
            <div className="flex items-center justify-center mt-5 pe-7">
              <WeeklyBarChart data={weeklyAna} maxValue={taskList?.length} />
            </div>
          </Card>

          <Card heading="" cardWidth="w-full">
            <div className="grid grid-cols-2 gap-4">
              {[
                // {
                //   title: "Streak",
                //   logo: "🔥",
                //   data: (
                //     <span className="text-[64px] leading-none font-bold google-sans">
                //       {streakData?.streak}
                //     </span>
                //   ),
                // },
                // {
                //   title: "Longest Streak",
                //   logo: "🫡",
                //   data: (
                //     <span className="text-[64px] leading-none font-bold google-sans">
                //       {streakData?.longestStreak}
                //     </span>
                //   ),
                // },
                {
                  title: "Most Consistent Habit",
                  logo:
                    streakData?.mostConsistentHabits?.length > 0 ? "🤗" : "😥",
                  data: (
                    <RotatingText
                      words={
                        streakData?.mostConsistentHabits?.length > 0
                          ? streakData?.mostConsistentHabits
                          : ["None"]
                      }
                    />
                  ),
                },
                {
                  title: "Weakest Habit",
                  logo:
                    streakData?.leastConsistentHabits?.length > 0 ? "😒" : "😓",
                  data: (
                    <RotatingText
                      words={
                        streakData?.leastConsistentHabits?.length > 0
                          ? streakData?.leastConsistentHabits
                          : ["None"]
                      }
                    />
                  ),
                },
              ].map((d, index) => (
                <div
                  className="rounded-2xl bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10 p-4 flex flex-col justify-between min-h-40"
                  key={index}
                >
                  <div>
                    <span className="text-[13px] tracking-wide text-gray-500">
                      {d.title}
                    </span>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {d.data}

                    <span className="text-[44px] leading-none">{d.logo}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10 p-4 flex flex-col justify-evenly min-h-40 mt-4">
              <div>
                <span className="text-[13px] tracking-wide text-gray-500">
                  Heatmap
                </span>
              </div>

              <div className="flex items-end justify-between mt-4">
                <HeatMap />
                {/* <span className="text-[44px] leading-none">logo</span> */}
              </div>
            </div>
          </Card>
        </div>
        {/* curr month progress */}
        <Card
          heading="Monthly Activity"
          cardWidth="w-full"
          rightOfHeading={
            <p
              className="text-gray-500 text-[10px] cursor-default"
              title="Today's Date"
            >
              {formatDateString(weeklyAna?.date)}
            </p>
          }
          styling="mb-3"
        >
          <div className="flex items-center justify-center mt-5 pe-7">
            <MonthlyLineChart data={monthlyAna} maxValue={taskList?.length} />
          </div>
        </Card>
      </div>
    </>
  );
};

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

export default AnalysisMainComponent;
